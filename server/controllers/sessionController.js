const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
  try {
    const { conversationId, replicaId, personaId } = req.body;

    if (!conversationId || !replicaId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide conversationId and replicaId'
      });
    }

    // Check session limit for free users
    const user = await User.findById(req.user.id);
    if (user.subscription.plan === 'free') {
      if (user.subscription.sessionsUsed >= user.subscription.sessionsLimit) {
        return res.status(403).json({
          success: false,
          message: 'Session limit reached. Please upgrade to premium.',
          sessionsUsed: user.subscription.sessionsUsed,
          sessionsLimit: user.subscription.sessionsLimit
        });
      }
    }

    const session = await Session.create({
      user: req.user.id,
      conversationId,
      replicaId,
      personaId
    });

    // Increment sessions used
    user.subscription.sessionsUsed += 1;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// @desc    Get all user sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sessions = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-messages -emotionData'); // Exclude large fields

    const total = await Session.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: sessions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// @desc    Update session (add emotion data, messages, etc.)
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
  try {
    let session = await Session.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const { emotionData, message, duration, status } = req.body;

    // Add emotion data
    if (emotionData) {
      session.emotionData.push(emotionData);
    }

    // Add message
    if (message) {
      session.messages.push(message);
    }

    // Update duration
    if (duration) {
      session.duration = duration;
    }

    // Update status
    if (status) {
      session.status = status;
      if (status === 'completed' || status === 'interrupted') {
        session.endedAt = Date.now();
      }
    }

    await session.save();

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

// @desc    Rate session
// @route   PUT /api/sessions/:id/rate
// @access  Private
exports.rateSession = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5'
      });
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { rating, feedback },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Rate session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rating session',
      error: error.message
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting session',
      error: error.message
    });
  }
};

// @desc    Get session analytics
// @route   GET /api/sessions/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id });

    const analytics = {
      totalSessions: sessions.length,
      totalDuration: sessions.reduce((acc, s) => acc + s.duration, 0),
      averageDuration: sessions.length > 0 
        ? sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length 
        : 0,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      averageRating: sessions.filter(s => s.rating).length > 0
        ? sessions.filter(s => s.rating).reduce((acc, s) => acc + s.rating, 0) / sessions.filter(s => s.rating).length
        : 0,
      emotionTrends: calculateEmotionTrends(sessions),
      recentSessions: sessions.slice(0, 5).map(s => ({
        id: s._id,
        date: s.createdAt,
        duration: s.duration,
        status: s.status,
        rating: s.rating
      }))
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Helper function to calculate emotion trends
function calculateEmotionTrends(sessions) {
  const emotions = {
    happiness: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0
  };

  let count = 0;

  sessions.forEach(session => {
    session.emotionData.forEach(data => {
      if (data.emotions) {
        Object.keys(emotions).forEach(emotion => {
          emotions[emotion] += data.emotions[emotion] || 0;
        });
        count++;
      }
    });
  });

  if (count > 0) {
    Object.keys(emotions).forEach(emotion => {
      emotions[emotion] = emotions[emotion] / count;
    });
  }

  return emotions;
}

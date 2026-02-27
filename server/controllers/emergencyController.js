/**
 * Emergency Controller
 * Handles crisis detection and emergency notifications
 */

const crisisDetection = require('../services/crisisDetection');
const twilioService = require('../services/twilioService');
const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Analyze session for crisis
// @route   POST /api/emergency/analyze
// @access  Private
exports.analyzeSession = async (req, res) => {
  try {
    const { sessionId, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }

    // Analyze conversation
    const analysis = crisisDetection.analyzeConversation(messages);

    // If crisis detected, log it
    if (analysis.isCrisis) {
      console.log('🚨 CRISIS DETECTED:', {
        userId: req.user.id,
        sessionId,
        level: analysis.crisisLevel,
        score: analysis.crisisScore
      });

      // Update session with crisis flag
      if (sessionId) {
        await Session.findByIdAndUpdate(sessionId, {
          crisisDetected: true,
          crisisLevel: analysis.crisisLevel,
          crisisTimestamp: new Date()
        });
      }
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Crisis analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing session',
      error: error.message
    });
  }
};

// @desc    Trigger emergency notification
// @route   POST /api/emergency/notify
// @access  Private
exports.notifyEmergencyContacts = async (req, res) => {
  try {
    const { sessionId, messages } = req.body;

    // Get user with emergency contacts
    const user = await User.findById(req.user.id);
    
    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No emergency contacts configured'
      });
    }

    // Analyze crisis
    const analysis = crisisDetection.analyzeConversation(messages);

    if (!analysis.requiresIntervention) {
      return res.status(400).json({
        success: false,
        message: 'Crisis level does not require emergency notification'
      });
    }

    // Generate crisis summary
    const summary = crisisDetection.generateCrisisSummary(user, messages, analysis);

    // Notify emergency contacts
    const results = await twilioService.notifyEmergencyContacts(
      user.emergencyContacts,
      summary
    );

    // Log emergency notification
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, {
        emergencyNotified: true,
        emergencyNotificationTime: new Date(),
        emergencyNotificationResults: results
      });
    }

    res.json({
      success: true,
      message: 'Emergency contacts notified',
      contactsNotified: results.filter(r => r.success).length,
      results
    });
  } catch (error) {
    console.error('Emergency notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error notifying emergency contacts',
      error: error.message
    });
  }
};

// @desc    Handle call response (TwiML callback)
// @route   POST /api/emergency/call-response
// @access  Public (Twilio webhook)
exports.handleCallResponse = async (req, res) => {
  const { Digits } = req.body;

  let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

  if (Digits === '1') {
    // Repeat message
    twiml += '<Redirect>/api/emergency/repeat-message</Redirect>';
  } else {
    twiml += '<Say voice="Polly.Joanna">Thank you. Please take immediate action.</Say>';
  }

  twiml += '</Response>';

  res.type('text/xml');
  res.send(twiml);
};

// @desc    Handle call status updates
// @route   POST /api/emergency/call-status
// @access  Public (Twilio webhook)
exports.handleCallStatus = async (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;

  console.log('Call Status Update:', {
    sid: CallSid,
    status: CallStatus,
    duration: CallDuration
  });

  // Log to database if needed
  // You can track call success rates, durations, etc.

  res.status(200).send('OK');
};

// @desc    Get crisis resources
// @route   GET /api/emergency/resources
// @access  Public
exports.getCrisisResources = async (req, res) => {
  try {
    const resources = crisisDetection.getCrisisResources();
    
    res.json({
      success: true,
      resources,
      message: 'If you are in crisis, please call 988 or text HOME to 741741'
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crisis resources'
    });
  }
};

// @desc    Test emergency system
// @route   POST /api/emergency/test
// @access  Private (Admin only)
exports.testEmergencySystem = async (req, res) => {
  try {
    const { phoneNumber, contactName } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const testMessage = 'This is a test of the ZEO AI emergency notification system. No action is required.';

    const result = await twilioService.sendEmergencySMS(phoneNumber, testMessage);

    res.json({
      success: true,
      message: 'Test notification sent',
      result
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test notification',
      error: error.message
    });
  }
};

module.exports = exports;

const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: String,
    required: true
  },
  replicaId: {
    type: String,
    required: true
  },
  personaId: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  emotionData: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    emotions: {
      happiness: Number,
      sadness: Number,
      anger: Number,
      fear: Number,
      surprise: Number,
      disgust: Number,
      neutral: Number
    },
    dominantEmotion: String,
    confidence: Number
  }],
  messages: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: String,
    emotion: String
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'interrupted'],
    default: 'active'
  },
  crisisDetected: {
    type: Boolean,
    default: false
  },
  crisisLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'critical'],
    default: 'none'
  },
  crisisTimestamp: {
    type: Date,
    default: null
  },
  emergencyNotified: {
    type: Boolean,
    default: false
  },
  emergencyNotificationTime: {
    type: Date,
    default: null
  },
  emergencyNotificationResults: {
    type: Array,
    default: []
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
SessionSchema.index({ user: 1, createdAt: -1 });
SessionSchema.index({ conversationId: 1 });

module.exports = mongoose.model('Session', SessionSchema);

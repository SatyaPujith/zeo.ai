const express = require('express');
const router = express.Router();
const {
  analyzeSession,
  notifyEmergencyContacts,
  handleCallResponse,
  handleCallStatus,
  getCrisisResources,
  testEmergencySystem
} = require('../controllers/emergencyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/resources', getCrisisResources);
router.post('/call-response', handleCallResponse);
router.post('/call-status', handleCallStatus);

// Protected routes
router.post('/analyze', protect, analyzeSession);
router.post('/notify', protect, notifyEmergencyContacts);

// Admin only
router.post('/test', protect, authorize('admin'), testEmergencySystem);

module.exports = router;

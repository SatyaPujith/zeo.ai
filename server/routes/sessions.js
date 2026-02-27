const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  rateSession,
  deleteSession,
  getAnalytics
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSessions)
  .post(createSession);

router.get('/analytics', getAnalytics);

router.route('/:id')
  .get(getSession)
  .put(updateSession)
  .delete(deleteSession);

router.put('/:id/rate', rateSession);

module.exports = router;

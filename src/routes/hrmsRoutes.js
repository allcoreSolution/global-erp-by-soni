const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getDailyAttendance,
  requestLeave,
  getLeaveRequests,
  approveLeave
} = require('../controllers/hrmsController');
const { protect, checkPermission } = require('../middlewares/authMiddleware');

// Attendance Routes
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/attendance', protect, checkPermission('manage_hrms'), getDailyAttendance);

// Leave Routes
router.post('/leaves', protect, requestLeave);
router.get('/leaves', protect, checkPermission('manage_hrms'), getLeaveRequests);
router.patch('/leaves/:id/approve', protect, checkPermission('manage_hrms'), approveLeave);

module.exports = router;

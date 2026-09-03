const { Attendance, LeaveRequest, ExpenseClaim, PerformanceRating, EmployeeTarget } = require('../models/HRMS');

// Attendance Controllers
const checkIn = async (req, res, next) => {
  const dateStr = new Date().toISOString().split('T')[0];

  try {
    const alreadyCheckedIn = await Attendance.findOne({ employee: req.user._id, date: dateStr });
    if (alreadyCheckedIn) {
      res.status(400);
      return next(new Error('Already checked in for today'));
    }

    const attendance = await Attendance.create({
      employee: req.user._id,
      date: dateStr,
      checkIn: new Date(),
      status: 'Present'
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  const dateStr = new Date().toISOString().split('T')[0];

  try {
    const attendance = await Attendance.findOne({ employee: req.user._id, date: dateStr });
    if (!attendance) {
      res.status(400);
      return next(new Error('No check-in record found for today'));
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

const getDailyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ company: req.user?.companyId, company: req.user?.companyId }).populate('employee', 'username email');
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// Leave Controllers
const requestLeave = async (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  try {
    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason
    });
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

const getLeaveRequests = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ company: req.user?.companyId, company: req.user?.companyId }).populate('employee', 'username email');
    res.json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // Approved or Rejected

  try {
    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      res.status(404);
      return next(new Error('Leave request not found'));
    }

    leave.status = status;
    leave.approvedBy = req.user._id;
    await leave.save();

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getDailyAttendance,
  requestLeave,
  getLeaveRequests,
  approveLeave
};

const mongoose = require('mongoose');

// Daily Attendance Schema
const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'On Leave'], default: 'Present' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

// Leave Request Schema
const leaveRequestSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['Sick Leave', 'Casual Leave', 'Earned Leave'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = { Attendance, LeaveRequest };

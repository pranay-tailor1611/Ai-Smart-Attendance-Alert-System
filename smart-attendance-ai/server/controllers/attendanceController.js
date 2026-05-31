import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import {
  getStudentStats,
  getMonthlyTrend,
  getSubjectWise,
  calculateAttendancePercent,
} from '../services/attendanceService.js';

export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, subject, status } = req.body;
    const record = await Attendance.findOneAndUpdate(
      { studentId, date: new Date(date), subject },
      { status, markedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const markBulk = async (req, res) => {
  try {
    const { records } = req.body;
    const results = [];
    for (const r of records) {
      const record = await Attendance.findOneAndUpdate(
        { studentId: r.studentId, date: new Date(r.date), subject: r.subject },
        { status: r.status, markedBy: req.user._id },
        { upsert: true, new: true }
      );
      results.push(record);
    }
    res.status(201).json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getRecords = async (req, res) => {
  const filter = {};
  if (req.user.role === 'student') {
    if (!req.user.studentProfile) {
      return res.status(400).json({ message: 'No student profile linked' });
    }
    filter.studentId = req.user.studentProfile;
  } else if (req.query.studentId) {
    filter.studentId = req.query.studentId;
  }
  if (req.query.subject) filter.subject = req.query.subject;
  if (req.query.date) filter.date = new Date(req.query.date);
  const records = await Attendance.find(filter)
    .populate('studentId', 'name enrollmentNumber course')
    .sort({ date: -1 });
  res.json(records);
};

export const getMyAttendance = async (req, res) => {
  const user = req.user;
  if (!user.studentProfile) {
    return res.status(400).json({ message: 'No student profile linked' });
  }
  const stats = await getStudentStats(user.studentProfile);
  const { records: _records, ...statsSummary } = stats;
  const monthlyTrend = await getMonthlyTrend(user.studentProfile);
  const subjectWise = await getSubjectWise(user.studentProfile);
  res.json({ stats: statsSummary, monthlyTrend, subjectWise });
};

export const getTodaySummary = async (_req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const today = await Attendance.find({ date: { $gte: start, $lte: end } }).populate(
    'studentId',
    'name enrollmentNumber'
  );
  const present = today.filter((t) => t.status === 'Present').length;
  res.json({ total: today.length, present, absent: today.length - present, records: today });
};

export const getAllStats = async (_req, res) => {
  const students = await Student.find();
  const data = await Promise.all(
    students.map(async (s) => {
      const stats = await getStudentStats(s._id);
      return {
        studentId: s._id,
        name: s.name,
        enrollmentNumber: s.enrollmentNumber,
        course: s.course,
        percent: stats.percent,
        level: stats.level,
        present: stats.present,
        total: stats.total,
        classesNeededFor75: stats.classesNeededFor75,
      };
    })
  );
  res.json(data);
};

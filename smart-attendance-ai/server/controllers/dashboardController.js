import Student from '../models/Student.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';
import Recommendation from '../models/Recommendation.js';
import { getStudentStats, getMonthlyTrend, getSubjectWise } from '../services/attendanceService.js';

export const adminDashboard = async (_req, res) => {
  const [totalStudents, totalFaculty, students] = await Promise.all([
    Student.countDocuments(),
    User.countDocuments({ role: 'faculty' }),
    Student.find(),
  ]);

  const statsList = await Promise.all(students.map((s) => getStudentStats(s._id)));
  const percents = statsList.filter((st) => st.total > 0).map((st) => st.percent);
  const avgAttendance = percents.length
    ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
    : 0;

  const defaulters = students
    .map((s, i) => ({
      _id: s._id,
      name: s.name,
      enrollmentNumber: s.enrollmentNumber,
      course: s.course,
      percent: statsList[i].percent,
      level: statsList[i].level,
    }))
    .filter((s) => s.percent < 75)
    .sort((a, b) => a.percent - b.percent);

  const levelDistribution = { green: 0, yellow: 0, red: 0 };
  statsList.forEach((s) => {
    if (s.total > 0) levelDistribution[s.level] += 1;
  });

  res.json({
    totalStudents,
    totalFaculty,
    avgAttendance,
    defaulters,
    levelDistribution,
    recentAlerts: await Alert.find().sort({ createdAt: -1 }).limit(10).populate('studentId', 'name'),
  });
};

export const facultyDashboard = async (req, res) => {
  const students = await Student.find();
  const statsList = await Promise.all(students.map((s) => getStudentStats(s._id)));
  const defaulters = students
    .map((s, i) => ({
      name: s.name,
      enrollmentNumber: s.enrollmentNumber,
      percent: statsList[i].percent,
    }))
    .filter((s) => s.percent < 75);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const Attendance = (await import('../models/Attendance.js')).default;
  const todayRecords = await Attendance.find({ date: { $gte: start } });

  res.json({
    totalStudents: students.length,
    todayMarked: todayRecords.length,
    defaulters,
    subjectSummary: await aggregateSubjectToday(todayRecords),
  });
};

async function aggregateSubjectToday(records) {
  const map = {};
  records.forEach((r) => {
    if (!map[r.subject]) map[r.subject] = { present: 0, total: 0 };
    map[r.subject].total += 1;
    if (r.status === 'Present') map[r.subject].present += 1;
  });
  return Object.entries(map).map(([subject, v]) => ({
    subject,
    ...v,
    percent: v.total ? Math.round((v.present / v.total) * 100) : 0,
  }));
}

export const studentDashboard = async (req, res) => {
  const studentId = req.user.studentProfile;
  if (!studentId) return res.status(400).json({ message: 'No student profile' });

  const stats = await getStudentStats(studentId);
  const { records: _records, ...statsSummary } = stats;
  const monthlyTrend = await getMonthlyTrend(studentId);
  const subjectWise = await getSubjectWise(studentId);
  const alerts = await Alert.find({ studentId }).sort({ createdAt: -1 }).limit(20);
  const recommendation = await Recommendation.findOne({ studentId }).sort({ createdAt: -1 });

  res.json({ stats: statsSummary, monthlyTrend, subjectWise, alerts, recommendation });
};

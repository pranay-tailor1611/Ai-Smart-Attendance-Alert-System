import { runAttendanceWorkflow, runBulkMonitoring } from '../agents/attendanceWorkflow.js';
import Alert from '../models/Alert.js';
import Recommendation from '../models/Recommendation.js';

export const runWorkflow = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await runAttendanceWorkflow(studentId, req.user._id);
    res.json({
      message: 'AI workflow completed',
      monitoring: result.monitoring,
      prediction: result.prediction,
      alerts: result.alerts,
      recommendations: result.recommendations,
      reportMeta: result.reportMeta,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const runBulk = async (req, res) => {
  try {
    const results = await runBulkMonitoring(req.user._id);
    res.json({ message: 'Bulk AI monitoring completed', results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlerts = async (req, res) => {
  const filter = {};
  if (req.user.role === 'student' && req.user.studentProfile) {
    filter.studentId = req.user.studentProfile;
  } else if (req.query.studentId) {
    filter.studentId = req.query.studentId;
  }
  const alerts = await Alert.find(filter).sort({ createdAt: -1 }).populate('studentId', 'name enrollmentNumber');
  res.json(alerts);
};

export const markAlertRead = async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });
  if (
    req.user.role === 'student' &&
    req.user.studentProfile &&
    String(alert.studentId) !== String(req.user.studentProfile)
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }
  alert.read = true;
  await alert.save();
  res.json(alert);
};

export const getRecommendations = async (req, res) => {
  const filter = {};
  if (req.user.role === 'student' && req.user.studentProfile) {
    filter.studentId = req.user.studentProfile;
  } else if (req.query.studentId) {
    filter.studentId = req.query.studentId;
  }
  const items = await Recommendation.find(filter).sort({ createdAt: -1 }).populate('studentId', 'name');
  res.json(items);
};

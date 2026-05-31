import Student from '../models/Student.js';
import Recommendation from '../models/Recommendation.js';
import { getStudentStats } from '../services/attendanceService.js';
import {
  buildReportRows,
  generatePdfBuffer,
  generateExcelBuffer,
  logReport,
} from '../services/reportService.js';

async function enrichStudents() {
  const students = await Student.find();
  return Promise.all(
    students.map(async (s) => {
      const stats = await getStudentStats(s._id);
      const rec = await Recommendation.findOne({ studentId: s._id }).sort({ createdAt: -1 });
      return {
        name: s.name,
        enrollmentNumber: s.enrollmentNumber,
        course: s.course,
        semester: s.semester,
        section: s.section,
        percent: stats.percent,
        classesNeededFor75: stats.classesNeededFor75,
        riskStatus: rec?.riskStatus || (stats.percent < 75 ? 'high' : stats.percent < 85 ? 'medium' : 'low'),
        recommendations: rec?.items || [],
      };
    })
  );
}

export const downloadPdf = async (req, res) => {
  try {
    const data = await enrichStudents();
    const rows = await buildReportRows(data);
    const buffer = generatePdfBuffer(rows, 'Smart Attendance Report');
    await logReport({
      title: 'Attendance PDF Export',
      type: 'pdf',
      userId: req.user._id,
      recordCount: rows.length,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.pdf');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadExcel = async (req, res) => {
  try {
    const data = await enrichStudents();
    const rows = await buildReportRows(data);
    const buffer = generateExcelBuffer(rows);
    await logReport({
      title: 'Attendance Excel Export',
      type: 'excel',
      userId: req.user._id,
      recordCount: rows.length,
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.xlsx');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listReports = async (req, res) => {
  const Report = (await import('../models/Report.js')).default;
  const reports = await Report.find().sort({ createdAt: -1 }).limit(50).populate('generatedBy', 'name email');
  res.json(reports);
};

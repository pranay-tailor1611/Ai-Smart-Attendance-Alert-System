import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Report from '../models/Report.js';

export async function buildReportRows(studentsWithStats) {
  return studentsWithStats.map((s) => ({
    Name: s.name,
    Enrollment: s.enrollmentNumber,
    Course: s.course,
    'Attendance %': s.percent,
    'Risk Status': s.riskStatus || (s.percent < 75 ? 'high' : s.percent < 85 ? 'medium' : 'low'),
    'Classes for 75%': s.classesNeededFor75 ?? 0,
    Recommendations: (s.recommendations || []).join('; '),
  }));
}

export function generatePdfBuffer(rows, title = 'Attendance Report') {
  const doc = new jsPDF();
  const safeRows =
    rows?.length > 0
      ? rows
      : [{ Name: '—', Enrollment: '—', Course: '—', 'Attendance %': 0, 'Risk Status': '—', 'Classes for 75%': 0, Recommendations: 'No data' }];

  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.autoTable({
    startY: 34,
    head: [Object.keys(safeRows[0])],
    body: safeRows.map((r) => Object.values(r)),
    styles: { fontSize: 8 },
  });
  return Buffer.from(doc.output('arraybuffer'));
}

export function generateExcelBuffer(rows, sheetName = 'Attendance') {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export async function logReport({ title, type, userId, filters, recordCount, metadata }) {
  return Report.create({ title, type, generatedBy: userId, filters, recordCount, metadata });
}

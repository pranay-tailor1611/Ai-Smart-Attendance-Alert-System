import Attendance from '../models/Attendance.js';

/** Attendance % = (Present / Total) × 100 */
export function calculateAttendancePercent(records) {
  if (!records?.length) return 0;
  const present = records.filter((r) => r.status === 'Present').length;
  return Math.round((present / records.length) * 10000) / 100;
}

export function getAlertLevel(percent) {
  if (percent >= 85) return 'green';
  if (percent >= 75) return 'yellow';
  return 'red';
}

/** Classes needed to reach target% assuming future classes are all Present */
export function classesNeededForTarget(present, total, targetPercent = 75) {
  if (total === 0) return 0;
  const current = (present / total) * 100;
  if (current >= targetPercent) return 0;
  const needed = Math.ceil((targetPercent * total - 100 * present) / (100 - targetPercent));
  return Math.max(0, needed);
}

export async function getStudentAttendanceRecords(studentId, filters = {}) {
  const query = { studentId };
  if (filters.subject) query.subject = filters.subject;
  if (filters.from || filters.to) {
    query.date = {};
    if (filters.from) query.date.$gte = new Date(filters.from);
    if (filters.to) query.date.$lte = new Date(filters.to);
  }
  return Attendance.find(query).sort({ date: -1 });
}

export async function getStudentStats(studentId) {
  const records = await getStudentAttendanceRecords(studentId);
  const present = records.filter((r) => r.status === 'Present').length;
  const total = records.length;
  const percent = calculateAttendancePercent(records);
  return {
    records,
    present,
    total,
    percent,
    level: getAlertLevel(percent),
    classesNeededFor75: classesNeededForTarget(present, total, 75),
  };
}

export async function getMonthlyTrend(studentId, months = 6) {
  const records = await getStudentAttendanceRecords(studentId);
  const map = new Map();
  records.forEach((r) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, { present: 0, total: 0 });
    const bucket = map.get(key);
    bucket.total += 1;
    if (r.status === 'Present') bucket.present += 1;
  });
  const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-months);
  return sorted.map(([month, { present, total }]) => ({
    month,
    percent: total ? Math.round((present / total) * 100) : 0,
    present,
    total,
  }));
}

export async function getSubjectWise(studentId) {
  const records = await getStudentAttendanceRecords(studentId);
  const subjects = {};
  records.forEach((r) => {
    if (!subjects[r.subject]) subjects[r.subject] = { present: 0, total: 0 };
    subjects[r.subject].total += 1;
    if (r.status === 'Present') subjects[r.subject].present += 1;
  });
  return Object.entries(subjects).map(([subject, { present, total }]) => ({
    subject,
    present,
    total,
    percent: total ? Math.round((present / total) * 100) : 0,
  }));
}

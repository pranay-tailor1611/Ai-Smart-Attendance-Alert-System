import { Annotation, StateGraph, END } from '@langchain/langgraph';
import Student from '../models/Student.js';
import Alert from '../models/Alert.js';
import Recommendation from '../models/Recommendation.js';
import {
  getStudentStats,
  getMonthlyTrend,
  getSubjectWise,
  getAlertLevel,
} from '../services/attendanceService.js';
import { generateWithGemini, parseJsonFromText } from '../services/geminiService.js';
import { sendAttendanceAlert } from '../services/emailService.js';
import { buildReportRows, logReport } from '../services/reportService.js';

const WorkflowState = Annotation.Root({
  studentId: Annotation(),
  triggeredBy: Annotation(),
  student: Annotation(),
  stats: Annotation(),
  monthlyTrend: Annotation(),
  subjectWise: Annotation(),
  monitoring: Annotation(),
  prediction: Annotation(),
  alerts: Annotation(),
  recommendations: Annotation(),
  reportMeta: Annotation(),
  errors: Annotation({ reducer: (a, b) => [...(a || []), ...(b || [])], default: () => [] }),
});

async function loadStudent(state) {
  const student = await Student.findById(state.studentId);
  if (!student) throw new Error('Student not found');
  const stats = await getStudentStats(state.studentId);
  const monthlyTrend = await getMonthlyTrend(state.studentId);
  const subjectWise = await getSubjectWise(state.studentId);
  return { student, stats, monthlyTrend, subjectWise };
}

/** Agent 1: Attendance Monitoring */
async function monitoringAgent(state) {
  const { stats, subjectWise } = state;
  const defaulter = stats.percent < 75;
  const monitoring = {
    attendancePercent: stats.percent,
    level: stats.level,
    present: stats.present,
    total: stats.total,
    defaulter,
    weakestSubject: subjectWise.sort((a, b) => a.percent - b.percent)[0]?.subject || null,
    analyzedAt: new Date().toISOString(),
  };
  return { monitoring };
}

/** Agent 2: Attendance Prediction */
async function predictionAgent(state) {
  const { student, stats, monthlyTrend } = state;
  const trendText = monthlyTrend.map((m) => `${m.month}: ${m.percent}%`).join(', ');
  const fallback = {
    predictedNextMonthPercent: stats.percent,
    atRisk: stats.percent < 75,
    classesNeededFor75: stats.classesNeededFor75,
    pattern: stats.percent >= 85 ? 'stable' : stats.percent >= 75 ? 'declining_slightly' : 'at_risk',
  };
  const prompt = `You are an attendance prediction agent. Analyze this student data and respond ONLY with JSON:
{"predictedNextMonthPercent":number,"atRisk":boolean,"classesNeededFor75":number,"pattern":"stable|declining_slightly|at_risk","insight":"one sentence"}

Student: ${student.name}
Current attendance: ${stats.percent}%
Present/Total: ${stats.present}/${stats.total}
Monthly trend: ${trendText || 'no data'}
Classes needed for 75%: ${stats.classesNeededFor75}`;
  const raw = await generateWithGemini(prompt, JSON.stringify(fallback));
  const parsed = parseJsonFromText(raw) || fallback;
  return { prediction: { ...fallback, ...parsed } };
}

/** Agent 3: Alert Generation */
async function alertAgent(state) {
  const { student, stats, monitoring, prediction } = state;
  const level = getAlertLevel(stats.percent);
  const title =
    level === 'red'
      ? 'Critical: Attendance below 75%'
      : level === 'yellow'
        ? 'Warning: Attendance between 75-85%'
        : 'Good standing: Attendance above 85%';

  let message = `Your attendance is ${stats.percent}%. `;
  if (stats.percent < 75) {
    message += `You need approximately ${stats.classesNeededFor75} more present classes to reach 75%.`;
  } else if (prediction?.insight) {
    message += prediction.insight;
  }

  const alert = await Alert.create({
    studentId: student._id,
    level,
    title,
    message,
    attendancePercent: stats.percent,
  });

  let emailSent = false;
  if (level === 'red' || level === 'yellow') {
    const emailResult = await sendAttendanceAlert({
      to: student.email,
      studentName: student.name,
      percent: stats.percent,
      level,
      message,
    });
    emailSent = emailResult.sent;
    if (emailSent) {
      alert.emailSent = true;
      await alert.save();
    }
  }

  return {
    alerts: [{ alert, monitoring, emailSent }],
  };
}

/** Agent 4: Recommendation */
async function recommendationAgent(state) {
  const { student, stats, prediction, subjectWise } = state;
  const fallbackItems = [
    stats.classesNeededFor75 > 0
      ? `Attend the next ${stats.classesNeededFor75} classes continuously to reach 75%.`
      : 'Maintain your current attendance streak.',
    subjectWise[0]
      ? `Focus on ${subjectWise.sort((a, b) => a.percent - b.percent)[0].subject} — lowest subject attendance.`
      : 'Avoid missing laboratory sessions.',
    stats.percent < 75 ? 'Meet your class coordinator to discuss recovery plan.' : 'Keep up consistent attendance.',
  ];
  const prompt = `Generate 3-5 personalized attendance recommendations as JSON array of strings only.
Student: ${student.name}, Attendance: ${stats.percent}%, Classes needed for 75%: ${stats.classesNeededFor75}
Prediction: ${JSON.stringify(prediction)}
Subjects: ${JSON.stringify(subjectWise)}
Example: ["Attend next 6 classes continuously.", "Avoid missing laboratory sessions."]
Respond with JSON: {"items":["..."],"summary":"one line","riskStatus":"low|medium|high"}`;
  const raw = await generateWithGemini(prompt, JSON.stringify({ items: fallbackItems, summary: 'Rule-based recommendations', riskStatus: stats.percent < 75 ? 'high' : stats.percent < 85 ? 'medium' : 'low' }));
  const parsed = parseJsonFromText(raw) || { items: fallbackItems, summary: 'Recommendations generated', riskStatus: stats.percent < 75 ? 'high' : 'medium' };
  const doc = await Recommendation.create({
    studentId: student._id,
    items: parsed.items || fallbackItems,
    summary: parsed.summary,
    classesNeededFor75: stats.classesNeededFor75,
    riskStatus: parsed.riskStatus || (stats.percent < 75 ? 'high' : 'low'),
  });
  return { recommendations: [doc] };
}

/** Agent 5: Report metadata */
async function reportAgent(state) {
  const { student, stats, recommendations } = state;
  const rec = recommendations?.[0];
  const meta = await logReport({
    title: `AI Workflow - ${student.name}`,
    type: 'summary',
    userId: state.triggeredBy,
    filters: { studentId: student._id },
    recordCount: stats.total,
    metadata: {
      percent: stats.percent,
      riskStatus: rec?.riskStatus,
      prediction: state.prediction,
    },
  });
  return { reportMeta: meta };
}

const graph = new StateGraph(WorkflowState)
  .addNode('loadStudent', loadStudent)
  .addNode('runMonitoring', monitoringAgent)
  .addNode('runPrediction', predictionAgent)
  .addNode('runAlerts', alertAgent)
  .addNode('runRecommendations', recommendationAgent)
  .addNode('runReport', reportAgent)
  .addEdge('__start__', 'loadStudent')
  .addEdge('loadStudent', 'runMonitoring')
  .addEdge('runMonitoring', 'runPrediction')
  .addEdge('runPrediction', 'runAlerts')
  .addEdge('runAlerts', 'runRecommendations')
  .addEdge('runRecommendations', 'runReport')
  .addEdge('runReport', END);

const compiled = graph.compile();

export async function runAttendanceWorkflow(studentId, triggeredBy) {
  const result = await compiled.invoke({
    studentId,
    triggeredBy,
    errors: [],
  });
  return result;
}

export async function runBulkMonitoring(triggeredBy) {
  const students = await Student.find();
  const results = [];
  for (const s of students) {
    try {
      const r = await runAttendanceWorkflow(s._id.toString(), triggeredBy);
      results.push({ studentId: s._id, success: true, percent: r.stats?.percent });
    } catch (err) {
      results.push({ studentId: s._id, success: false, error: err.message });
    }
  }
  return results;
}

export { buildReportRows };

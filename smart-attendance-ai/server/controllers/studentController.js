import Student from '../models/Student.js';
import User from '../models/User.js';
import { getStudentStats } from '../services/attendanceService.js';
import Recommendation from '../models/Recommendation.js';

export const listStudents = async (_req, res) => {
  const students = await Student.find().sort({ name: 1 });
  res.json(students);
};

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  await User.updateMany({ studentProfile: student._id }, { $unset: { studentProfile: 1 } });
  res.json({ message: 'Student deleted' });
};

export const getStudentDetail = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const stats = await getStudentStats(student._id);
  const latestRec = await Recommendation.findOne({ studentId: student._id }).sort({ createdAt: -1 });
  res.json({ student, stats, latestRecommendation: latestRec });
};

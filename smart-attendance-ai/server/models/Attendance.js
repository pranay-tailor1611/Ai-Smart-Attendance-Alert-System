import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);

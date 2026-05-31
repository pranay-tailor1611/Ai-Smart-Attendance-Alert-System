import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    level: { type: String, enum: ['green', 'yellow', 'red'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    attendancePercent: { type: Number, required: true },
    read: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);

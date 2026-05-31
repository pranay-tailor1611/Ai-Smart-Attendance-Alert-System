import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    items: [{ type: String, required: true }],
    summary: { type: String },
    classesNeededFor75: { type: Number },
    riskStatus: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    generatedBy: { type: String, default: 'gemini-agent' },
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);

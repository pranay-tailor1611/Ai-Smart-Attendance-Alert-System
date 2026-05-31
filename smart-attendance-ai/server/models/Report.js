import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'excel', 'summary'], required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filters: { type: mongoose.Schema.Types.Mixed },
    recordCount: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);

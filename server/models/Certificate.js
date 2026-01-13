import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  score: { type: Number, required: true },
  issuedAt: { type: Date, default: Date.now },
  // enforce single-download if required
  downloadCount: { type: Number, default: 0 },
  lastDownloadedAt: { type: Date },
  // optional URL to a rendered certificate (can be generated later)
  certificateUrl: { type: String }
}, { timestamps: true });

// Ensure only one certificate per user per course at DB level
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;

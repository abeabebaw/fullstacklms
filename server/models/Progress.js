import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  completedLectures: [{ type: String }], // lectureId strings
  completed: { type: Boolean, default: false },
  progressPercent: { type: Number, default: 0 }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;

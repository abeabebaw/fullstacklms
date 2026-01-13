import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  selectedOptionId: { type: String }
}, { _id: false });

const quizResultSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [answerSchema],
  scorePercent: { type: Number },
  passed: { type: Boolean },
}, { timestamps: true });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export default QuizResult;

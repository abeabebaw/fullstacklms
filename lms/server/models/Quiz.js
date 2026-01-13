import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [optionSchema],
  correctOptionId: { type: String }, // stored but not sent to students
  points: { type: Number, default: 1 }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  createdBy: { type: String, required: true }, // userId of educator
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;

import Quiz from '../models/Quiz.js';
import mongoose from 'mongoose';
import QuizResult from '../models/QuizResult.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';

// Create a quiz (educator)
export const createQuiz = async (req, res) => {
  try {
    const { courseId, title, description, questions } = req.body;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!courseId || !title) return res.status(400).json({ success: false, message: 'courseId and title are required' });

    // ensure the user is the course educator
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (String(course.educator) !== String(userId)) return res.status(403).json({ success: false, message: 'Only the educator may create quizzes for this course' });

    const quiz = await Quiz.create({ courseId, title, description, questions, createdBy: String(userId) });
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get quizzes for a course (students receive sanitized quizzes without correct answers)
export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

    const quizzes = await Quiz.find({ courseId });

    // If requester is the educator for the course, return full quizzes
    const course = await Course.findById(courseId);
    const isEducator = userId && course && String(course.educator) === String(userId);

    const sanitized = quizzes.map(q => {
      if (isEducator) return q;
      const obj = q.toObject();
      obj.questions = (obj.questions || []).map(qq => ({ questionId: qq.questionId, questionText: qq.questionText, options: qq.options, points: qq.points }));
      return obj;
    });

    res.json({ success: true, quizzes: sanitized });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    // validate id to avoid Mongoose CastError when non-objectId values like 'my' are used
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
    }
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const course = await Course.findById(quiz.courseId);
    const isEducator = userId && course && String(course.educator) === String(userId);

    if (!isEducator) {
      const obj = quiz.toObject();
      obj.questions = (obj.questions || []).map(qq => ({ questionId: qq.questionId, questionText: qq.questionText, options: qq.options, points: qq.points }));
      return res.json({ success: true, quiz: obj });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quiz id
    const { answers } = req.body; // [{ questionId, selectedOptionId }]
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const questionMap = {};
    let totalPoints = 0;
    quiz.questions.forEach(q => { questionMap[q.questionId] = q; totalPoints += (q.points || 1); });

    let earned = 0;
    const details = [];
    (answers || []).forEach(a => {
      const q = questionMap[a.questionId];
      const correct = q && q.correctOptionId && String(q.correctOptionId) === String(a.selectedOptionId);
      if (correct) earned += (q.points || 1);
      details.push({ questionId: a.questionId, selectedOptionId: a.selectedOptionId, correct: !!correct, points: q?.points || 1 });
    });

    const scorePercent = totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
    const passed = scorePercent >= 50;

    // store result
    const result = await QuizResult.create({ userId: String(userId), courseId: quiz.courseId, quizId: quiz._id, answers, scorePercent, passed });

    // Optionally auto-issue certificate if user completed course and passed
    try {
      const progress = await Progress.findOne({ userId: String(userId), courseId: quiz.courseId });
      if (progress && progress.completed && passed) {
        // avoid duplicate certificate if exists
        const existing = await Certificate.findOne({ userId: String(userId), courseId: quiz.courseId });
        if (!existing) {
          const certId = `cert_${(Math.random().toString(36).slice(2,10))}`;
          await Certificate.create({ certificateId: certId, userId: String(userId), courseId: quiz.courseId, score: scorePercent });
        }
      }
    } catch (e) {
      console.error('Auto certificate error:', e);
    }

    res.json({ success: true, scorePercent, passed, details, result });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getMyQuizResults = async (req, res) => {
  try {
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const results = await QuizResult.find({ userId: String(userId) }).sort({ createdAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    console.error('Get my quiz results error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getMyQuizzes = async (req, res) => {
  try {
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const quizzes = await Quiz.find({ createdBy: String(userId) }).sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    console.error('Get my quizzes error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (String(quiz.createdBy) !== String(userId)) return res.status(403).json({ success: false, message: 'Not allowed' });

    // update allowed fields: title, description, questions
    quiz.title = payload.title || quiz.title;
    quiz.description = payload.description || quiz.description;
    if (Array.isArray(payload.questions)) quiz.questions = payload.questions;
    await quiz.save();
    res.json({ success: true, quiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    if (String(quiz.createdBy) !== String(userId)) return res.status(403).json({ success: false, message: 'Not allowed' });

    await Quiz.findByIdAndDelete(id);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Check a single answer without revealing the correct option id
export const checkAnswer = async (req, res) => {
  try {
    const { id } = req.params; // quiz id
    const { questionId, selectedOptionId } = req.body;
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid quiz id' });
    }
    if (!questionId || !selectedOptionId) {
      return res.status(400).json({ success: false, message: 'questionId and selectedOptionId are required' });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const q = (quiz.questions || []).find(qq => String(qq.questionId) === String(questionId));
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });

    const correct = q.correctOptionId && String(q.correctOptionId) === String(selectedOptionId);
    return res.json({ success: true, correct: !!correct });
  } catch (error) {
    console.error('Check answer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

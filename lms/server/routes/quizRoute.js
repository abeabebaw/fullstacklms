import express from 'express';
import { createQuiz, getQuizzesByCourse, getQuizById, submitQuiz, getMyQuizResults, getMyQuizzes, updateQuiz, deleteQuiz, checkAnswer } from '../controllers/quizController.js';

const router = express.Router();

router.post('/create', createQuiz);
router.get('/course/:courseId', getQuizzesByCourse);
// educator/student specific endpoints first
router.get('/my/results', getMyQuizResults);
router.get('/my', getMyQuizzes);
// submit and id-specific operations
router.post('/:id/check', checkAnswer);
router.post('/:id/submit', submitQuiz);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

export default router;

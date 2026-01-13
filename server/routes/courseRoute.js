import express from 'express';
import { getAllCourse, getCourseId, purchaseCourse, verifyPayment, rateCourse, getCourseProgress, completeLecture, resetCourseProgress, streamLecture } from '../controllers/courseController.js';

const courseRouter = express.Router();

// ✅ Specific routes FIRST
courseRouter.get('/all', getAllCourse);
courseRouter.get('/verify-payment', verifyPayment);

// ✅ Dynamic routes LAST
courseRouter.post('/purchase', purchaseCourse);
// Rate a course (only for authenticated, enrolled users)
courseRouter.post('/:id/rate', rateCourse);
// progress endpoints
courseRouter.get('/:id/progress', getCourseProgress);
courseRouter.post('/:courseId/lecture/:lectureId/complete', completeLecture);
// reset progress
courseRouter.post('/:id/progress/reset', resetCourseProgress);

// Dynamic route (course details) - keep last so the more specific routes above match first
courseRouter.get('/:id', getCourseId);

// Secure lecture streaming
courseRouter.get('/stream/:lectureId', streamLecture);

export default courseRouter;

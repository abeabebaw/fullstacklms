import express from 'express';
import { 
  addCourse, 
  getEducatorCourses, 
  updateRoleToEducator,
  educatorDashboardData,
  getEnrolledStudentsData, // Add this
  updateCourseById
} from '../controllers/educatorController.js';
import upload from '../config/multer.js';
import { protectEducator } from '../middleware/authMiddleware.js';

import educatorRequestController from '../controllers/educatorRequestController.js';

const educatorRouter = express.Router();

educatorRouter.get('/update-role', protectEducator, updateRoleToEducator);
// accept thumbnail image + optional multiple lectureFiles
educatorRouter.post('/add-course', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'lectureFiles', maxCount: 50 }
]), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData); // Add this

// Update an existing course by id (multipart for optional thumbnail & lecture files)
educatorRouter.put('/course/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'lectureFiles', maxCount: 50 }
]), protectEducator, updateCourseById);

// Student submits educator application (CV upload) - require auth via Clerk middleware
// Live duplicate check (email/phone) - no file upload
educatorRouter.post('/request/check', async (req, res, next) => educatorRequestController.checkDuplicate(req, res, next));

educatorRouter.post('/request', upload.single('cv'), async (req, res, next) => {
  // req.auth() is available via clerkMiddleware in server.js
  return educatorRequestController.createEducatorRequest(req, res, next);
});

// Student can fetch their requests
educatorRouter.get('/request/my', async (req, res, next) => educatorRequestController.getMyRequests(req, res, next));

export default educatorRouter;

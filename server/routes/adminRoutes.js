import express from 'express';
import adminController from '../controllers/adminController.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes protected
router.use(adminOnly);

// Users
router.get('/users', adminController.listUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Courses
router.get('/courses', adminController.listCourses);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Reports
router.get('/reports/overview', adminController.reportsOverview);

// Educator application requests management
import educatorRequestController from '../controllers/educatorRequestController.js';

router.get('/educator-requests', educatorRequestController.adminListRequests);
router.put('/educator-requests/:id/approve', educatorRequestController.adminApproveRequest);
router.put('/educator-requests/:id/reject', educatorRequestController.adminRejectRequest);

export default router;

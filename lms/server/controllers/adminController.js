import User from '../models/user.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import mongoose from 'mongoose';
import { clerkClient } from '@clerk/express';

// List users with basic pagination and optional search
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const q = {};
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(q).select('-__v').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(q)
    ]);
    res.json({ success: true, users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role (student|educator|admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'educator', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });

    const existing = await User.findById(String(id));
    if (!existing) return res.status(404).json({ success: false, message: 'User not found' });
    const prevRole = existing.role;

    existing.role = role;
    await existing.save();

    try {
      await clerkClient.users.updateUserMetadata(String(id), {
        publicMetadata: { role }
      });
    } catch (err) {
      // revert DB role if Clerk update fails
      try {
        existing.role = prevRole || 'student';
        await existing.save();
      } catch (e) {}
      return res.status(500).json({ success: false, message: 'Failed to update Clerk role metadata' });
    }

    const user = await User.findById(String(id)).select('-__v');
    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List courses with pagination and optional search
export const listCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const q = {};
    if (search) q.courseTitle = { $regex: search, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(q).populate('educator', 'name email role').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Course.countDocuments(q)
    ]);
    res.json({ success: true, courses, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('List courses error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update course (publish/unpublish or other editable fields)
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    // Allow only certain fields to be updated by admin
    const allowed = ['isPublished', 'courseTitle', 'courseDescription', 'coursePrice', 'discount'];
    allowed.forEach(field => { if (payload[field] !== undefined) course[field] = payload[field]; });
    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    // Optionally remove purchases referencing this course
    await Purchase.deleteMany({ courseId: id });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reports: overview counts and revenue
export const reportsOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalPurchases = await Purchase.countDocuments({ status: 'completed' });
    const revenueAgg = await Purchase.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = (revenueAgg[0] && revenueAgg[0].total) ? revenueAgg[0].total : 0;
    // total enrollments (from purchases or course.enrolledStudents)
    const enrollAgg = await Course.aggregate([
      { $project: { enrolledCount: { $size: { $ifNull: ['$enrolledStudents', []] } } } },
      { $group: { _id: null, totalEnrolled: { $sum: '$enrolledCount' } } }
    ]);
    const totalEnrolled = (enrollAgg[0] && enrollAgg[0].totalEnrolled) ? enrollAgg[0].totalEnrolled : 0;

    res.json({ success: true, totals: { totalUsers, totalCourses, totalPurchases, totalEnrolled, totalRevenue } });
  } catch (error) {
    console.error('Reports overview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  listUsers,
  updateUserRole,
  deleteUser,
  listCourses,
  updateCourse,
  deleteCourse,
  reportsOverview
};

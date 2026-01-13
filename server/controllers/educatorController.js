import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/user.js'; // Fixed: lowercase 'user'
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { ensureLocalUser } from '../utils/syncUser.js';
import path from 'path';

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: 'educator' }
    });
    // Ensure local user exists and update local role
    try {
      await ensureLocalUser(userId);
      await User.findByIdAndUpdate(userId, { role: 'educator' });
    } catch (err) {
      console.error('Failed to update local user role:', err);
    }
    res.json({ success: true, message: "You can publish course now" });
  } catch (error) {
    res.json({ success: false, message: "Error updating role", error: error.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    // multer fields: image (single) and lectureFiles (array)
    const imageFile = req.files && req.files.image && req.files.image[0] ? req.files.image[0] : null;
    const lectureFiles = req.files && req.files.lectureFiles ? req.files.lectureFiles : [];
    const educatorId = req.auth().userId;
    
    if (!imageFile) {
      return res.json({ success: false, message: 'Thumbnail not attached' });
    }
    
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    // create the course doc first (lectures may have placeholder URLs to be replaced)
    const newCourse = await Course.create(parsedCourseData);

    // upload thumbnail
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    // if lecture files were uploaded, map them to lectures by matching lectureId prefix in filename
    if (lectureFiles && lectureFiles.length > 0) {
      // create a map filenameWithoutPrefix -> file
      for (const file of lectureFiles) {
        try {
          // expecting name like <lectureId>_originalname
          const parts = file.originalname.split('_');
          const lectureId = parts[0];
          if (!lectureId) continue;
          // find the lecture in parsedCourseData.courseContent
          for (const chapter of parsedCourseData.courseContent || []) {
            for (const lecture of chapter.chapterContent || []) {
              if (lecture.lectureId === lectureId) {
                // upload to cloudinary as an authenticated video and store public_id
                const uploadRes = await cloudinary.uploader.upload(file.path, { resource_type: 'video', type: 'authenticated' });
                // update lectureUrl and store public id for signed delivery
                lecture.lectureUrl = uploadRes.secure_url;
                lecture.lecturePublicId = uploadRes.public_id;
                // remove temporary local file after upload
                try {
                  fs.unlinkSync(file.path);
                } catch (e) {
                  // ignore cleanup errors
                }
              }
            }
          }
        } catch (err) {
          console.error('Error processing lecture file', err);
        }
      }
    }

    // assign possibly-updated courseContent to newCourse and save
    newCourse.courseContent = parsedCourseData.courseContent || [];
    await newCourse.save();
    
    res.json({ success: true, message: 'Course Added' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId; // Fixed: added parentheses
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator Dashboard data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId; // Fixed: added parentheses
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    
    const courseIds = courses.map(course => course._id);
    
    // Calculate total earning
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    });
    
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    
    // Collect enrolled students data
    const enrolledStudentsData = [];
    
    // Get all unique student IDs from all courses
    const allStudentIds = [];
    courses.forEach(course => {
      if (course.enrolledStudents && course.enrolledStudents.length > 0) {
        allStudentIds.push(...course.enrolledStudents);
      }
    });
    
    // Remove duplicates
    const uniqueStudentIds = [...new Set(allStudentIds.map(id => id.toString()))];
    
    // Get student details
    const students = await User.find({
      _id: { $in: uniqueStudentIds }
    }, 'name imageUrl');
    
    // Map students to their courses
    students.forEach(student => {
      const studentCourses = courses.filter(course => 
        course.enrolledStudents && 
        course.enrolledStudents.some(id => id.toString() === student._id.toString())
      );
      
      studentCourses.forEach(course => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student: {
            _id: student._id,
            name: student.name,
            imageUrl: student.imageUrl
          }
        });
      });
    });
    
    const dashboardData = {
      totalCourses,
      totalEarnings,
      totalStudents: uniqueStudentIds.length,
      enrolledStudentsData,
      recentCourses: courses.slice(0, 5)
    };
    
    res.json({ success: true, dashboardData });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get enrolled students data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId; // Fixed: added parentheses
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);
    
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    })
    .populate('userId', 'name imageUrl')
    .populate('courseId', 'courseTitle');
    
    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));
    
    res.json({ success: true, enrolledStudents });
    
  } catch (error) {
    res.json({ success: false, message: error.message }); // Fixed: message spelling
  }
};

// Update course by ID (educator-owned)
export const updateCourseById = async (req, res) => {
  try {
    const educatorId = req.auth().userId;
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (String(course.educator) !== String(educatorId)) {
      return res.status(403).json({ success: false, message: 'You can only edit your own courses' });
    }

    // Parse payload (supports multipart with courseData JSON or direct fields)
    let payload = {};
    try {
      if (req.body && typeof req.body.courseData === 'string') {
        payload = JSON.parse(req.body.courseData);
      } else {
        payload = req.body || {};
      }
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid course data JSON' });
    }

    const allowedFields = ['courseTitle', 'courseLevel', 'courseCategory', 'coursePrice', 'discount', 'courseContent'];
    for (const field of allowedFields) {
      if (payload[field] !== undefined) {
        course[field] = payload[field];
      }
    }
    // Update description if provided (allow clearing to empty string)
    if (typeof payload.courseDescription === 'string') {
      course.courseDescription = payload.courseDescription;
    }

    // Validate & coerce numeric fields
    if (payload.coursePrice !== undefined) {
      const p = Number(payload.coursePrice);
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({ success: false, message: 'Invalid course price' });
      }
      course.coursePrice = p;
    }
    if (payload.discount !== undefined) {
      const d = Number(payload.discount);
      if (Number.isNaN(d) || d < 0 || d > 100) {
        return res.status(400).json({ success: false, message: 'Discount must be between 0 and 100' });
      }
      course.discount = d;
    }

    // Handle thumbnail update if provided
    const imageFile = req.files && req.files.image && req.files.image[0] ? req.files.image[0] : null;
    if (imageFile) {
      try {
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        course.courseThumbnail = imageUpload.secure_url;
        try { fs.unlinkSync(imageFile.path); } catch (e) {}
      } catch (err) {
        console.error('Thumbnail upload failed:', err);
      }
    }

    // Handle lecture file updates: expect filenames prefixed with lectureId (e.g., <lectureId>_name.mp4)
    const lectureFiles = req.files && req.files.lectureFiles ? req.files.lectureFiles : [];
    if (Array.isArray(lectureFiles) && lectureFiles.length > 0 && Array.isArray(course.courseContent)) {
      for (const file of lectureFiles) {
        try {
          const base = path.basename(file.originalname);
          const lectureId = base.split('_')[0];
          if (!lectureId) continue;
          for (const chapter of course.courseContent) {
            for (const lecture of (chapter.chapterContent || [])) {
              if (lecture.lectureId === lectureId) {
                const uploadRes = await cloudinary.uploader.upload(file.path, { resource_type: 'video', type: 'authenticated' });
                lecture.lectureUrl = uploadRes.secure_url;
                lecture.lecturePublicId = uploadRes.public_id;
                try { fs.unlinkSync(file.path); } catch (e) {}
              }
            }
          }
        } catch (err) {
          console.error('Error updating lecture file', err);
        }
      }
    }

    await course.save();
    return res.json({ success: true, course });
  } catch (error) {
    console.error('Educator update course error:', error);
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

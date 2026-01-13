import Course from "../models/Course.js";
import Purchase from '../models/Purchase.js';
import User from '../models/user.js';
import Progress from '../models/Progress.js';
import mongoose from 'mongoose';
import { ensureLocalUser } from '../utils/syncUser.js';
import axios from 'axios';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';

export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' });
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getCourseId = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        // determine requesting user (if any)
        let requesterId = null;
        try {
            requesterId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null;
        } catch (e) {
            requesterId = null;
        }

        // hide lecture URLs for non-preview lectures unless requester is enrolled or is the educator
        const isRequesterEnrolled = requesterId && Array.isArray(courseData.enrolledStudents) && courseData.enrolledStudents.map(String).includes(String(requesterId));
        const isRequesterEducator = requesterId && courseData.educator && (String(courseData.educator._id || courseData.educator) === String(requesterId));

        const backendBase = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                // If lecture URL is a local uploads path (e.g., 'uploads/xxx' or starting with '/uploads'),
                // prefix it with the backend base so the frontend can fetch it.
                    if (lecture.lectureUrl && (lecture.lectureUrl.startsWith('uploads/') || lecture.lectureUrl.startsWith('/uploads'))) {
                        // Serve via secure streaming route instead of public static path
                        lecture.lectureUrl = `${backendBase}/api/course/stream/${lecture.lectureId}`;
                }

                // If we have a Cloudinary public id and the requester is allowed, generate a short-lived signed streaming URL
                if (lecture.lecturePublicId && (isRequesterEnrolled || isRequesterEducator)) {
                    try {
                        // expires in 5 minutes
                        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 5;
                        // Generate a signed URL suitable for <video> playback. Use authenticated delivery.
                        // Prefer mp4 for broad browser support.
                        const signedUrl = cloudinary.url(lecture.lecturePublicId, {
                            resource_type: 'video',
                            type: 'authenticated',
                            sign_url: true,
                            expires_at: expiresAt,
                            format: 'mp4'
                        });
                        if (typeof signedUrl === 'string' && signedUrl.startsWith('http')) {
                            lecture.lectureUrl = signedUrl;
                        }
                    } catch (err) {
                        // fallback to whatever URL is stored
                    }
                }

                if (!lecture.isPreviewFree && !(isRequesterEnrolled || isRequesterEducator)) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
// Secure streaming for a lecture video (local uploads or Cloudinary authenticated)
export const streamLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (!lectureId) return res.status(400).json({ success: false, message: 'lectureId required' });

        // Identify requester
        let userId = null;
        try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
        if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

        // Find course and lecture by lectureId
        const course = await Course.findOne({ 'courseContent.chapterContent.lectureId': lectureId }).populate({ path: 'educator' });
        if (!course) return res.status(404).json({ success: false, message: 'Lecture not found' });

        // Locate the lecture object
        let foundLecture = null;
        for (const chapter of course.courseContent || []) {
            for (const lecture of chapter.chapterContent || []) {
                if (String(lecture.lectureId) === String(lectureId)) {
                    foundLecture = lecture;
                    break;
                }
            }
            if (foundLecture) break;
        }
        if (!foundLecture) return res.status(404).json({ success: false, message: 'Lecture not found' });

        // Authorization: enrolled student or course educator can stream, or preview if flagged
        const isEnrolled = Array.isArray(course.enrolledStudents) && course.enrolledStudents.map(String).includes(String(userId));
        const isEducator = course.educator && (String(course.educator._id || course.educator) === String(userId));
        const isPreviewAllowed = Boolean(foundLecture.isPreviewFree);
        if (!(isEnrolled || isEducator || isPreviewAllowed)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Cloudinary authenticated: redirect to short-lived signed URL
        if (foundLecture.lecturePublicId) {
            try {
                const expiresAt = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes
                const signedUrl = cloudinary.url(foundLecture.lecturePublicId, {
                    resource_type: 'video',
                    type: 'authenticated',
                    sign_url: true,
                    expires_at: expiresAt,
                    format: 'mp4'
                });
                return res.redirect(302, signedUrl);
            } catch (e) {
                // fall through to local path handling if present
            }
        }

        // Local uploads: stream file with Range support and anti-download headers
        const relPath = (foundLecture.lectureUrl || '').replace(/^\//, '');
        if (!relPath || !relPath.startsWith('uploads/')) {
            return res.status(404).json({ success: false, message: 'Lecture file not available' });
        }

        const fsPath = relPath; // uploads/<file>
        const fs = await import('fs');
        const path = await import('path');
        const fullPath = path.resolve(process.cwd(), fsPath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const stat = fs.statSync(fullPath);
        const fileSize = stat.size;

        // Detect content type by extension (default mp4)
        const ext = path.extname(fullPath).toLowerCase();
        const mime = ext === '.webm' ? 'video/webm' : ext === '.ogg' ? 'video/ogg' : 'video/mp4';

        const range = req.headers.range;
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Accept-Ranges', 'bytes');

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(fullPath, { start, end });
            res.status(206);
            res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
            res.setHeader('Content-Length', chunkSize);
            file.pipe(res);
        } else {
            res.setHeader('Content-Length', fileSize);
            fs.createReadStream(fullPath).pipe(res);
        }
    } catch (error) {
        console.error('Stream lecture error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Purchase course with Chapa payment
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth().userId;  // ✅ Fixed - added parentheses

    // Ensure local user exists
    await ensureLocalUser(userId);
    const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' });
        }

        // Check if already enrolled
        if (userData.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'Already enrolled in this course' });
        }

    // Calculate final amount as a number (Chapa expects a numeric amount)
    const finalAmount = Number((courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2));

    // Generate unique transaction reference (must be <= 50 chars for Chapa)
    const tx_ref = `tx_${crypto.randomBytes(8).toString('hex')}`;

        // Create purchase record
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: finalAmount,
            status: 'pending',
            tx_ref: tx_ref
        };

        const newPurchase = await Purchase.create(purchaseData);

        // Chapa Gateway Initialize
        // callback_url MUST be reachable by Chapa (use BACKEND_URL if set).
        // return_url is typically the frontend URL to redirect the user after payment.
        const backendBase = process.env.BACKEND_URL || origin; // prefer explicit BACKEND_URL
        const frontendBase = process.env.FRONTEND_URL || origin;

        const chapaData = {
            amount: finalAmount,
            currency: process.env.VITE_CURRENCY || 'ETB',
            email: userData.email,
            first_name: (userData.name || '').split(' ')[0] || 'Student',
            last_name: (userData.name || '').split(' ').slice(1).join(' ') || '',
            tx_ref: tx_ref,
            callback_url: `${backendBase}/api/course/verify-payment`,
            return_url: `${frontendBase}/payment-success?tx_ref=${tx_ref}`,
            customization: {
                title: 'Course Purchase',
                description: `Payment for ${courseData.courseTitle}`
            }
        };

        try {
            const chapaResponse = await axios.post(
                'https://api.chapa.co/v1/transaction/initialize',
                chapaData,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (chapaResponse.data && chapaResponse.data.status === 'success') {
                res.json({
                    success: true,
                    message: 'Payment initialized',
                    checkoutUrl: chapaResponse.data.data.checkout_url,
                    tx_ref: tx_ref
                });
            } else {
                // Delete the purchase record if payment initialization failed
                await Purchase.findByIdAndDelete(newPurchase._id);
                console.error('Chapa init failed:', chapaResponse.data);
                res.json({ success: false, message: 'Payment initialization failed', details: chapaResponse.data });
            }
        } catch (err) {
            // Log detailed response from Chapa to help debugging
            console.error('Chapa initialize error:', err.response?.data || err.message || err);
            // Delete pending purchase to avoid orphan records
            await Purchase.findByIdAndDelete(newPurchase._id);
            res.json({ success: false, message: 'Payment initialization error', details: err.response?.data || err.message });
        }

    } catch (error) {
        console.error('Purchase error:', error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Chapa payment
export const verifyPayment = async (req, res) => {
    try {
        const { tx_ref } = req.query;

        if (!tx_ref) {
            return res.json({ success: false, message: 'Transaction reference missing' });
        }

        // Verify payment with Chapa
        const verifyResponse = await axios.get(
            `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
                }
            }
        );

        if (verifyResponse.data.status === 'success' && verifyResponse.data.data.status === 'success') {
            // Find purchase by tx_ref
            const purchase = await Purchase.findOne({ tx_ref: tx_ref });

            if (!purchase) {
                return res.json({ success: false, message: 'Purchase not found' });
            }

            // Update purchase status
            purchase.status = 'completed';
            await purchase.save();

            // Add course to user's enrolled courses (use string compares to avoid ObjectId mismatches)
            const user = await User.findById(purchase.userId);
            if (user) {
                const enrolledCourseIds = (user.enrolledCourses || []).map(id => String(id));
                if (!enrolledCourseIds.includes(String(purchase.courseId))) {
                    user.enrolledCourses.push(purchase.courseId);
                    await user.save();
                }
            }

            // Add user to course's enrolled students
            const course = await Course.findById(purchase.courseId);
            if (course) {
                const enrolledStudentIds = (course.enrolledStudents || []).map(id => String(id));
                if (!enrolledStudentIds.includes(String(purchase.userId))) {
                    course.enrolledStudents.push(purchase.userId);
                    await course.save();
                }
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                courseId: purchase.courseId
            });

        } else {
            // Payment failed or pending
            const purchase = await Purchase.findOne({ tx_ref: tx_ref });
            if (purchase) {
                purchase.status = 'failed';
                await purchase.save();
            }

            res.json({
                success: false,
                message: 'Payment verification failed'
            });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.json({ success: false, message: error.message });
    }
}

// Rate a course (only enrolled users may rate)
export const rateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Safely get requester id (Clerk middleware may or may not be present)
        let userId = null;
        try {
            userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null;
        } catch (e) {
            userId = null;
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const { rating } = req.body;
        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Ensure user is enrolled in the course
        const enrolledCourseIds = (user.enrolledCourses || []).map(id => String(id));
        if (!enrolledCourseIds.includes(String(id))) {
            return res.status(403).json({ success: false, message: 'Only enrolled students can rate this course' });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Upsert rating by user
        const existingIndex = (course.courseRatings || []).findIndex(r => String(r.userId) === String(userId));
        if (existingIndex >= 0) {
            course.courseRatings[existingIndex].rating = numericRating;
        } else {
            course.courseRatings.push({ userId: String(userId), rating: numericRating });
        }

        await course.save();

        // Return updated rating summary
        const ratings = course.courseRatings || [];
        const total = ratings.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        const count = ratings.length;
        const average = count > 0 ? (total / count) : 0;

        res.json({ success: true, message: 'Rating recorded', rating: numericRating, average, count, courseRatings: ratings });

    } catch (error) {
        console.error('Rate course error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get current user's progress for a course
export const getCourseProgress = async (req, res) => {
    try {
        const { id } = req.params; // course id
        let userId = null;
        try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

        if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

        const progress = await Progress.findOne({ userId: String(userId), courseId: id });
        return res.json({ success: true, progress: progress || { completedLectures: [], completed: false, progressPercent: 0 } });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Reset progress for authenticated user on a course
export const resetCourseProgress = async (req, res) => {
    try {
        const { id } = req.params; // course id
        if (!id) return res.status(400).json({ success: false, message: 'Course id required' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid course id' });
        let userId = null;
        try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

        if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

        console.log(`Reset progress requested: user=${userId}, course=${id}`);

        // ensure user is enrolled
        const user = await User.findById(userId);
        const enrolledIds = (user?.enrolledCourses || []).map(String);
        if (!enrolledIds.includes(String(id))) {
            return res.status(403).json({ success: false, message: 'Only enrolled students may reset progress' });
        }

        const progress = await Progress.findOne({ userId: String(userId), courseId: id });
        if (!progress) {
            // nothing to reset
            return res.json({ success: true, progress: { completedLectures: [], completed: false, progressPercent: 0 } });
        }

        progress.completedLectures = [];
        progress.completed = false;
        progress.progressPercent = 0;
        await progress.save();

        // remove from user's completedCourses if present
        try {
            if (user && Array.isArray(user.completedCourses)) {
                const idx = user.completedCourses.map(String).indexOf(String(id));
                if (idx >= 0) {
                    user.completedCourses.splice(idx, 1);
                    await user.save();
                }
            }
        } catch (e) {
            console.error('Error removing course from user.completedCourses', e);
        }

        return res.json({ success: true, progress: { completedLectures: [], completed: false, progressPercent: 0 } });
    } catch (error) {
        console.error('Reset progress error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Mark a lecture as completed for the authenticated user
export const completeLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        let userId = null;
        try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }

        if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

        // ensure user is enrolled
        const user = await User.findById(userId);
        const enrolledIds = (user?.enrolledCourses || []).map(String);
        if (!enrolledIds.includes(String(courseId))) {
            return res.status(403).json({ success: false, message: 'Only enrolled students may mark progress' });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        // Total lectures count
        let totalLectures = 0;
        course.courseContent.forEach(ch => { if (Array.isArray(ch.chapterContent)) totalLectures += ch.chapterContent.length; });

        let progress = await Progress.findOne({ userId: String(userId), courseId });
        if (!progress) {
            progress = await Progress.create({ userId: String(userId), courseId, completedLectures: [] });
        }

        const already = (progress.completedLectures || []).map(String).includes(String(lectureId));
        if (!already) {
            progress.completedLectures.push(String(lectureId));
        }

        // Recompute percent & completion
        const completedCount = (progress.completedLectures || []).length;
        progress.progressPercent = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;
        progress.completed = totalLectures > 0 ? (completedCount >= totalLectures) : false;

        await progress.save();

                // If the user finished the course, add to user's completedCourses for quick lookup
                if (progress.completed) {
                    try {
                        const userDoc = await User.findById(userId);
                        if (userDoc) {
                            const alreadyCompleted = (userDoc.completedCourses || []).map(String).includes(String(courseId));
                            if (!alreadyCompleted) {
                                userDoc.completedCourses = userDoc.completedCourses || [];
                                userDoc.completedCourses.push(courseId);
                                await userDoc.save();
                            }
                        }
                    } catch (e) {
                        console.error('Error updating user completedCourses:', e);
                    }
                }

                res.json({ success: true, progress });
    } catch (error) {
        console.error('Complete lecture error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

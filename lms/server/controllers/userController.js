import User from '../models/user.js';
import { ensureLocalUser } from '../utils/syncUser.js';
import Progress from '../models/Progress.js';

// get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth().userId;  // ✅ Fixed - added parentheses
        // Ensure a local user exists (creates with default role 'student' if missing)
        const ensured = await ensureLocalUser(userId);
        if (!ensured) return res.json({ success: false, message: 'Failed to fetch user info' });
        const user = await User.findById(userId);
        return res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Users enrolled course with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth().userId;  // ✅ Fixed - added parentheses
        // Ensure local user exists
        await ensureLocalUser(userId);
        const userData = await User.findById(userId).populate('enrolledCourses');

        const courses = userData?.enrolledCourses || [];

        // Attach per-course progress and status for this user
        const coursesWithProgress = await Promise.all(courses.map(async (course) => {
            const progress = await Progress.findOne({ userId: String(userId), courseId: course._id });
            const progressData = progress ? {
                completedLectures: progress.completedLectures || [],
                completed: !!progress.completed,
                progressPercent: progress.progressPercent || 0
            } : { completedLectures: [], completed: false, progressPercent: 0 };

            // derive status from percent
            let status = 'not started';
            if (progressData.progressPercent >= 100 || progressData.completed) status = 'completed';
            else if (progressData.progressPercent > 0) status = 'in progress';

            // return course object with progress and status
            const obj = course.toObject ? course.toObject() : { ...course };
            obj.progress = progressData;
            obj.status = status;
            return obj;
        }));

        res.json({ success: true, enrolledCourses: coursesWithProgress });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

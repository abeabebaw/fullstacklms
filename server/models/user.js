import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: true, default: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff' },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  // Store completed courses for quick lookup (populated when user completes all lectures)
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

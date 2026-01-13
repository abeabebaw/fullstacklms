import mongoose from 'mongoose';

const educatorRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  cvPath: { type: String }, // stored upload path
  additionalInfo: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminId: { type: String, ref: 'User' },
  adminNote: { type: String }
}, { timestamps: true });

const EducatorRequest = mongoose.model('EducatorRequest', educatorRequestSchema);
export default EducatorRequest;

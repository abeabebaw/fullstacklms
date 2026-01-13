import EducatorRequest from '../models/EducatorRequest.js';
import User from '../models/user.js';
import path from 'path';
import { clerkClient } from '@clerk/express';
import { sendMail } from '../utils/mailer.js';

// Student creates an educator request (multipart/form-data expected for CV)
export const createEducatorRequest = async (req, res) => {
  try {
    const userId = req.auth().userId;
    // prevent duplicate pending requests
    const existing = await EducatorRequest.findOne({ userId: String(userId), status: 'pending' });
    if (existing) return res.status(400).json({ success: false, message: 'You already have a pending request' });

    const { phone, additionalInfo, name, email } = req.body;
    // basic validation
    const applicantEmail = (email || '').trim();
    const applicantPhone = (phone || '').trim();

    // prevent duplicate email or phone only for active pending requests
    if (applicantEmail) {
      const dupPendingEmail = await EducatorRequest.findOne({ email: applicantEmail, status: 'pending' });
      if (dupPendingEmail) return res.status(400).json({ success: false, message: 'There is already a pending application with this email' });
    }
    if (applicantPhone) {
      const dupPendingPhone = await EducatorRequest.findOne({ phone: applicantPhone, status: 'pending' });
      if (dupPendingPhone) return res.status(400).json({ success: false, message: 'There is already a pending application with this phone number' });
    }

    // allow resubmission after rejection; only block if there's an active pending request
    let cvPath = '';
    if (req.file) cvPath = req.file.path;
    // support upload field name 'cv' or single file
    if (!cvPath && req.files && req.files.cv && req.files.cv[0]) cvPath = req.files.cv[0].path;

    const user = await User.findById(String(userId));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'educator') return res.status(400).json({ success: false, message: 'You are already an educator' });

    const reqDoc = await EducatorRequest.create({
      userId: String(userId),
      name: name || user?.name || '',
      email: applicantEmail || user?.email || '',
      phone: applicantPhone || '',
      cvPath,
      additionalInfo: additionalInfo || ''
    });
    
    res.json({ success: true, request: reqDoc });
  } catch (error) {
    console.error('createEducatorRequest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student fetch their own requests
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const list = await EducatorRequest.find({ userId: String(userId) }).sort({ createdAt: -1 });
    res.json({ success: true, requests: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: list all requests
export const adminListRequests = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const q = {};
    if (search) q.$or = [ { name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } } ];
    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      EducatorRequest.find(q).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      EducatorRequest.countDocuments(q)
    ]);
    res.json({ success: true, requests, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin approves a request and updates user role
export const adminApproveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.auth().userId;
    const reqDoc = await EducatorRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ success: false, message: 'Request not found' });
    if (reqDoc.status === 'approved') return res.status(400).json({ success: false, message: 'Already approved' });

    // update user role
    const user = await User.findById(reqDoc.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const prevRole = user.role;
    user.role = 'educator';
    await user.save();

    // keep Clerk in sync (protectEducator may read from metadata)
    try {
      await clerkClient.users.updateUserMetadata(String(reqDoc.userId), {
        publicMetadata: { role: 'educator' }
      });
    } catch (err) {
      // revert DB role if Clerk update fails
      try {
        user.role = prevRole || 'student';
        await user.save();
      } catch (e) {}
      return res.status(500).json({ success: false, message: 'Failed to update Clerk role metadata' });
    }

    reqDoc.status = 'approved';
    reqDoc.adminId = String(adminId);
    if (req.body.adminNote) reqDoc.adminNote = req.body.adminNote;
    await reqDoc.save();

    // Notify applicant via email
    const recipient = reqDoc.email || user?.email;
    if (recipient) {
      const subject = 'Your Educator Application Has Been Approved';
      const note = reqDoc.adminNote ? `\n\nNote from admin: ${reqDoc.adminNote}` : '';
      const text = `Hello ${reqDoc.name || user?.name || ''},\n\nGood news! Your request to become an educator has been approved. You now have access to educator features in the platform.${note}\n\nNext steps:\n- Sign in and explore the educator dashboard\n- Set up your profile and start creating courses\n\nIf you have questions, reply to this email.`;
      const html = `<p>Hello <strong>${reqDoc.name || user?.name || ''}</strong>,</p>
        <p>Good news! Your request to become an educator has been <strong>approved</strong>. You now have access to educator features in the platform.</p>
        ${reqDoc.adminNote ? `<p><em>Note from admin:</em> ${reqDoc.adminNote}</p>` : ''}
        <p><strong>Next steps:</strong></p>
        <ul>
          <li>Sign in and explore the educator dashboard</li>
          <li>Set up your profile and start creating courses</li>
        </ul>
        <p>If you have questions, reply to this email.</p>`;
      try { await sendMail({ to: recipient, subject, text, html }); } catch (e) { /* already logged in mailer */ }
    }

    res.json({ success: true, request: reqDoc, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin rejects a request
export const adminRejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.auth().userId;
    const reqDoc = await EducatorRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ success: false, message: 'Request not found' });
    if (reqDoc.status === 'rejected') return res.status(400).json({ success: false, message: 'Already rejected' });

    reqDoc.status = 'rejected';
    reqDoc.adminId = String(adminId);
    if (req.body.adminNote) reqDoc.adminNote = req.body.adminNote;
    await reqDoc.save();

    // Notify applicant via email
    const recipient = reqDoc.email;
    if (recipient) {
      const subject = 'Your Educator Application Has Been Rejected';
      const note = reqDoc.adminNote ? `\n\nReason: ${reqDoc.adminNote}` : '';
      const text = `Hello ${reqDoc.name || ''},\n\nThank you for your interest in becoming an educator. After review, your application was not approved at this time.${note}\n\nYou may reapply after 30 days. If you have questions, reply to this email.`;
      const html = `<p>Hello <strong>${reqDoc.name || ''}</strong>,</p>
        <p>Thank you for your interest in becoming an educator. After review, your application was <strong>rejected</strong> at this time.</p>
        ${reqDoc.adminNote ? `<p><em>Reason:</em> ${reqDoc.adminNote}</p>` : ''}
        <p>You may reapply after 30 days. If you have questions, reply to this email.</p>`;
      try { await sendMail({ to: recipient, subject, text, html }); } catch (e) { /* already logged in mailer */ }
    }

    res.json({ success: true, request: reqDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Live duplicate check: returns whether email or phone already used in requests or existing users
export const checkDuplicate = async (req, res) => {
  try {
    const { email = '', phone = '' } = req.body || {};
    const result = { duplicateEmail: false, duplicatePhone: false };
    if (email) {
      const d = await EducatorRequest.findOne({ email: (email || '').trim(), status: 'pending' });
      const u = await User.findOne({ email: (email || '').trim() });
      if (d || (u && u.role === 'educator')) result.duplicateEmail = true;
    }
    if (phone) {
      const d = await EducatorRequest.findOne({ phone: (phone || '').trim(), status: 'pending' });
      if (d) result.duplicatePhone = true;
    }
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export default {
  createEducatorRequest,
  getMyRequests,
  adminListRequests,
  adminApproveRequest,
  adminRejectRequest
  ,
  checkDuplicate
};

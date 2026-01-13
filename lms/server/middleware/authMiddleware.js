import { clerkClient } from "@clerk/express";
import User from '../models/user.js';
import { ensureLocalUser } from '../utils/syncUser.js';

export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    // Ensure local user exists so DB can be the source of truth
    await ensureLocalUser(userId);
    const localUser = await User.findById(String(userId)).select('role');
    const localRole = localUser?.role;

    // Allow educators (and admins) through
    if (localRole === 'educator' || localRole === 'admin') return next();

    // Fallback: if Clerk metadata says educator/admin, sync local role and allow
    const clerkUser = await clerkClient.users.getUser(userId);
    const clerkRole = clerkUser?.publicMetadata?.role;
    if (clerkRole === 'educator' || clerkRole === 'admin') {
      try {
        await User.findByIdAndUpdate(String(userId), { role: clerkRole });
      } catch (e) {
        // ignore sync errors
      }
      return next();
    }

    return res.status(403).json({ success: false, message: 'Unauthorized Access' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

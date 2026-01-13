import User from '../models/user.js';

export const adminOnly = async (req, res, next) => {
  try {
    let userId = null;
    try { userId = req.auth && typeof req.auth === 'function' ? req.auth().userId : null; } catch (e) { userId = null; }
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const user = await User.findById(String(userId));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    // attach user to request for downstream handlers
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('adminOnly middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default adminOnly;

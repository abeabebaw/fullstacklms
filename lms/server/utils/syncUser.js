import User from '../models/user.js';
import { clerkClient } from '@clerk/express';

/**
 * Ensure a local User document exists for a Clerk userId.
 * If missing, fetch user details from Clerk and create a local record with default role 'student'.
 */
export async function ensureLocalUser(userId) {
  if (!userId) return null;
  let user = await User.findById(userId);
  if (user) return user;

  // Fetch from Clerk
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
  const firstName = clerkUser.firstName || '';
  const lastName = clerkUser.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || clerkUser?.username || 'Student';
  const email = (clerkUser.emailAddresses && clerkUser.emailAddresses[0] && clerkUser.emailAddresses[0].emailAddress) || '';
  // Provide a sensible placeholder avatar if Clerk doesn't return a profile image
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0D8ABC&color=fff`;
  const imageUrl = clerkUser?.profileImageUrl || placeholderAvatar;

    const newUser = new User({
      _id: userId,
      name: fullName,
      email,
      imageUrl,
      role: 'student',
      enrolledCourses: []
    });
    await newUser.save();
    return newUser;
  } catch (err) {
    console.error('Failed to sync user from Clerk:', err?.message || err);
    return null;
  }
}

export default ensureLocalUser;

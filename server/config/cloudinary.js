import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Validate that required env vars are present to give a clearer error early.
const missing = [];
if (!process.env.CLOUDINARY_NAME) missing.push('CLOUDINARY_NAME');
if (!process.env.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
if (!process.env.CLOUDINARY_SECRET_KEY) missing.push('CLOUDINARY_SECRET_KEY');
if (missing.length) {
  console.error(`Missing Cloudinary env vars: ${missing.join(', ')}`);
  throw new Error(`Missing Cloudinary env vars: ${missing.join(', ')}`);
}

export default cloudinary;

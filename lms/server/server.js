import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';
import certificateRouter from './routes/certificateRoute.js';
import quizRouter from './routes/quizRoute.js';
import adminRouter from './routes/adminRoutes.js';

const app = express();
connectDB();

app.use(cors());
// capture raw body for webhook signature verification while still parsing JSON
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf && buf.toString(); } }));
app.use(clerkMiddleware());

// Serve uploaded files (so multer temporary files under /uploads are reachable during development)
// Remove public static access to uploads; videos will be served via secure streaming endpoint
// app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('api working');
});

app.post('/clerk', clerkWebhooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);  // ✅ Make sure this line exists
app.use('/api/user', userRouter);
app.use('/api/certificate', certificateRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/admin', adminRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

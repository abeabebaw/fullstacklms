import React from 'react';
import { Routes, Route, Navigate, useMatch } from 'react-router-dom';
import Home from './pages/student/Home';
import CourseList from './pages/student/CourseList';
import CourseDetails from './pages/student/CourseDetails';
import QuizList from './pages/student/QuizList';
import QuizTake from './pages/student/QuizTake';
import Loading from './components/student/Loading';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import PaymentSuccess from './pages/student/PaymentSuccess';
import Educator from './pages/educator/Educator';
import StudentEnrolled from './pages/educator/StudentEnrolled';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import CreateQuiz from './pages/educator/CreateQuiz';
import MyQuizzes from './pages/educator/MyQuizzes';
import EditCourse from './pages/educator/EditCourse';
import Navbar from './components/student/Navbar';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminReports from './pages/admin/AdminReports';
import AdminEducatorRequests from './pages/admin/AdminEducatorRequests';
import "quill/dist/quill.snow.css";
import ContactUs from './pages/student/ContactUs';
import About from './pages/student/About';
import PrivacyPolicy from './pages/student/PrivacyPolicy';

function App() {
  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className="text-default min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Student Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
  <Route path="/courses/:id/quizzes" element={<QuizList />} />
  <Route path="/quiz/:id" element={<QuizTake />} />
        <Route path="/loading/:courseId" element={<Loading />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="my-quizzes" element={<MyQuizzes />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="edit-course/:id" element={<EditCourse />} />
          {/* Support alternative param name for robustness */}
          <Route path="edit-course/:courseId" element={<EditCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="educator-requests" element={<AdminEducatorRequests />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

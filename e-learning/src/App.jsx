import React from 'react';
import { Routes, Route, Navigate, useMatch } from 'react-router-dom';
import Home from './pages/student/Home';
import CourseList from './pages/student/CourseList';
import CourseDetails from './pages/student/CourseDetails';
import Loading from './components/student/Loading';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Educator from './pages/educator/Educator';
import StudentEnrolled from './pages/educator/StudentEnrolled';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import Navbar from './components/student/Navbar';
import "quill/dist/quill.snow.css";
function App() {
  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className="text-default min-h-screen bg-white">
      {/* ✅ Show Navbar only when NOT on educator pages */}
      {!isEducatorRoute && <Navbar />}

      <Routes>
        {/* Redirect root to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Student Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />  {/* ✅ fixed path */}
        <Route path="/loading/:courseId" element={<Loading />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:id" element={<Player />} />

        {/* Educator Routes (use nested routes so Educator layout renders children) */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;

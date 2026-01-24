import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import Loading from '../../components/student/Loading';
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';

const Mycourses = () => {
  const{ currency, educatorCourses, fetchEducatorCourses }=useContext(AppContext)
  const { getToken } = useAuth();
  const[courses,setCourses]=useState(null);
   const fetchCourses=async()=>{
    const token = await getToken();
    const result = await apiService.getEducatorCourses(token);
    if (result.success) {
      setCourses(result.courses);
    } else {
      console.error('Failed to fetch educator courses:', result.error);
      setCourses([]);
    }
   }
useEffect(()=>{
  fetchCourses()

},[])
  return courses ? (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="8" y="2" width="8" height="4" rx="1" fill="#0284c7"/></svg>
          My Courses
        </h2>
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white border border-slate-200">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-50 text-slate-900 text-base">
              <tr>
                <th className="px-6 py-4 font-semibold text-left">Course</th>
                <th className="px-6 py-4 font-semibold text-left">Earnings</th>
                <th className="px-6 py-4 font-semibold text-left">Students</th>
                <th className="px-6 py-4 font-semibold text-left">Published</th>
                <th className="px-6 py-4 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-base divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-lg">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-sky-50 transition">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={course.courseThumbnail} alt="Course" className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow" />
                      <div>
                        <div className="font-semibold text-slate-900 truncate max-w-xs">{course.courseTitle}</div>
                        <div className="text-xs text-slate-400">ID: {course._id.slice(-6)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-sky-700">
                      {Math.floor(
                        course.enrolledStudents.length *
                        (course.coursePrice - course.discount * course.coursePrice / 100)
                      )} {currency}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#0284c7"/></svg>
                        {course.enrolledStudents.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/educator/edit-course/${course._id}`}
                        className="inline-block bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-sky-700 transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />;
}

export default Mycourses
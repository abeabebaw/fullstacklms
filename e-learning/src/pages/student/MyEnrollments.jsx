import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Add this import
import { AppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react';
import { apiService } from '../../services/api';

const MyEnrollments = () => {
  const { enrolledCourses = [], calculateCourseDuration } = useContext(AppContext)
  const navigate = useNavigate() // Use the hook instead of context
  const { getToken } = useAuth();

  // enrolledCourses items now include `progress` and `status` (added by backend)
  // progress: { completedLectures: [], completed: bool, progressPercent: number }

  const handleCourseClick = (courseId) => {
    navigate('/player/' + courseId)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">
        My Enrollments
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* ---------- DESKTOP VIEW ---------- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-gray-800 border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Course</th>
                <th className="px-6 py-4 whitespace-nowrap">Duration</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course, index) => {
                const progressData = course?.progress || { completedLectures: [], completed: false, progressPercent: 0 };
                const percent = typeof progressData.progressPercent === 'number' ? progressData.progressPercent : 0;
                const isCompleted = progressData.completed || percent >= 100;

                return (
                  <tr
                    key={course._id ?? index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div 
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => handleCourseClick(course._id)}
                      >
                        <img
                          src={course.courseThumbnail}
                          alt={`${course.courseTitle} thumbnail`}
                          className="w-20 h-20 rounded-lg object-cover shadow-sm"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[240px]">
                            {course.courseTitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            by {((course.instructor && (typeof course.instructor === 'string' ? course.instructor : course.instructor.name)) || 'Instructor')}
                          </p>

                          {/* Progress bar near thumbnail */}
                          <div className="mt-2 w-40">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isCompleted ? 'bg-green-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {progressData.completedLectures?.length || 0}/{
                                course.courseContent?.reduce((acc, ch) => acc + (ch.chapterContent?.length || 0), 0) || 0
                              } lectures
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {calculateCourseDuration(course)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {course.status ? course.status.toUpperCase() : (isCompleted ? 'COMPLETED' : 'IN PROGRESS')}
                        </span>
                        <button
                          onClick={() => handleCourseClick(course._id)}
                          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          Open
                        </button>
                          {/* Reset progress button (visible when some progress exists) */}
                          { (progressData.progressPercent > 0 || (progressData.completedLectures || []).length > 0) && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!confirm('Reset progress for this course?')) return;
                                try {
                                  const token = await getToken();
                                  const res = await apiService.resetProgress(course._id, token);
                                  if (res.success) {
                                    // Force a refresh of the page or update local state (simpler: reload)
                                    window.location.reload();
                                  } else {
                                    alert(res.message || res.error || 'Failed to reset progress');
                                  }
                                } catch (err) {
                                  console.error('Reset progress', err);
                                  alert('Failed to reset progress');
                                }
                              }}
                              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 ml-2"
                            >
                              Reset
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ---------- MOBILE VIEW ---------- */}
        <div className="md:hidden p-4 space-y-4">
          {enrolledCourses.map((course, index) => {
            const progressData = course?.progress || { completedLectures: [], completed: false, progressPercent: 0 };
            const percent = typeof progressData.progressPercent === 'number' ? progressData.progressPercent : 0;
            const isCompleted = progressData.completed || percent >= 100;

            return (
              <div
                key={course._id ?? index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-150 cursor-pointer"
                onClick={() => handleCourseClick(course._id)}
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={course.courseThumbnail}
                    alt={`${course.courseTitle} thumbnail`}
                    className="w-16 h-16 rounded-lg object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {course.courseTitle}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {((course.instructor && (typeof course.instructor === 'string' ? course.instructor : course.instructor.name)) || 'Instructor')}
                    </p>

                    {/* Progress bar near thumbnail */}
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? 'bg-green-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {progressData.completedLectures?.length || 0}/{
                          course.courseContent?.reduce((acc, ch) => acc + (ch.chapterContent?.length || 0), 0) || 0
                        } lectures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-600">Duration: </span>
                    {calculateCourseDuration(course)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click
                      handleCourseClick(course._id)
                    }}
                    className={`w-full text-center mt-2 py-2 rounded-full text-xs font-medium transition ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyEnrollments
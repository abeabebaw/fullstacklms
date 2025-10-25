import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Add this import
import { AppContext } from '../../context/AppContext'

const MyEnrollments = () => {
  const { enrolledCourses = [], calculateCourseDuration } = useContext(AppContext)
  const navigate = useNavigate() // Use the hook instead of context

  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
  ])

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
                const completed = progressArray[index]?.lectureCompleted ?? 0
                const total = progressArray[index]?.totalLectures ?? 0
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0
                const isCompleted = total > 0 && completed === total

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
                            by {course.instructor || 'Instructor'}
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
                              {completed}/{total} lectures
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {calculateCourseDuration(course)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCourseClick(course._id)}
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium transition ${
                          isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Continue Learning'}
                      </button>
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
            const completed = progressArray[index]?.lectureCompleted ?? 0
            const total = progressArray[index]?.totalLectures ?? 0
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0
            const isCompleted = total > 0 && completed === total

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
                      by {course.instructor || 'Instructor'}
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
                        {completed}/{total} lectures
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
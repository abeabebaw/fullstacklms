import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice()

      const matchedCourses = input
        ? tempCourses.filter((item) =>
            item.courseTitle?.toLowerCase().includes(input.toLowerCase())
          )
        : tempCourses

      setFilteredCourse(matchedCourses)
    }
  }, [allCourses, input])

  return (
    <div className="relative px-6 md:px-20 lg:px-28 pt-28 pb-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            Explore Our Courses
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            <span
              className="text-blue-600 cursor-pointer hover:underline font-medium"
              onClick={() => navigate('/')}
            >
              Home
            </span>
            <span className="text-gray-400 mx-2">/</span>
            <span>Course List</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-auto md:w-80">
          <SearchBar data={input} />
        </div>
      </div>

      {/* Active Filter Tag */}
      {input && (
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-full shadow-sm mb-10 hover:bg-blue-700 transition">
          <p className="text-sm font-medium tracking-wide">Search: {input}</p>
          <img
            src={assets.cross_icon}
            alt="Clear search"
            className="w-4 h-4 cursor-pointer invert"
            onClick={() => navigate('/course-list')}
          />
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {filteredCourse.length > 0 ? (
          filteredCourse.map((courses, i) => (
            <CourseCard key={i} courses={courses} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center text-center py-16">
            <img
              src={assets.empty_icon || assets.placeholder}
              alt="No courses"
              className="w-28 h-28 mb-6 opacity-80"
            />
            <h3 className="text-gray-800 text-xl font-semibold mb-2">
              {input ? 'No matching results' : 'No courses available'}
            </h3>
            <p className="text-gray-500 max-w-md text-sm">
              {input
                ? `We couldn’t find any course matching “${input}”. Try different keywords.`
                : 'Check back later for new courses curated by our educators.'}
            </p>
            {input && (
              <button
                onClick={() => navigate('/course-list')}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                View All Courses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList

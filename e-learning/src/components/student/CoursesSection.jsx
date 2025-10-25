import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

function CoursesSection() {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      {/* Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-4 md:mb-6">
          Master In-Demand Skills with Expert-Led Courses
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-cyan-50/50 p-4 sm:p-6 rounded-lg mx-auto">
          Discover thousands of career-relevant courses designed for today's digital economy. Learn at your own pace with interactive content, real-world projects, and personalized guidance from industry professionals. Whether you're starting a new career or advancing in your current role, our comprehensive curriculum and hands-on approach ensure you gain practical skills that employers value.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto mb-8 md:mb-12">
        {allCourses.slice(0, 4).map((course, i) => (
          <CourseCard key={i} courses={course} />
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-sm sm:text-base font-medium"
        >
          Show All Courses
        </Link>
      </div>
    </div>
  );
}

export default CoursesSection;

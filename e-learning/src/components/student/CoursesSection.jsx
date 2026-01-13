import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

function CoursesSection() {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/20 -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Master In-Demand Skills
          </h2>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Expert-led courses • Real-world projects • Career-focused learning
          </p>
        </div>

        {/* Featured Courses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {allCourses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} courses={course} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <Link
            to="/course-list"
            onClick={() => window.scrollTo(0, 0)}
            className="
              inline-flex items-center gap-2
              px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-700
              text-white font-medium rounded-xl
              shadow-lg shadow-indigo-200/30
              hover:shadow-xl hover:shadow-indigo-300/40
              hover:from-indigo-700 hover:to-blue-800
              transform hover:scale-105 transition-all duration-300
            "
          >
            Explore All Courses
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoursesSection;
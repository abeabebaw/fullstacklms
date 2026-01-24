import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

function CoursesSection() {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="relative py-10 sm:py-14 md:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-grid-slate-100/50 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/20 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Master In-Demand Skills
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
            Expert-led courses • Real-world projects • Career-focused learning
          </p>
        </div>

        {/* Featured Courses */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {allCourses.slice(0, 4).map((course) => (
            <CourseCard key={course._id} courses={course} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            to="/course-list"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block px-7 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Explore All Courses
           
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CoursesSection;
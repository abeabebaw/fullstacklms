import React from 'react';
import { Link } from 'react-router-dom';

const Educator = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Educator Portal</h1>
      <p className="text-xl text-gray-600 mb-8">Manage your courses and track student progress</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Link 
          to="/add-course"
          className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-4 rounded-lg shadow-lg transition duration-300"
        >
          <div className="text-2xl mb-2">➕</div>
          <h3 className="text-lg font-semibold">Add New Course</h3>
          <p className="text-sm opacity-90 mt-2">Create and publish new courses</p>
        </Link>
        
        <Link 
          to="/my-courses"
          className="bg-green-500 hover:bg-green-600 text-white py-6 px-4 rounded-lg shadow-lg transition duration-300"
        >
          <div className="text-2xl mb-2">📚</div>
          <h3 className="text-lg font-semibold">My Courses</h3>
          <p className="text-sm opacity-90 mt-2">Manage your existing courses</p>
        </Link>
        
        <Link 
          to="/studentenrolled"
          className="bg-purple-500 hover:bg-purple-600 text-white py-6 px-4 rounded-lg shadow-lg transition duration-300"
        >
          <div className="text-2xl mb-2">👥</div>
          <h3 className="text-lg font-semibold">Students</h3>
          <p className="text-sm opacity-90 mt-2">View enrolled students</p>
        </Link>
      </div>
    </div>
  );
};

export default Educator;
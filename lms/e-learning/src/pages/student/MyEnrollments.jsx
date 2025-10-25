import React from 'react';
import { Link } from 'react-router-dom';

const MyEnrollments = () => {
  // Sample enrolled courses data
  const enrolledCourses = [
    { 
      id: 1, 
      title: 'React Fundamentals', 
      progress: 75,
      lastAccessed: '2 days ago',
      instructor: 'John Doe'
    },
    { 
      id: 2, 
      title: 'Advanced JavaScript', 
      progress: 30,
      lastAccessed: '1 week ago',
      instructor: 'Jane Smith'
    },
    { 
      id: 3, 
      title: 'Node.js Backend', 
      progress: 10,
      lastAccessed: '3 days ago',
      instructor: 'Mike Johnson'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Enrollments</h1>
      
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <Link 
            to="/course-list"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-300"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-gray-600">Instructor: {course.instructor}</p>
                </div>
                <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
                  {course.progress}% Complete
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Last accessed: {course.lastAccessed}</p>
                <Link 
                  to={`/player/${course.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                >
                  {course.progress === 0 ? 'Start Learning' : 'Continue Learning'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentEnrolled = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');

  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 1, name: 'React Fundamentals' },
    { id: 2, name: 'Advanced JavaScript' },
    { id: 3, name: 'Node.js Backend Development' }
  ];

  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      course: 'React Fundamentals',
      enrollmentDate: '2024-01-10',
      progress: 75,
      lastActivity: '2 days ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      course: 'React Fundamentals',
      enrollmentDate: '2024-01-12',
      progress: 45,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      course: 'Advanced JavaScript',
      enrollmentDate: '2024-01-08',
      progress: 90,
      lastActivity: '5 hours ago'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      course: 'Node.js Backend Development',
      enrollmentDate: '2024-01-05',
      progress: 30,
      lastActivity: '1 week ago'
    }
  ];

  const filteredStudents = selectedCourse === 'all' 
    ? students 
    : students.filter(student => student.course === courses.find(c => c.id === selectedCourse)?.name);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Enrolled Students</h1>
        <div className="flex gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <Link
            to="/my-courses"
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.enrollmentDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{student.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.lastActivity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Message
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    View Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No students found for the selected course.</p>
        </div>
      )}

      <div className="mt-6 text-center text-gray-600">
        <p>Total Students: {filteredStudents.length}</p>
      </div>
    </div>
  );
};

export default StudentEnrolled;
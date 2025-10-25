import React from 'react';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'React Fundamentals',
      students: 145,
      revenue: '$2,175',
      rating: 4.8,
      status: 'published',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      students: 89,
      revenue: '$1,780',
      rating: 4.9,
      status: 'published',
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      students: 67,
      revenue: '$1,340',
      rating: 4.7,
      status: 'draft',
      lastUpdated: '2024-01-12'
    },
    {
      id: 4,
      title: 'CSS Grid & Flexbox',
      students: 203,
      revenue: '$3,045',
      rating: 4.6,
      status: 'published',
      lastUpdated: '2024-01-08'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <Link
          to="/add-course"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
        >
          + Add New Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">Updated: {course.lastUpdated}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ⭐ {course.rating}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Link
                      to={`/studentenrolled?course=${course.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Students
                    </Link>
                    <button className="text-green-600 hover:text-green-900 ml-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 ml-4">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You haven't created any courses yet.</p>
          <Link
            to="/add-course"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
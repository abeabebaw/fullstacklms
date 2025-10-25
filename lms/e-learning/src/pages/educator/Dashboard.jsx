import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { title: 'Total Courses', value: 12, color: 'bg-blue-500' },
    { title: 'Active Students', value: 345, color: 'bg-green-500' },
    { title: 'Total Revenue', value: '$2,845', color: 'bg-purple-500' },
    { title: 'Average Rating', value: '4.8/5', color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { action: 'New enrollment', course: 'React Advanced', time: '2 hours ago' },
    { action: 'Course published', course: 'Node.js Mastery', time: '1 day ago' },
    { action: 'Student completed', course: 'JavaScript Basics', time: '2 days ago' },
    { action: 'New review received', course: 'CSS Grid', time: '3 days ago' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Educator Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl mb-4`}>
              {stat.value}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/add-course"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Create New Course
          </Link>
          <Link 
            to="/my-courses"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Manage Courses
          </Link>
          <Link 
            to="/studentenrolled"
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-300"
          >
            View Students
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.course}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
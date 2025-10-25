// src/components/educator/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Educator Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <img
              src={assets.patients_icon}
              alt="Enrolled students"
              className="w-10 h-10"
            />
            <div>
              <p className="text-3xl font-bold text-gray-700">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-gray-500">Total Enrollments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <img
              src={assets.my_course_icon}
              alt="Courses icon"
              className="w-10 h-10"
            />
            <div>
              <p className="text-3xl font-bold text-gray-700">
                {dashboardData.totalCourses || 0}
              </p>
              <p className="text-gray-500">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <img
              src={assets.earning_icon}
              alt="Earnings icon"
              className="w-10 h-10"
            />
            <div>
              <p className="text-3xl font-bold text-gray-700">
                {currency} {dashboardData.totalEarnings}
              </p>
              <p className="text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrollments */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">
              Latest Enrollments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600 w-16 text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Student
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Course Title
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center hidden sm:table-cell text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="font-medium text-gray-700">
                        {item.student.name}
                      </span>
                    </td>

                    <td className="px-6 py-4 truncate text-gray-600">
                      {item.courseTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

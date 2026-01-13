import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '@clerk/clerk-react';
import StatCard from '../../components/admin/StatCard';

const AdminDashboard = () => {
  const { apiService } = useContext(AppContext);
  const [overview, setOverview] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const res = await apiService.adminReportsOverview(token);
        if (res.success) setOverview(res.totals);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  if (!overview) return <div>Loading overview…</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value={overview.totalUsers} accent="blue" />
        <StatCard label="Courses" value={overview.totalCourses} accent="purple" />
        <StatCard label="Enrolled" value={overview.totalEnrolled ?? '-'} accent="green" />
        <StatCard label="Revenue" value={overview.totalRevenue} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-600 font-medium">Recent Activity</h3>
          <div className="mt-3 text-sm text-gray-500">(Placeholder) Show latest approvals, enrollments, or purchases.</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-sm text-gray-600 font-medium">Performance</h3>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded">
              <div className="h-2 rounded bg-blue-500" style={{ width: '65%' }} />
            </div>
            <div className="mt-2 text-xs text-gray-500">Monthly target reached: 65%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

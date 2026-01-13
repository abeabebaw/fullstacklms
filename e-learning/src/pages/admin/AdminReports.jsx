import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '@clerk/clerk-react';

const AdminReports = () => {
  const [totals, setTotals] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const res = await apiService.adminReportsOverview(token);
        if (res.success) setTotals(res.totals);
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  if (!totals) return <div>Loading reports…</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">Total Users: <strong>{totals.totalUsers}</strong></div>
        <div className="p-4 bg-white rounded shadow">Total Courses: <strong>{totals.totalCourses}</strong></div>
        <div className="p-4 bg-white rounded shadow">Total Enrolled: <strong>{totals.totalEnrolled}</strong></div>
        <div className="p-4 bg-white rounded shadow">Total Revenue: <strong>{totals.totalRevenue}</strong></div>
      </div>
    </div>
  );
};

export default AdminReports;

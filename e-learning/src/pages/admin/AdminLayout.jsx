import React, { useContext, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminTopbar from '../../components/admin/AdminTopbar';

const AdminLayout = () => {
  const { userProfile } = useContext(AppContext);

  // If userProfile is not yet loaded, show loading
  if (!userProfile) return <div className="p-6">Loading…</div>;
  if (userProfile.role !== 'admin') return <Navigate to="/" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:grid md:grid-cols-[16rem_1fr] md:min-h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Content */}
        <div className="md:col-start-2">
          <AdminTopbar onMenu={() => setSidebarOpen(true)} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

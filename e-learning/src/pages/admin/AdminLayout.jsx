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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-cyan-200 to-white animate-gradient-x overflow-x-hidden">
      {/* Animated background shapes */}
      <div className="pointer-events-none select-none absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="pointer-events-none select-none absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="md:grid md:grid-cols-[16rem_1fr] md:min-h-screen z-10">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Content */}
        <div className="md:col-start-2">
          <AdminTopbar onMenu={() => setSidebarOpen(true)} />
          <main className="p-2 sm:p-4 md:p-8 flex justify-center items-stretch overflow-y-auto">
            <div className="w-full min-h-[60vh] animate-fade-in-up
              md:max-w-5xl md:bg-white/80 md:backdrop-blur-lg md:rounded-3xl md:shadow-2xl md:p-10 md:border md:border-blue-100
              p-2 sm:p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

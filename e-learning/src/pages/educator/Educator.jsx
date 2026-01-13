// src/pages/educator/Educator.jsx
import React, { useState } from "react";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/educator/Footer";


const Educator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-default min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white flex flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      {/* Main container */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile off-canvas sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Panel */}
            <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
       
          <Outlet />
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default Educator;

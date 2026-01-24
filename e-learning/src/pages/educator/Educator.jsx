// src/pages/educator/Educator.jsx
import React, { useState } from "react";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/educator/Footer";


const Educator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-400 via-cyan-200 to-white animate-gradient-x overflow-x-hidden">
      {/* Animated background shapes */}
      <div className="pointer-events-none select-none absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse-slow z-0" />
      <div className="pointer-events-none select-none absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-pulse-slow z-0" />

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      {/* Main container */}
      <div className="flex flex-1 z-10">
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
            <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-2xl rounded-r-3xl">
              <Sidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content with glassmorphism and animation */}
        <main className="flex-1 flex justify-center items-stretch p-1 sm:p-2 md:p-8 overflow-y-auto">
          <div className="w-full min-h-[60vh] animate-fade-in-up
            md:max-w-4xl md:bg-white/80 md:backdrop-blur-lg md:rounded-3xl md:shadow-2xl md:p-10 md:border md:border-blue-100
            p-2 sm:p-4">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
};

export default Educator;

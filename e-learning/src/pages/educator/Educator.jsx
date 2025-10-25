// src/pages/educator/Educator.jsx
import React from "react";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "../../components/educator/Footer";


const Educator = () => {
  return (
    <div className="text-default min-h-screen bg-white flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

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

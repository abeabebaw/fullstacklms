// src/components/educator/Sidebar.jsx
import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";


const Sidebar = ({ onLinkClick }) => {
  const { isEducator } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon, alt: "Home icon" },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon, alt: "Add course icon" },
    { name: "My Courses", path: "/educator/my-courses", icon: assets.my_course_icon, alt: "My courses icon" },
    { name: "Student Enrolled", path: "/educator/student-enrolled", icon: assets.person_tick_icon, alt: "Student enrolled icon" },
  ];

  if (!isEducator) return null;

  // Mobile overlay
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-white rounded-full p-2 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar menu"
      >
        <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar for desktop & mobile drawer */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full min-h-screen bg-white shadow-lg border-r border-gray-200
          flex flex-col items-center md:items-stretch py-6 md:py-4 w-64 max-w-full transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:w-20 lg:w-64
        `}
        style={{ maxWidth: open ? '16rem' : undefined }}
      >
        {/* Close button for mobile */}
        <div className="flex w-full justify-end md:hidden px-4 mb-4">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col w-full gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={`${item.name}-${item.path}`}
              to={item.path}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 rounded-lg mx-2 my-1 text-base md:text-sm transition-colors duration-200 border-l-4 md:border-l-0 md:border-r-4 ${
                  isActive
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold"
                    : "border-transparent text-gray-700 hover:bg-gray-50"
                }`
              }
              onClick={() => {
                setOpen(false);
                if (onLinkClick) onLinkClick();
              }}
            >
              <img src={item.icon} alt={item.alt} className="w-7 h-7 md:w-6 md:h-6" />
              <span className="inline-block md:hidden lg:inline-block">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

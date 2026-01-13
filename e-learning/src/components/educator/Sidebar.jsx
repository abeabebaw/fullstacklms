// src/components/educator/Sidebar.jsx
import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon, alt: "Home icon" },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon, alt: "Add course icon" },
    { name: "My Courses", path: "/educator/my-courses", icon: assets.my_course_icon, alt: "My courses icon" },
    { name: "Edit Course", path: "/educator/my-courses", icon: assets.my_course_icon, alt: "Edit course icon" },
    { name: "Student Enrolled", path: "/educator/student-enrolled", icon: assets.person_tick_icon, alt: "Student enrolled icon" },
  ];

  if (!isEducator) return null;

  return (
    <aside className="w-20 md:w-64 border-r border-gray-200 min-h-screen py-4 flex flex-col items-center md:items-stretch bg-white shadow-sm">
      <div className="flex flex-col w-full">
        {menuItems.map((item) => (
          <NavLink
            key={`${item.name}-${item.path}`}
            to={item.path}
            // ✅ Use `end` only for the dashboard (exact match)
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 md:py-3 transition-colors duration-200 border-r-4 ${
                isActive
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium"
                  : "border-transparent text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <img src={item.icon} alt={item.alt} className="w-6 h-6" />
            <span className="hidden md:inline-block text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

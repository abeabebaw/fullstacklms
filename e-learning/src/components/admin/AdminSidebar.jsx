import React from 'react';
import { NavLink } from 'react-router-dom';

const LinkItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
  >
    <span className="inline-block w-5 h-5" aria-hidden>
      {icon}
    </span>
    <span>{label}</span>
  </NavLink>
);

const AdminSidebar = ({ onClose }) => {
  return (
    <aside className="h-full w-64 bg-white border-r flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Admin</h3>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-gray-100" aria-label="Close sidebar">✕</button>
        )}
      </div>
      <nav className="p-2 space-y-1">
        <LinkItem to="/admin" label="Overview" icon={<svg fill="currentColor" viewBox="0 0 20 20"><path d="M11 17a1 1 0 01-1 1H4a2 2 0 01-2-2V5a1 1 0 011-1h6a1 1 0 011 1v12zM17 7a1 1 0 00-1-1h-3v12h3a1 1 0 001-1V7z"/></svg>} />
        <LinkItem to="/admin/users" label="Users" icon={<svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 7a7 7 0 1114 0H3z"/></svg>} />
        <LinkItem to="/admin/courses" label="Courses" icon={<svg fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12a1 1 0 011 1v9a3 3 0 01-3 3H6a3 3 0 01-3-3V4a1 1 0 011-1zm2 3v2h8V6H6z"/></svg>} />
        <LinkItem to="/admin/educator-requests" label="Educator Requests" icon={<svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2h-5l-3 3v-3H4a2 2 0 01-2-2V6z"/></svg>} />
        <LinkItem to="/admin/reports" label="Reports" icon={<svg fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm3 3h2v10H6V6zm4 4h2v6h-2v-6zm4-2h2v8h-2V8z"/></svg>} />
      </nav>
    </aside>
  );
};

export default AdminSidebar;

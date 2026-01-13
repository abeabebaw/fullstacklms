import React from 'react';
import { Link } from 'react-router-dom';

const AdminTopbar = ({ onMenu }) => {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Open sidebar">☰</button>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Link to="/home" className="text-gray-600 hover:text-blue-600">Back to site</Link>
      </div>
    </header>
  );
};

export default AdminTopbar;

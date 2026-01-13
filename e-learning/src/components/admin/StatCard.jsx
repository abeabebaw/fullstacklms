import React from 'react';

const StatCard = ({ label, value, accent = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    rose: 'bg-rose-50 text-rose-700'
  };
  const col = colors[accent] || colors.blue;
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className={`inline-block px-2 py-1 text-xs rounded ${col}`}>{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
};

export default StatCard;

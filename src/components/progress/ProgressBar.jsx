import React from 'react';

const colorMap = {
  indigo: 'bg-indigo-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const ProgressBar = ({ percent = 0, label, hint, color = 'indigo' }) => {
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color] || colorMap.indigo}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

export default ProgressBar;

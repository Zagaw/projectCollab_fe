import React from 'react';

const ProgressBar = ({ percent = 0, label, hint }) => {
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-ink tabular-nums">{value}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-600"
          style={{ width: `${value}%` }}
        />
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

export default ProgressBar;

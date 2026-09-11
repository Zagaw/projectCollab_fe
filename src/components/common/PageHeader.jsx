import React from 'react';

export const PageHeader = ({ title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div>
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-kicker">{description}</p>}
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
);

export const StatCard = ({ label, value, warn = false }) => (
  <div className="surface p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className={`mt-1 text-2xl font-semibold tabular-nums ${warn ? 'text-red-600' : 'text-ink'}`}>
      {value}
    </p>
  </div>
);

export const FilterChips = ({ options, value, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1">
    {options.map((opt) => (
      <button
        key={opt.id}
        type="button"
        onClick={() => onChange(opt.id)}
        className={`filter-chip ${value === opt.id ? 'filter-chip-active' : ''}`}
      >
        {opt.label}
        {opt.count != null && (
          <span className={value === opt.id ? 'text-white/80' : 'text-gray-500'}>{opt.count}</span>
        )}
      </button>
    ))}
  </div>
);

export default PageHeader;

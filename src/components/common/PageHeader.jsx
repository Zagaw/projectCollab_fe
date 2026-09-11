import React from 'react';

const WELL = {
  teal: 'bg-indigo-50 text-indigo-700',
  sky: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-800',
  violet: 'bg-violet-50 text-violet-700',
  warn: 'bg-red-50 text-red-700',
};

export const IconWell = ({ tone = 'teal', size = 'md', children }) => {
  const box = size === 'sm' ? 'h-8 w-8 rounded-lg' : size === 'lg' ? 'h-12 w-12 rounded-full' : 'h-9 w-9 rounded-xl';
  return (
    <div className={`${box} ${WELL[tone] || WELL.teal} flex items-center justify-center shrink-0`}>
      {children}
    </div>
  );
};

const isGlyph = (value) =>
  typeof value === 'function' || (typeof value === 'object' && value !== null && !React.isValidElement(value));

export const PageHeader = ({ title, description, actions, icon: Icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
    <div className="flex items-start gap-3 min-w-0">
      {isGlyph(Icon) ? (
        <IconWell>
          <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
        </IconWell>
      ) : null}
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-kicker">{description}</p>}
      </div>
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
);

export const StatCard = ({ label, value, warn = false, icon: Icon, tone }) => {
  const wellTone = warn ? 'warn' : tone || 'teal';
  return (
    <div className="surface p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        {isGlyph(Icon) ? (
          <IconWell tone={wellTone} size="sm">
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden />
          </IconWell>
        ) : null}
      </div>
      <p className={`mt-2 text-2xl font-semibold tabular-nums ${warn ? 'text-red-600' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
};

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

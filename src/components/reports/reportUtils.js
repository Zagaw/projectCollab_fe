export const REPORT_TYPES = [
  { id: 'PROGRESS', label: 'Progress summary' },
  { id: 'TASKS', label: 'Task completion' },
  { id: 'CONTRIBUTIONS', label: 'Member contributions' },
  { id: 'WEEKLY', label: 'Weekly activity' },
];

export const toDatetimeLocal = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const defaultWeeklyRange = () => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  from.setHours(0, 0, 0, 0);
  return { from: toDatetimeLocal(from), to: toDatetimeLocal(to) };
};

export const toApiDateTime = (localValue) => {
  if (!localValue) return undefined;
  return localValue.length === 16 ? `${localValue}:00` : localValue;
};

export const csvEscape = (value) => {
  const text = value == null ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const reportToCsv = (report) => {
  const lines = [];
  lines.push(csvEscape(report.title || 'Report'));
  lines.push(`Generated,${csvEscape(report.generatedAt || '')}`);
  if (report.projectTitle) lines.push(`Project,${csvEscape(report.projectTitle)}`);
  if (report.teamName) lines.push(`Team,${csvEscape(report.teamName)}`);
  if (report.periodStart) lines.push(`From,${csvEscape(report.periodStart)}`);
  if (report.periodEnd) lines.push(`To,${csvEscape(report.periodEnd)}`);
  lines.push('');
  lines.push('Metric,Value');
  (report.metrics || []).forEach((metric) => {
    lines.push(`${csvEscape(metric.label)},${csvEscape(metric.value)}`);
  });
  (report.sections || []).forEach((section) => {
    lines.push('');
    lines.push(csvEscape(section.title));
    lines.push((section.columns || []).map(csvEscape).join(','));
    (section.rows || []).forEach((row) => {
      lines.push((row || []).map(csvEscape).join(','));
    });
  });
  return `\uFEFF${lines.join('\n')}`;
};

export const downloadCsv = (filename, content) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const reportBasePath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes('/lecturer')) return '/lecturer';
  if (pathname.includes('/teamleader')) return '/teamleader';
  return '/student';
};

export const formatReportDate = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0] = value;
    const date = new Date(year, (month || 1) - 1, day || 1, hour, minute);
    return date.toLocaleString();
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).replace('T', ' ');
  return date.toLocaleString();
};

export const reportFilename = (report) => {
  const stamp = new Date().toISOString().slice(0, 10);
  const scope = (report?.teamName || report?.projectTitle || 'report')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const type = (report?.type || 'report').toLowerCase();
  return `${type}-${scope}-${stamp}.csv`;
};

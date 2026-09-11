export const insightBasePath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes('/lecturer')) return '/lecturer';
  if (pathname.includes('/teamleader')) return '/teamleader';
  return '/student';
};

export const bandLabel = (band) => {
  if (band === 'AT_RISK') return 'At risk';
  if (band === 'WATCH') return 'Watch';
  return 'Healthy';
};

export const bandClass = (band) => {
  if (band === 'AT_RISK') return 'bg-red-50 text-red-700';
  if (band === 'WATCH') return 'bg-sand-50 text-sand-800';
  return 'bg-indigo-50 text-indigo-800';
};

export const bandTone = (band) => {
  if (band === 'AT_RISK') return 'warn';
  if (band === 'WATCH') return 'sand';
  return 'teal';
};

export const formatDeadline = (value) => {
  if (!value) return 'No date';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).replace('T', ' ');
  return date.toLocaleDateString();
};

export const itemHref = (item, basePath) => {
  if (!item?.entityId) return `${basePath}/insights`;
  if (item.entityType === 'MILESTONE') return `${basePath}/milestones/${item.entityId}`;
  return `${basePath}/tasks/${item.entityId}`;
};

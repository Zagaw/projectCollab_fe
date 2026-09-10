export const toApiDateTime = (localValue) => {
  if (!localValue) return null;
  return localValue.length === 16 ? `${localValue}:00` : localValue;
};

export const toDatetimeLocal = (value) => {
  if (!value) return '';
  const raw = String(value);
  if (raw.length >= 16 && !raw.includes('Z') && !/[+-]\d{2}:\d{2}$/.test(raw)) {
    return raw.slice(0, 16);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 16);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatMeetingTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const statusBadgeClass = (status) => {
  if (status === 'COMPLETED') return 'bg-green-100 text-green-700';
  if (status === 'CANCELLED') return 'bg-red-100 text-red-700';
  return 'bg-indigo-100 text-indigo-700';
};

export const rsvpLabel = (response) => {
  if (response === 'GOING') return 'Going';
  if (response === 'NOT_GOING') return 'Not going';
  if (response === 'MAYBE') return 'Maybe';
  return 'No response';
};

export const meetingBasePath = () => {
  const pathname = window.location.pathname;
  if (pathname.includes('/lecturer')) return '/lecturer';
  if (pathname.includes('/teamleader')) return '/teamleader';
  return '/student';
};

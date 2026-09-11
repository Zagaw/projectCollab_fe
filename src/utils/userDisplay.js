const firstToken = (value) => {
  const text = String(value || '').trim();
  return text ? text.split(/\s+/)[0] : '';
};

export const getFirstName = (user) => {
  const fromName = firstToken(user?.firstName);
  if (fromName) return fromName;
  const fromUsername = firstToken(user?.username);
  if (fromUsername) return fromUsername;
  const emailName = String(user?.email || '').split('@')[0].trim();
  return emailName;
};

export const getDisplayName = (user) => {
  const first = String(user?.firstName || '').trim();
  const last = String(user?.lastName || '').trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  return getFirstName(user);
};

export const getInitials = (user) => {
  const first = String(user?.firstName || '').trim();
  const last = String(user?.lastName || '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  const fallback = getFirstName(user);
  return fallback ? fallback[0].toUpperCase() : '?';
};

export const dashboardGreeting = (user) => {
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = getFirstName(user);
  return name ? `${hello}, ${name}` : hello;
};

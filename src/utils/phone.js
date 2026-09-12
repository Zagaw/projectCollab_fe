const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export const normalizePhone = (value) => {
  if (!value || !String(value).trim()) return '';
  return String(value).trim().replace(/[\s().-]/g, '');
};

export const isValidPhone = (value) => {
  const phone = normalizePhone(value);
  if (!phone) return true;
  return PHONE_PATTERN.test(phone);
};

export const PHONE_ERROR =
  'Enter a valid phone number with 8 to 15 digits. You can start with + for a country code.';

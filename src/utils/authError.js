export const authErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) {
    return 'Cannot reach the server. Check that the backend is running, then try again.';
  }

  const data = error.response.data;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error;
    }
    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message;
    }
    const fieldMessages = Object.entries(data)
      .filter(([, value]) => typeof value === 'string' && value.trim())
      .map(([, value]) => value);
    if (fieldMessages.length > 0) {
      return fieldMessages.join(' ');
    }
  }

  if (error.response.status === 401) {
    return 'Invalid email or password.';
  }
  if (error.response.status === 403) {
    return 'You do not have permission to do that.';
  }
  if (error.response.status >= 500) {
    return 'The server had a problem. Please try again in a moment.';
  }

  return fallback;
};

export const getCurrentDateInISO = () => {
  return new Date().toISOString().substring(0, 10);
};

export const getCurrentTimeISO = () => {
  const now = new Date();
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  return `${hours}:${minutes}`;
};

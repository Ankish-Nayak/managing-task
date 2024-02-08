export const getCurrentDateInISO = () => {
  return new Date().toISOString().substring(0, 10);
};

export const getCurrentTimeISO = () => {
  const now = new Date();
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  return `${hours}:${minutes}`;
};
// {date, time}
export const getSpiltTimeISO = (isoDateTime: string | null) => {
  if (!isoDateTime) return { dateInput: 'null', timeInput: 'null' };
  const dateTimeParts = isoDateTime.split('T');
  const dateInput = dateTimeParts[0];
  const timePart = dateTimeParts[1].split('.')[0]; // Remove milliseconds
  const timeInput = timePart.substring(0, 5); // Extract HH:mm
  return {
    dateInput,
    timeInput,
  };
};

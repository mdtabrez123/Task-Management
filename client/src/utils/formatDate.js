// A simple date formatter
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  
  // Create a date object from the UTC date string
  const date = new Date(dateString);
  
  // Get the timezone offset in minutes and convert it to milliseconds
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  
  // Create a new Date object adjusted for the user's local timezone
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
  
  return adjustedDate.toLocaleDateString(undefined, options);
};
// Format a date to YYYY-MM-DD
export const formatDate = (date: Date): string => 
    date.toISOString().split("T")[0];
  
  // Get the difference in days between two dates
  export const daysBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  
  // Add days to a date
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Check if a date is today
  export const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };
  
  // Get the start of the week (Monday)
  export const startOfWeek = (date: Date): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - ((date.getDay() + 6) % 7));
    return result;
  };
  
  // Get the number of days in a month
  export const daysInMonth = (year: number, month: number): number => 
    new Date(year, month + 1, 0).getDate();
  
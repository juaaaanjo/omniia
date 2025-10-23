/**
 * Convert date range string to startDate and endDate
 * @param {string} dateRange - Date range identifier (e.g., 'last_30_days', 'last_7_days', 'last_90_days')
 * @returns {object} Object with startDate and endDate in ISO format
 */
export const getDateRangeParams = (dateRange = 'last_30_days') => {
  const endDate = new Date();
  const startDate = new Date();

  // Set time to end of day for endDate
  endDate.setHours(23, 59, 59, 999);

  // Set time to start of day for startDate
  startDate.setHours(0, 0, 0, 0);

  switch (dateRange) {
    case 'today':
      // No change to dates
      break;

    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
      break;

    case 'last_7_days':
      startDate.setDate(startDate.getDate() - 7);
      break;

    case 'last_14_days':
      startDate.setDate(startDate.getDate() - 14);
      break;

    case 'last_30_days':
      startDate.setDate(startDate.getDate() - 30);
      break;

    case 'last_60_days':
      startDate.setDate(startDate.getDate() - 60);
      break;

    case 'last_90_days':
      startDate.setDate(startDate.getDate() - 90);
      break;

    case 'last_6_months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;

    case 'last_year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;

    case 'this_week':
      const currentDay = startDate.getDay();
      const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
      startDate.setDate(startDate.getDate() - daysToMonday);
      break;

    case 'this_month':
      startDate.setDate(1);
      break;

    case 'this_year':
      startDate.setMonth(0, 1);
      break;

    default:
      // Default to last 30 days
      startDate.setDate(startDate.getDate() - 30);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string
 */
export const formatDateYMD = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date range display label
 * @param {string} dateRange - Date range identifier
 * @returns {string} Human-readable label
 */
export const getDateRangeLabel = (dateRange) => {
  const labels = {
    today: 'Today',
    yesterday: 'Yesterday',
    last_7_days: 'Last 7 Days',
    last_14_days: 'Last 14 Days',
    last_30_days: 'Last 30 Days',
    last_60_days: 'Last 60 Days',
    last_90_days: 'Last 90 Days',
    last_6_months: 'Last 6 Months',
    last_year: 'Last Year',
    this_week: 'This Week',
    this_month: 'This Month',
    this_year: 'This Year',
  };

  return labels[dateRange] || 'Last 30 Days';
};

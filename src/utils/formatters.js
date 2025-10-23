import { format, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format currency values
 * Automatically uses the correct locale based on currency
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '-';

  // Map currencies to their appropriate locales
  const currencyLocales = {
    USD: 'en-US',
    COP: 'es-CO', // Colombian Pesos
    EUR: 'de-DE',
    GBP: 'en-GB',
    MXN: 'es-MX',
  };

  const locale = currencyLocales[currency] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format currency with compact notation (K, M, B)
 */
export const formatCurrencyCompact = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '-';

  const absValue = Math.abs(value);
  const currencyLocales = {
    USD: 'en-US',
    COP: 'es-CO',
    EUR: 'de-DE',
    GBP: 'en-GB',
    MXN: 'es-MX',
  };

  const locale = currencyLocales[currency] || 'en-US';

  // For large numbers, use compact notation
  if (absValue >= 1e9) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(value);
  } else if (absValue >= 1e6) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(value);
  }

  return formatCurrency(value, currency);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';

  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format large numbers with suffixes (K, M, B)
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';

  const absValue = Math.abs(value);

  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }

  return value.toFixed(decimals);
};

/**
 * Format dates
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '-';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '-';
  }
};

/**
 * Format change percentage with +/- sign
 */
export const formatChange = (value, decimals = 2) => {
  if (value === null || value === undefined) return '-';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format metric based on type
 */
export const formatMetric = (value, type, currency = 'USD') => {
  switch (type) {
    case 'currency':
      return formatCurrency(value, currency);
    case 'percentage':
      return formatPercentage(value);
    case 'number':
      return formatNumber(value);
    case 'change':
      return formatChange(value);
    default:
      return value;
  }
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format chart data for Recharts
 */
export const formatChartData = (data, xKey, yKey) => {
  if (!Array.isArray(data)) return [];

  return data.map(item => ({
    [xKey]: item[xKey],
    [yKey]: Number(item[yKey]) || 0,
  }));
};

/**
 * Calculate percentage change
 */
export const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

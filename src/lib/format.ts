/**
 * Formatting helpers shared across screens.
 */

export const formatPrice = (amount: number): string => {
  const value = Number.isFinite(amount) ? amount : 0;
  const rounded = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  return `${rounded} Ks`;
};

export const formatDate = (date: string): string => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

export const truncate = (text: string, length = 15): string => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
};
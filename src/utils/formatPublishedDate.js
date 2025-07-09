import {
  format,
  isToday,
  isThisYear,
  formatDistanceToNow,
} from 'date-fns';

export function formatPublishedDate(createdAt) {
  const date = new Date(createdAt);

  // Not this year: "July 12, 2024"
  if (!isThisYear(date)) {
    return format(date, 'MMMM d, yyyy');
  }

  const base = format(date, 'MMMM d');

  // Today: "July 9. 3 min ago"
  if (isToday(date)) {
    const relative = formatDistanceToNow(date, { addSuffix: true });
    return `${base}. ${relative}`;
  }

  // This year but not today: "July 7"
  return base;
}

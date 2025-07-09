import { format, formatDistanceToNow, isThisYear, isToday, isYesterday } from 'date-fns';

export function formatPublishedDate(createdAt) {
  const date = new Date(createdAt);

  // If not this year → "July 12, 2024"
  if (!isThisYear(date)) {
    return format(date, 'MMMM d, yyyy');
  }

  // If today or yesterday → "June 7. 3 min ago"
  const base = format(date, 'MMMM d');
  const relative = formatDistanceToNow(date, { addSuffix: true });

  // If within 1 day, show full: "June 7. 3 min ago"
  const msDiff = Date.now() - date.getTime();
  const hours = msDiff / 1000 / 60 / 60;

  if (hours < 24) {
    return `${base}. ${relative}`;
  }

  // If this year but older than 1 day: "June 7"
  return base;
}

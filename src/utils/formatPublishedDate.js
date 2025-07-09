import {
  format,
  isToday,
  isThisYear,
  formatDistanceToNow,
  isValid,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function formatPublishedDate(createdAt: string | Date): string {
  const utcDate = new Date(createdAt);

  if (!isValid(utcDate)) return 'Invalid date';

  // Convert to user's local time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = utcToZonedTime(utcDate, timeZone);

  // If not this year → "July 12, 2024"
  if (!isThisYear(localDate)) {
    return format(localDate, 'MMMM d, yyyy');
  }

  const base = format(localDate, 'MMMM d');

  // If today → "July 9. 3 min ago"
  if (isToday(localDate)) {
    const relative = formatDistanceToNow(localDate, { addSuffix: true });
    return `${base}. ${relative}`;
  }

  // This year but not today → "July 7"
  return base;
}

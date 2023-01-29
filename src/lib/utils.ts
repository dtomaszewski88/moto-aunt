import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export const formatISOtoUTC = (isoString: string, formatString = 'dd/MM/yyyy') =>
  formatInTimeZone(parseISO(isoString), 'UTC', formatString);

export const formatToUTC = (date: Date, formatString = 'dd/MM/yyyy') =>
  formatInTimeZone(date, 'UTC', formatString);

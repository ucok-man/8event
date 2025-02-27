import { TimeType } from '@/types/time-type';
import { format, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';

/* ---------------------------------------------------------------- */
/*                               TIME                               */
/* ---------------------------------------------------------------- */

export function timeToFloat(time: TimeType): number {
  const parts = time.split(':');
  if (parts.length < 2) return 0;
  return parseFloat(`${parts[0]}.${parts[1]}`);
}

export function currentTimeIsBefore(target: TimeType) {
  const currentTime = format(new Date(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct < timeToFloat(target);
}

export function sourceTimeIsBeforeTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) < timeToFloat(target);
}

export function currentTimeIsAfterEqual(target: TimeType) {
  const currentTime = format(new Date(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct >= timeToFloat(target);
}

export function sourceTimeIsAfterTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) > timeToFloat(target);
}

/* ---------------------------------------------------------------- */
/*                               DATE                               */
/* ---------------------------------------------------------------- */

export function currentDateIsBefore(target: string | Date) {
  return isBefore(startOfDay(new Date()), startOfDay(new Date(target)));
}

export function currentDateIsAfterEqual(target: string | Date) {
  return (
    isSameDay(new Date(), new Date(target)) ||
    isAfter(startOfDay(new Date()), startOfDay(new Date(target)))
  );
}

export function sourceDateIsBeforeTarget(
  src: string | Date,
  target: string | Date,
) {
  return isBefore(startOfDay(new Date(src)), startOfDay(new Date(target)));
}

export function sourceDateIsAfterTarget(
  src: string | Date,
  target: string | Date,
) {
  return isAfter(startOfDay(new Date(src)), startOfDay(new Date(target)));
}

export function sourceDateIsAfterEqualTarget(
  src: string | Date,
  target: string | Date,
) {
  return (
    isAfter(startOfDay(new Date(src)), startOfDay(new Date(target))) ||
    isSameDay(new Date(src), new Date(target))
  );
}

export function targetIsAfterEqualCurrentDate(target: string | Date) {
  return isSameDay(new Date(), new Date(target)) || isAfter(target, new Date());
}

/* ---------------------------------------------------------------- */
/*                               OTHER                              */
/* ---------------------------------------------------------------- */
export function daysInThisMonth() {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
}

export function getWeeklyRangesInThisMonth() {
  const totalDays = daysInThisMonth();
  const ranges: number[] = [];
  for (let i = 1; i <= totalDays; i += 7) {
    ranges.push(Math.min(i + 6, totalDays));
  }
  return ranges;
}

export function getDateFromDayInThisMonth(day: number) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-based index
  return new Date(year, month, day);
}

export function getFirstDateOfThisMonth() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-based index
  return new Date(year, month, 1);
}

// Zero index base
export function getMonthFromNumber(month: number): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (month < 0 || month > 11) {
    throw new Error('Invalid month number. Must be between 0 and 11.');
  }

  return months[month];
}

// zero based index
export function getFirstDateOfMonthFromNumber(monthIndex: number): Date {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month index. Must be between 0 and 11.');
  }

  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthIndex, 1);
}

// zero based index
export function getLastDateOfMonthFromNumber(monthIndex: number): Date {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month index. Must be between 0 and 11.');
  }

  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthIndex + 1, 0); // Setting day to 0 gets the last day of the previous month
}

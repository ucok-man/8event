import { TimeType } from '@/components/shared/time-picker/time-type';
import { TZDate } from '@date-fns/tz';
import {
  endOfMonth,
  format,
  getDaysInMonth,
  isAfter,
  isBefore,
  isSameDay,
  setDate,
  startOfDay,
  startOfMonth,
} from 'date-fns';

/* ---------------------------------------------------------------- */
/*                               TIME                               */
/* ---------------------------------------------------------------- */

export function timeToFloat(time: TimeType): number {
  const parts = time.split(':');
  if (parts.length < 2) return 0;
  return parseFloat(`${parts[0]}.${parts[1]}`);
}

export function currentTimeIsBefore(target: TimeType) {
  const currentTime = format(currentDate(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct < timeToFloat(target);
}

export function sourceTimeIsBeforeTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) < timeToFloat(target);
}

export function currentTimeIsAfterEqual(target: TimeType) {
  const currentTime = format(currentDate(), 'HH:mm');
  const ct = timeToFloat(currentTime as TimeType);
  return ct >= timeToFloat(target);
}

export function sourceTimeIsAfterTarget(src: TimeType, target: TimeType) {
  return timeToFloat(src) > timeToFloat(target);
}

/* ---------------------------------------------------------------- */
/*                               DATE                               */
/* ---------------------------------------------------------------- */

export function currentDate() {
  return new TZDate();
}

export function dateFrom(date: string | Date) {
  return typeof date === 'string' ? new TZDate(date) : new TZDate(date);
}

export function targetIsBeforeCurrentDate(target: string | Date) {
  return isBefore(startOfDay(target), startOfDay(currentDate()));
}

export function targetIsAfterCurrentDate(target: string | Date) {
  return isAfter(startOfDay(target), startOfDay(currentDate()));
}

export function targetIsBeforeEqualCurrentDate(target: string | Date) {
  return (
    isSameDay(target, currentDate()) ||
    isBefore(startOfDay(target), startOfDay(currentDate()))
  );
}

export function targetIsAfterEqualCurrentDate(target: string | Date) {
  return (
    isSameDay(target, currentDate()) ||
    isAfter(startOfDay(target), startOfDay(currentDate()))
  );
}

export function firstIsBeforeSecondDate(
  first: string | Date,
  second: string | Date,
) {
  return isBefore(startOfDay(first), startOfDay(second));
}

export function firstIsAfterSecondDate(
  first: string | Date,
  second: string | Date,
) {
  return isAfter(startOfDay(first), startOfDay(second));
}

export function firstIsBeforeEqualSecondDate(
  first: string | Date,
  second: string | Date,
) {
  return (
    isSameDay(first, second) || isBefore(startOfDay(first), startOfDay(second))
  );
}

export function firstIsAfterEqualSecondDate(
  first: string | Date,
  second: string | Date,
) {
  return (
    isSameDay(first, second) || isAfter(startOfDay(first), startOfDay(second))
  );
}

/* ---------------------------------------------------------------- */
/*                               OTHER                              */
/* ---------------------------------------------------------------- */
export function daysInThisMonth(): number {
  return getDaysInMonth(currentDate());
}

export function getWeeklyRangesInThisMonth() {
  const totalDays = daysInThisMonth();
  const ranges: number[] = [];
  for (let i = 1; i <= totalDays; i += 7) {
    ranges.push(Math.min(i + 6, totalDays));
  }
  return ranges;
}

export function getDateFromDayInThisMonth(day: number): Date {
  return setDate(currentDate(), day);
}

export function getFirstDateOfThisMonth() {
  return startOfMonth(currentDate());
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

export function getFirstDateOfMonthFromNumber(monthIndex: number): Date {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month index. Must be between 0 and 11.');
  }

  return startOfMonth(new TZDate(currentDate().getFullYear(), monthIndex));
}

export function getLastDateOfMonthFromNumber(monthIndex: number): Date {
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month index. Must be between 0 and 11.');
  }

  return endOfMonth(new TZDate(currentDate().getFullYear(), monthIndex));
}

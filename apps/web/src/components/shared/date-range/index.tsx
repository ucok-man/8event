import { dateFrom } from '@/lib/datetime-utils';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';

type Props = {
  startDate: string;
  endDate: string;
  className?: string;
};

export default function DateRange({ startDate, endDate, className }: Props) {
  const start = dateFrom(startDate);
  const end = dateFrom(endDate);
  const isEqual = isSameDay(startDate, endDate);

  return (
    <span className={cn('text-gray-700', className)}>
      {isEqual
        ? format(start, 'EEE, MMMM d, yyyy')
        : `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`}
    </span>
  );
}

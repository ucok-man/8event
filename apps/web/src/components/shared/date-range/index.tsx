import { cn } from '@/lib/utils';
import { compareDesc, format } from 'date-fns';

type Props = {
  startDate: string;
  endDate: string;
  className?: string;
};

export default function DateRange({ startDate, endDate, className }: Props) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const isEqual = compareDesc(startDate, endDate) === 0;

  return (
    <span className={cn('text-gray-700', className)}>
      {isEqual
        ? format(start, 'EEE, MMMM d, yyyy')
        : `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`}
    </span>
  );
}

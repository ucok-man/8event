import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  title: string;
};

export default function EventHeading({ title, className }: Props) {
  return (
    <h2 className={cn('text-2xl font-bold text-gray-700 mb-2', className)}>
      {title}
    </h2>
  );
}

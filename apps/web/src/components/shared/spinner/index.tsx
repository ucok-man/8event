import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export default function Spinner({ className }: Props) {
  return (
    <div
      className={cn(
        'inline-block h-3 w-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface dark:text-white',
        className,
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

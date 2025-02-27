import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  variant?: 'default' | 'outline';
  className?: string;
};

export default function CategoryBadge({
  className,
  label,
  variant = 'default',
}: Props) {
  return (
    <Badge
      variant={variant}
      className={cn(
        'relative border-brand-blue-800 bg-brand-blue-900 hover:bg-brand-blue-900 text-white/95 mb-3 rounded-sm px-2.5 py-0.5 text-xs font-semibold tracking-wide cursor-default',
        variant === 'outline' &&
          'border-brand-blue-400 bg-brand-blue-100/10 hover:bg-brand-blue-100/10 text-brand-blue-400 backdrop-blur-sm',
        className,
      )}
    >
      {label}
    </Badge>
  );
}

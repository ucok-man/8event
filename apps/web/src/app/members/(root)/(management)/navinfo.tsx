'use client';

import { cn, toTitleCase } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type Props = {
  className?: string;
};

export default function NavInfo({ className }: Props) {
  const pathname = usePathname();

  let currentpath = 'Dashboard';

  const segments = pathname.split('/');
  if (segments.length >= 3) {
    currentpath = segments[2];
  }

  return (
    <div>
      <div
        className={cn(
          'font-bold text-brand-blue-900 text-3xl tracking-wide',
          className,
        )}
      >
        {toTitleCase(currentpath)}
      </div>
    </div>
  );
}

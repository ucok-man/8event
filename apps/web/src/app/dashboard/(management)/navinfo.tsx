'use client';

import { toTitleCase } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function NavInfo() {
  const pathname = usePathname();

  let currentpath = 'Dashboard';

  const segments = pathname.split('/');
  if (segments.length >= 3) {
    currentpath = segments[2];
  }

  return (
    <div>
      <div className="font-bold text-brand-blue-900 text-3xl tracking-wide">
        {toTitleCase(currentpath)}
      </div>
    </div>
  );
}

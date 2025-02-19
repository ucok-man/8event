'use client';

import Logo from '@/components/shared/logo';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import Link from 'next/link';
import { useIsClient } from 'usehooks-ts';

export default function Navbar() {
  const isClient = useIsClient();

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-xl" />

        <MaxWidthWrapper className="relative">
          <div className="flex h-20 items-center justify-between">
            <Link href={'/'} className="cursor-pointer">
              <Logo textClass="max-sm:block" />
            </Link>

            <div className="flex items-center gap-3">
              <Link href={'/explore'}>
                <div>[EXPLORE]</div>
              </Link>
              <div>[LOGIN]</div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

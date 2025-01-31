import { Icons } from '@/components/shared/icons';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="sticky top-0 left-0 right-0 bg-white grainy-light z-50">
      <div className="relative">
        {/* Blur effect background */}
        <div className="absolute inset-0 border backdrop-blur-xl" />

        <MaxWidthWrapper className="relative">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex flex-row items-center justify-center gap-2 relative bottom-1">
              <div className="transition-transform transform hover:scale-110 duration-200">
                <Icons.Logo className="size-12 text-indigo-600 drop-shadow-lg" />
              </div>
              <div className="text-4xl font-extrabold relative top-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text font-montserrat max-sm:hidden">
                <span className="uppercase tracking-wide">Event</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={'/dashboard/overview'}
                className="flex items-center gap-2 bg-brand-blue-600 text-white hover:bg-brand-blue-600/95 border border-brand-blue-100 py-2 px-4 rounded-md text-sm font-medium"
              >
                Back to Dashboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

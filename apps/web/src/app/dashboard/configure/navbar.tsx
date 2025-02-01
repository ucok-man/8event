import Logo from '@/components/shared/logo';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="sticky top-0 left-0 right-0 grainy-light z-50">
      <div className="relative">
        <div className="absolute inset-0 border backdrop-blur-xl" />

        <MaxWidthWrapper className="relative">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Logo />

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

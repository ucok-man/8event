'use client';

import Logo from '@/components/shared/logo';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import UserAvatar from '@/components/shared/user-avatar';
import { useAuthContext } from '@/context/auth-provider';
// import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Compass, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, status } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-transparent transition-colors duration-500',
        isScrolled &&
          'bg-gradient-to-r from-brand-blue-900 to-brand-blue-800 transition-colors duration-500',
        pathname !== '/' &&
          'bg-gradient-to-r from-brand-blue-900 to-brand-blue-800',
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-xl" />

        <MaxWidthWrapper className="relative">
          <div className="flex h-20 items-center justify-between">
            <Link href={'/'} className="cursor-pointer">
              <Logo textClass="max-sm:hidden" />
            </Link>

            <div className="flex items-center gap-3">
              <Link href={'/explore#searchbox'}>
                <button className="flex items-center rounded-md px-2 py-1 text-base font-medium text-white">
                  <Compass className="mr-2 size-5" />
                  Explore
                </button>
              </Link>
              {/* <div className="mr-2">
                <Notification />
              </div> */}
              {status !== 'pending' && (!user || user.role !== 'CUSTOMER') && (
                <Link href={'/auth/signin'}>
                  <button className="flex items-center rounded-md px-2 py-1 text-base font-medium text-white">
                    <LogIn className="mr-2 size-5" />
                    Login
                  </button>
                </Link>
              )}
              {status !== 'pending' && user && user.role === 'CUSTOMER' && (
                <UserAvatar />
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

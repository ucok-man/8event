import Logo from '@/components/shared/logo';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div>
      <div className="fixed top-4 flex w-full items-center justify-center">
        <Link href={'/'}>
          <Logo textClass="max-sm:block" />
        </Link>
      </div>
      {children}
    </div>
  );
}

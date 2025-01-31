import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function MaxWidthWrapper({ children, className }: Props) {
  return (
    <div className={cn('h-full mx-auto w-full max-w-[1440px] px-6', className)}>
      {children}
    </div>
  );
}

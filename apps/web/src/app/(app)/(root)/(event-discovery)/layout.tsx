import HeroCarousel from '@/components/shared/hero-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode, Suspense } from 'react';
import SearchBox from './searchbox';

type Props = {
  children: ReactNode;
};

export default function EventDiscoveryLayout({ children }: Props) {
  return (
    <div id="top">
      <HeroCarousel />
      {/* TODO:Fallback */}
      <Suspense fallback={<Skeleton className="h-[152px] w-full" />}>
        <SearchBox />
      </Suspense>
      {children}
    </div>
  );
}

import HeroCarousel from '@/components/shared/hero-carousel';
import { ReactNode } from 'react';
import SearchBox from './searchbox';

type Props = {
  children: ReactNode;
};

export default function EventDiscoveryLayout({ children }: Props) {
  return (
    <div id="top">
      <HeroCarousel />
      <SearchBox />
      {children}
    </div>
  );
}

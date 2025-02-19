import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import Image from 'next/image';
import CategoryLink from '../category-links';
import ButtonExplore from './button-explore';
import EventThisMonth from './event-this-month';
import FeaturedEvent from './featured-event';
import HolidayEvent from './holiday-event';

export default function LandingPage() {
  return (
    <div>
      <FeaturedEvent />
      <MaxWidthWrapper className="mb-8">
        <div className="relative w-full h-40 overflow-hidden rounded-xl">
          <Image
            src={'/hero-asset-promo-01.jpg'}
            alt="promo 01"
            fill
            className="object-cover md:object-fill object-center"
          />
        </div>
      </MaxWidthWrapper>
      <HolidayEvent />
      <MaxWidthWrapper className="mb-8">
        <div className="relative w-full h-40 overflow-hidden rounded-xl">
          <Image
            src={'/hero-asset-promo-02.jpg'}
            alt="promo 01"
            fill
            className="object-cover md:object-fill object-center"
          />
        </div>
      </MaxWidthWrapper>
      <CategoryLink />
      <EventThisMonth />
      <ButtonExplore />
    </div>
  );
}

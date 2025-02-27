'use client';

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { fadeInUp, opacityUp } from '@/lib/animation-template';
import { motion } from 'motion/react';
import Image from 'next/image';
import CategoryLink from '../category-links';
import ButtonExplore from './button-explore';
import EventThisMonth from './event-this-month';
import FeaturedEvent from './featured-event';
import HolidayEvent from './holiday-event';

export default function LandingPage() {
  return (
    <motion.div {...opacityUp}>
      <FeaturedEvent />
      <MaxWidthWrapper className="mb-8">
        <motion.div
          {...fadeInUp}
          className="relative h-40 w-full overflow-hidden rounded-xl"
        >
          <Image
            src={'/hero-asset-promo-01.jpg'}
            alt="promo 01"
            fill
            className="object-cover object-center md:object-fill"
          />
        </motion.div>
      </MaxWidthWrapper>
      <HolidayEvent />
      <MaxWidthWrapper className="mb-8">
        <motion.div
          {...fadeInUp}
          className="relative h-40 w-full overflow-hidden rounded-xl"
        >
          <Image
            src={'/hero-asset-promo-02.jpg'}
            alt="promo 01"
            fill
            className="object-cover object-center md:object-fill"
          />
        </motion.div>
      </MaxWidthWrapper>
      <CategoryLink />
      <EventThisMonth />
      <ButtonExplore />
    </motion.div>
  );
}

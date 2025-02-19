import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { BrandCarousel } from '../brand-carousel';
import MaxWidthWrapper from '../max-width-wrapper';

export default function HeroCarousel() {
  const items = [
    <CarouselItemWrapper
      key="1"
      title="SBS MTV The Kpop Show Ticket Package"
      description="Look no further! Our SBS The Show tickets are the simplest way for you to experience a live Kpop recording."
      imgsrc="/wave-to-earth-hero.png"
    />,
    <CarouselItemWrapper
      key="2"
      title="SBS MTV The Kpop Show Ticket Package"
      description="Look no further! Our SBS The Show tickets are the simplest way for you to experience a live Kpop recording."
      imgsrc="/banner-carousel-01.jpeg"
    />,
  ];

  return (
    <div className="relative h-[800px] lg:h-auto lg:aspect-video w-full overflow-hidden rounded-none max-h-[808px]">
      <div className="relative size-full">
        <Image
          src={'/hero-background.jpg'}
          alt="hero background"
          fill
          className="object-cover object-center"
        />
      </div>
      <div
        style={{
          background:
            'linear-gradient(118.98deg, #ED4690 -2.11%, #5522CC 63.58%)',
          mixBlendMode: 'normal',
        }}
        className="absolute inset-0 opacity-90"
      />

      <div className="absolute inset-0 z-10 flex size-full items-center justify-center py-8 lg:px-16 xl:py-16">
        <MaxWidthWrapper>
          <BrandCarousel items={items} />
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

type CarouselItemWrapperProps = {
  imgsrc: string;
  title: string;
  description: string;
};

function CarouselItemWrapper({
  imgsrc,
  title,
  description,
}: CarouselItemWrapperProps) {
  return (
    <div className="flex flex-col size-full items-center lg:flex-row gap-8 xl:gap-x-16">
      {/* Image container */}
      <div className="relative aspect-[3/4] size-full  max-lg:max-h-[450px] ">
        <Image
          src={imgsrc}
          alt={title}
          fill
          className="object-contain object-center"
          priority
        />
      </div>

      {/* Content container */}
      <div className="flex w-full flex-col text-white space-y-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-montserrat text-pretty">
          {title}
        </h2>
        <p className="text-pretty line-clamp-2">{description}</p>

        <div className="flex flex-col md:flex-row gap-2">
          <Button className="bg-brand-rose-600 lg:text-base hover:bg-brand-rose-600/90 py-5 border border-brand-rose-600">
            Get Ticket
          </Button>
          <Button
            variant={'outline'}
            className="py-5 bg-transparent lg:text-base text-white hover:text-white hover:bg-brand-rose-600 hover:border-brand-rose-600"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}

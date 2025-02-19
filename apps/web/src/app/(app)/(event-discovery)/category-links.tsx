import { HorizontalScrollContainer } from '@/components/shared/horizontal-scroll-container';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { EVENT_CATEGORY } from '@/constants';
import Link from 'next/link';

export default function CategoryLink() {
  return (
    <MaxWidthWrapper className="my-8">
      <h2 className="text-xl font-bold mb-4">Category Events</h2>
      <div className="">
        <HorizontalScrollContainer>
          {EVENT_CATEGORY.map((category, idx) => (
            <Link
              href={`/explore?category=${category.value}`}
              key={idx}
              className="mx-1 group relative"
            >
              <Button className="relative whitespace-nowrap grainy-dark text-gray-800 border overflow-hidden">
                <div className="absolute inset-0 bg-brand-blue-300/10 group-hover:opacity-100 opacity-0 transition-all" />
                <category.icon className="size-4 group-hover:scale-105" />
                {category.label}
              </Button>
            </Link>
          ))}
        </HorizontalScrollContainer>
      </div>
    </MaxWidthWrapper>
  );
}

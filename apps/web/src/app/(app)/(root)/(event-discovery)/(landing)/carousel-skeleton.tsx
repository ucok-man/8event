import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  title: string;
};

export default function CarouselSkeleton({ title }: Props) {
  return (
    <MaxWidthWrapper className="my-8">
      <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="w-full h-[430px]">
          <Skeleton className="size-full" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

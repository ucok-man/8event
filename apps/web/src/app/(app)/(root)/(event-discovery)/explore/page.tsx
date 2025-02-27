import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import {
  checkQueryCategory,
  checkQueryCity,
  checkQueryEventFormat,
  checkQueryPage,
  checkQueryPriceType,
  checkQuerySearch,
  checkQuerySortBy,
  checkQueryStartTime,
} from '@/lib/utils';
import Content from './content';

type Props = {
  searchParams: {
    search?: string | string[];
    sortBy?: string | string[];
    eventFormat?: string | string[];
    category?: string | string[];
    city?: string | string[];
    startTime?: string | string[];
    priceType?: string | string[];
    page?: string | string[];
  };
};

export default function ExplorePage({ searchParams }: Props) {
  return (
    <MaxWidthWrapper className="my-8">
      <Content
        search={checkQuerySearch(searchParams.search)}
        sortBy={checkQuerySortBy(searchParams.sortBy)}
        eventFormat={checkQueryEventFormat(searchParams.eventFormat)}
        city={checkQueryCity(searchParams.city)}
        startTime={checkQueryStartTime(searchParams.startTime)}
        priceType={checkQueryPriceType(searchParams.priceType)}
        page={checkQueryPage(searchParams.page)}
        category={checkQueryCategory(searchParams.category)}
      />
    </MaxWidthWrapper>
  );
}

import {
  checkQueryPage,
  checkQuerySearch,
  checkQuerySortBy,
} from '@/lib/utils';
import Content from './content';
import SortAndSearch from './sort-and-search';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function MyEventsPage({ searchParams }: Props) {
  return (
    <div className="mt-8">
      <SortAndSearch />
      <Content
        search={checkQuerySearch(searchParams.search)}
        sortBy={checkQuerySortBy(searchParams.sortBy)}
        page={checkQueryPage(searchParams.page)}
      />
    </div>
  );
}

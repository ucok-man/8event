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
        organizerId={'4369549d-8056-4138-a1cf-5139f7527f0d'} // TODO: GET event id from user session
      />
    </div>
  );
}

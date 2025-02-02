import { notFound } from 'next/navigation';
import { SORTBY_OPTION } from './constant';
import Content from './content';
import SortAndSearch from './sort-and-search';
import { SortByOptionType } from './types';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function MyEventsPage({ searchParams }: Props) {
  const searchParam = searchParams.search;
  const pageParam = searchParams.page;
  let sortByParam = searchParams.sortBy;
  if (
    Array.isArray(searchParam) ||
    Array.isArray(sortByParam) ||
    Array.isArray(pageParam)
  ) {
    return notFound();
  }

  const search = checkSearch(searchParam);
  const sortBy = checkSortBy(sortByParam);
  const page = checkPage(pageParam);

  return (
    <div className="mt-8">
      <SortAndSearch />
      <Content search={search} sortBy={sortBy} page={page} />
    </div>
  );
}

function checkSortBy(input: string | undefined): SortByOptionType {
  if (!input) return 'startDate';
  const safesort = SORTBY_OPTION.map((opt) => opt.value);
  const found = safesort.find((safeval) => safeval === input);
  if (!found) return 'startDate';
  return found;
}

function checkSearch(input: string | undefined): string {
  if (!input) return '';
  return input;
}

function checkPage(input: string | undefined): number {
  if (!input) return 1;
  const p = Number(input);
  if (isNaN(p) || p < 1) return 1;
  return p;
}

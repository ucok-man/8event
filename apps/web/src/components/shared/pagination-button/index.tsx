'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import qs from 'query-string';

type Props = {
  metadata: {
    currentPage: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
    totalRecord: number;
  } | null;
};

export default function PaginationButton({ metadata }: Props) {
  const searchparams = useSearchParams();
  const pathname = usePathname();

  if (!metadata) return null;

  const { currentPage, firstPage, lastPage } = metadata;
  const pages = generatePages(currentPage, firstPage, lastPage);

  return (
    <Pagination className="my-8 text-brand-blue-900">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${pathname}?${generateQuery(searchparams.toString(), currentPage - 1)}`}
            className={cn(
              'hover:bg-brand-blue-100/60 hover:text-brand-blue-900',
              disabledClass(currentPage === firstPage),
            )}
          />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === null && <PaginationEllipsis />}
            {page !== null && (
              <PaginationLink
                href={`${pathname}?${generateQuery(searchparams.toString(), page)}`}
                isActive={currentPage === page}
                className="hover:bg-brand-blue-100/60 hover:text-brand-blue-900 grainy-dark"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={`${pathname}?${generateQuery(searchparams.toString(), currentPage + 1)}`}
            className={cn(
              'hover:bg-brand-blue-100/60 hover:text-brand-blue-900',
              disabledClass(currentPage === lastPage),
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function generateQuery(searchparams: string, targetpage: number) {
  const query = qs.parse(searchparams);
  query['page'] = `${targetpage}`;
  return qs.stringify(query, {
    skipEmptyString: true,
    skipNull: true,
  });
}

function disabledClass(isDisabled: boolean) {
  return isDisabled ? 'pointer-events-none opacity-50 text-brand-blue-900' : '';
}

function generatePages(current: number, first: number, last: number) {
  if (last === 1) return [first]; // Single page case

  const pages: (number | null)[] = [first];

  if (current > first + 1) pages.push(null); // Ellipsis before current if needed
  if (current > first && current < last) pages.push(current); // Add current page if not first/last
  if (current < last - 1) pages.push(null); // Ellipsis after current if needed

  pages.push(last); // Always include the last page

  return pages;
}

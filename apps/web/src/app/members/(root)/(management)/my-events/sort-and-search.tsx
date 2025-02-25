'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SORTBY_OPTION } from '@/constants';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { SortByOptionType } from './types';

export default function SortAndSearch() {
  const searchparams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortByOptionType | ''>('');
  const [debouncedSearch] = useDebounceValue(search, 500);

  useEffect(() => {
    const params = qs.parse(searchparams.toString());
    params['search'] = debouncedSearch;
    params['sortBy'] = sortBy;
    params['page'] = null;
    router.push(
      `/members/my-events?${qs.stringify(params, {
        skipEmptyString: true,
        skipNull: true,
      })}`,
      {
        scroll: false,
      },
    );
  }, [debouncedSearch, sortBy]);

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-[2fr,1fr]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search an event..."
          className="pl-10 grainy-dark focus-visible:ring-brand-blue-600 text-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-x-2 items-center">
        <div className="shrink-0 text-gray-600 text-sm">Sort By: </div>
        <Select
          value={sortBy}
          onValueChange={(val) => setSortBy(val as SortByOptionType)}
        >
          <SelectTrigger className="grainy-dark focus:ring-brand-blue-600 text-gray-600">
            <SelectValue placeholder="Sort an event..." />
          </SelectTrigger>
          <SelectContent className="grainy-dark">
            {SORTBY_OPTION.map((item, idx) => (
              <SelectItem
                key={idx}
                value={item.value}
                className="text-gray-700 focus:bg-brand-blue-100/60"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

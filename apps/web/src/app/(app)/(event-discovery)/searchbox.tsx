'use client';

import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  EVENT_CATEGORY,
  EVENT_FORMAT_OPTION,
  EVENT_PRICE_TYPE_OPTION,
  EVENT_START_TIME_OPTION,
  SORTBY_OPTION,
} from '@/constants';
import { cn, getOneFromQuery } from '@/lib/utils';
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { ArrowDownWideNarrow, Filter, Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useDebounceValue, useIsClient, useMediaQuery } from 'usehooks-ts';

export default function SearchBox() {
  const router = useRouter();
  const minMD = useMediaQuery('(min-width: 768px)');
  const isClient = useIsClient();
  const pathname = usePathname();

  const [openFilter, setOpenFilter] = useState(false);
  const searchparams = useSearchParams();
  const queries = qs.parse(searchparams.toString());

  const [search, setSearch] = useState(getOneFromQuery('search', queries));
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [sortBy, setSortBy] = useState(getOneFromQuery('sortBy', queries));

  const [eventFormat, setEventFormat] = useState(
    getOneFromQuery('eventFormat', queries),
  );
  const [city, setCity] = useState(getOneFromQuery('city', queries));
  const [category, setCategory] = useState(
    getOneFromQuery('category', queries),
  );
  const [startTime, setStartTime] = useState(
    getOneFromQuery('startTime', queries),
  );
  const [priceType, setPriceType] = useState(
    getOneFromQuery('priceType', queries),
  );

  const onFilterReset = () => {
    setEventFormat('');
    setCity('');
    setCategory('');
    setStartTime('');
    setPriceType('');
    queries['page'] = null;
    queries['eventFormat'] = '';
    queries['city'] = '';
    queries['category'] = '';
    queries['startTime'] = '';
    queries['priceType'] = '';
    router.push(
      `/explore?${qs.stringify(queries, {
        skipEmptyString: true,
        skipNull: true,
      })}`,
      {
        scroll: false,
      },
    );
  };

  const onFilterDefault = () => {
    setEventFormat(getOneFromQuery('eventFormat', queries));
    setCity(getOneFromQuery('city', queries));
    setCategory(getOneFromQuery('category', queries));
    setStartTime(getOneFromQuery('startTime', queries));
    setPriceType(getOneFromQuery('priceType', queries));
  };

  const onFilterApply = () => {
    queries['page'] = null;
    queries['eventFormat'] = eventFormat;
    queries['city'] = city;
    queries['category'] = category;
    queries['startTime'] = startTime;
    queries['priceType'] = priceType;
    router.push(
      `/explore?${qs.stringify(queries, {
        skipEmptyString: true,
        skipNull: true,
      })}`,
      {
        scroll: false,
      },
    );
  };

  const onSortSelect = (val: string) => {
    queries['sortBy'] = val;
    router.push(
      `/explore?${qs.stringify(queries, {
        skipEmptyString: true,
        skipNull: true,
      })}`,
      {
        scroll: false,
      },
    );
  };

  useEffect(() => {
    if (pathname !== '/' || (pathname === '/' && debouncedSearch !== '')) {
      queries['page'] = null;
      queries['search'] = debouncedSearch;
      router.push(
        `/explore?${qs.stringify(queries, {
          skipEmptyString: true,
          skipNull: true,
        })}`,
        {
          scroll: false,
        },
      );
    }
  }, [debouncedSearch]);

  useEffect(() => {
    setSortBy(getOneFromQuery('sortBy', queries));
    setSearch(getOneFromQuery('search', queries));
    setEventFormat(getOneFromQuery('eventFormat', queries));
    setCity(getOneFromQuery('city', queries));
    setCategory(getOneFromQuery('category', queries));
    setStartTime(getOneFromQuery('startTime', queries));
    setPriceType(getOneFromQuery('priceType', queries));
  }, [searchparams]);

  if (!isClient) return null;

  return (
    <div className="w-full  mx-auto py-6 bg-gradient-to-r from-brand-blue-900 to-brand-blue-800 shadow-lg">
      <MaxWidthWrapper className="sticky flex justify-between w-full items-center gap-8">
        <div className="relative text-brand-white-100 w-full">
          <Label
            htmlFor="search-events"
            className="text-lg font-bold mb-2 block"
          >
            Search Events
          </Label>
          <div className="relative flex items-center">
            <Input
              id="search-events"
              placeholder="Cari event seru disini"
              className="focus-visible:ring-0 p-0 pr-10 border-0 w-full text-base md:text-base placeholder-brand-white-100 border-b rounded-none placeholder:text-brand-white-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="text-brand-white-100 absolute right-3 top-1/2 transform -translate-y-1/2"
              size={20}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4 items-center w-full max-w-[400px]">
          {/* Filter */}
          <Dialog open={openFilter} onOpenChange={setOpenFilter}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-brand-white-900 border-brand-white-100 grainy-dark w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent
              className="grainy-dark text-brand-white-900 rounded-xl overflow-hidden text-lg"
              closeClass="bg-brand-blue-900 text-brand-white-200 p-[2px]"
              onEscapeKeyDown={() => onFilterDefault()}
              onCloseClick={() => onFilterDefault()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onFilterApply();
                  setOpenFilter(false);
                }
              }}
            >
              <div className="relative">
                <DialogHeader>
                  <DialogTitle className="text-brand-white-900 mb-4">
                    Filter Events
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription asChild className="text-lg">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value="event-type"
                      className="border-brand-blue-200/60"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-brand-blue-100/60 p-3 rounded-md">
                        Event Format
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <RadioGroup
                          value={eventFormat}
                          onValueChange={(val) => {
                            setEventFormat(val);
                            if (val === 'online') {
                              setCity('');
                            }
                          }}
                        >
                          {EVENT_FORMAT_OPTION.map(({ value, label }) => (
                            <div
                              className="flex items-center space-x-2"
                              key={value}
                            >
                              <RadioGroupItem
                                value={value}
                                id={value}
                                className="text-brand-blue-800 border-brand-blue-800 focus-visible:ring-brand-blue-800"
                                circleClass="fill-brand-blue-800"
                              />
                              <Label htmlFor={value}>{label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {eventFormat !== '' && (
                          <Button
                            size="sm"
                            onClick={() => setEventFormat('')}
                            className="mt-4 bg-brand-blue-800 hover:bg-brand-blue-800 text-brand-white-100"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="city"
                      className="border-brand-blue-200/60"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-brand-blue-100/60 p-3 rounded-md">
                        City
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <Input
                          className="shadow-none focus-visible:ring-0 text-sm outline-none border-0 px-0 border-b border-brand-blue-800 rounded-none"
                          placeholder="Enter city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={eventFormat === 'online'}
                        />
                        {city && (
                          <Button
                            size="sm"
                            onClick={() => setCity('')}
                            className="mt-4 bg-brand-blue-800 hover:bg-brand-blue-800 text-brand-white-100"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="category"
                      className="border-brand-blue-200/60"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-brand-blue-100/60 p-3 rounded-md">
                        Category
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <RadioGroup
                          value={category}
                          onValueChange={setCategory}
                        >
                          <ScrollArea className="h-48">
                            {EVENT_CATEGORY.map(({ value, label }) => (
                              <div
                                className="flex items-center space-x-2 my-2"
                                key={value}
                              >
                                <RadioGroupItem
                                  value={value}
                                  id={value}
                                  className="text-brand-blue-800 border-brand-blue-800 focus-visible:ring-brand-blue-800"
                                  circleClass="fill-brand-blue-800"
                                />
                                <Label htmlFor={value}>{label}</Label>
                              </div>
                            ))}
                          </ScrollArea>
                        </RadioGroup>
                        {category !== '' && (
                          <Button
                            size="sm"
                            onClick={() => setCategory('')}
                            className="mt-4 bg-brand-blue-800 hover:bg-brand-blue-800 text-brand-white-100"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="start-time"
                      className="border-brand-blue-200/60"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-brand-blue-100/60 p-3 rounded-md">
                        Start Time
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <RadioGroup
                          value={startTime}
                          onValueChange={setStartTime}
                        >
                          {EVENT_START_TIME_OPTION.map(({ value, label }) => (
                            <div
                              className="flex items-center space-x-2"
                              key={value}
                            >
                              <RadioGroupItem
                                value={value}
                                id={value}
                                className="text-brand-blue-800 border-brand-blue-800 focus-visible:ring-brand-blue-800"
                                circleClass="fill-brand-blue-800"
                              />
                              <Label htmlFor={value}>{label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {startTime && (
                          <Button
                            size="sm"
                            onClick={() => setStartTime('')}
                            className="mt-4 bg-brand-blue-800 hover:bg-brand-blue-800 text-brand-white-100"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value="price"
                      className="border-brand-blue-200/60"
                    >
                      <AccordionTrigger className="hover:no-underline hover:bg-brand-blue-100/60 p-3 rounded-md">
                        Price Type
                      </AccordionTrigger>
                      <AccordionContent className="px-3">
                        <RadioGroup
                          value={priceType}
                          onValueChange={setPriceType}
                        >
                          {EVENT_PRICE_TYPE_OPTION.map(({ value, label }) => (
                            <div
                              className="flex items-center space-x-2"
                              key={value}
                            >
                              <RadioGroupItem
                                value={value}
                                id={value}
                                className="text-brand-blue-800 border-brand-blue-800 focus-visible:ring-brand-blue-800"
                                circleClass="fill-brand-blue-800"
                              />
                              <Label htmlFor={value}>{label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {priceType !== '' && (
                          <Button
                            size="sm"
                            onClick={() => setPriceType('')}
                            className="mt-4 bg-brand-blue-800 hover:bg-brand-blue-800 text-brand-white-100"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </DialogDescription>
                <DialogFooter className="mt-4 gap-2">
                  <DialogClose asChild>
                    <Button
                      className="bg-transparent hover:bg-brand-blue-900 hover:text-brand-white-100 border border-brand-blue-900  text-brand-blue-900"
                      onClick={onFilterReset}
                    >
                      Reset
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      className="bg-brand-blue-900 hover:bg-brand-blue-900 text-brand-white-100"
                      onClick={onFilterApply}
                    >
                      Apply
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          {/* Sorting */}
          <Select value={sortBy} onValueChange={onSortSelect}>
            <SelectTrigger
              className={cn(
                'relative grainy-dark focus:ring-0 text-brand-white-900 font-medium',
                minMD && 'pl-[5.9rem]',
              )}
            >
              <div className="text-brand-white-900 border-brand-white-100 grainy-dark max-md:w-full absolute inset-0 z-10 flex items-center justify-center font-medium gap-2">
                <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
                Sort By
              </div>
            </SelectTrigger>
            <SelectContent className="grainy-dark">
              {SORTBY_OPTION.map((item, idx) => (
                <SelectItem
                  key={idx}
                  value={item.value}
                  className="text-brand-white-700 font-medium focus:text-brand-white-800 focus:bg-brand-blue-100/60"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

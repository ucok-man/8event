'use client';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTransactionContext } from '@/context/transaction-provider';
import { cn, formatRupiah } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { CalendarDays, Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

const voucherVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
      green: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      sunset: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface Voucher {
  id: string;
  title: string;
  amount: number;
  description: string;
  expiryDate?: Date | string;
}

interface Props extends VariantProps<typeof voucherVariants> {
  vouchers: Voucher[];
  onSelect: (voucher: Voucher | undefined) => void;
  onCancel: (voucher: Voucher | undefined) => void;
  gradient?: string;
  className?: string;
}

export default function SelectableVoucherCard({
  vouchers,
  onSelect,
  onCancel,
  variant,
  gradient,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState<
    Voucher | undefined
  >();
  const { payload } = useTransactionContext();

  React.useEffect(() => {
    if (!payload.voucherId) {
      setSelectedVoucher(undefined);
    }
  }, [payload.voucherId]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            <div className="flex flex-col">
              <div className="text-sm font-medium">
                {selectedVoucher ? (
                  <div className="flex justify-between">
                    <span className="max-w-[280px] line-clamp-1 overflow-hidden">
                      {selectedVoucher.title}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Select a voucher</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </div>
                )}
              </div>
              {selectedVoucher && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {selectedVoucher.amount} - {selectedVoucher.description}
                </span>
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[312px] p-0">
          <Command>
            <CommandList className="p-2 grainy-light">
              <CommandGroup>
                {/* Voucher cards */}
                {vouchers.map((voucher) => (
                  <CommandItem
                    key={voucher.id}
                    onSelect={() => {
                      setSelectedVoucher(voucher);
                      onSelect(voucher);
                      setOpen(false);
                    }}
                    className={cn(
                      'px-2 py-1 w-full p-3 rounded-md text-white overflow-hidden relative group my-2 cursor-pointer',
                      voucherVariants({ variant }),
                      gradient,
                      className,
                    )}
                  >
                    {/* Decorative Elements */}
                    <div className="text-white">
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-r-full 
                      after:absolute after:w-1 after:h-4 after:-left-0.5 after:top-0 after:bg-black/5"
                      />
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-l-full
                      after:absolute after:w-1 after:h-4 after:-right-0.5 after:top-0 after:bg-black/5"
                      />

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="text-xs font-medium opacity-90 line-clamp-1">
                          {voucher.title}
                        </div>
                        <div className="text-lg font-bold line-clamp-1">
                          {formatRupiah(voucher.amount)} Off
                        </div>
                        <div className="text-xs opacity-90 line-clamp-1">
                          {voucher.description}
                        </div>
                        {voucher.expiryDate && (
                          <div className="flex items-center opacity-75 mt-1 text-xs">
                            <CalendarDays className="mr-1 size-1 text-xs" />
                            Valid until:{' '}
                            {format(
                              new Date(voucher.expiryDate),
                              'MMM d, yyyy',
                            )}
                          </div>
                        )}
                      </div>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedVoucher?.id === voucher.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedVoucher && (
        <button
          className="bg-brand-rose-700 text-white px-4 py-1 rounded-md font-medium text-sm w-full mt-2"
          onClick={() => {
            setSelectedVoucher(undefined);
            onCancel(selectedVoucher);
          }}
        >
          Cancel Voucher
        </button>
      )}
    </>
  );
}

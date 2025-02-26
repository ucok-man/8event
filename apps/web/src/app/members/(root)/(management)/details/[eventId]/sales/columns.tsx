'use client';

import { cn, formatRupiah } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type DataColumnType = {
  ticketName: string;
  price?: number;
  amount: number;
  sold: number;
  sales: number;
};

export const columns: ColumnDef<DataColumnType>[] = [
  {
    accessorKey: 'ticketName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Ticket Name
          <ArrowUpDown
            className={cn(
              'ml-2 h-4 w-4 text-gray-700 opacity-0',
              isSorted && 'opacity-100',
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Price
          <ArrowUpDown
            className={cn(
              'ml-2 h-4 w-4 text-gray-700 opacity-0',
              isSorted && 'opacity-100',
            )}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const price: number | undefined = row.getValue('price');
      if (!price) {
        return (
          <div className="bg-brand-blue-200 w-fit px-2 rounded-md text-brand-blue-700">
            Free
          </div>
        );
      }
      return <div>{formatRupiah(price)}</div>;
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Amount
          <ArrowUpDown
            className={cn(
              'ml-2 h-4 w-4 text-gray-700 opacity-0',
              isSorted && 'opacity-100',
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'sold',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Sold
          <ArrowUpDown
            className={cn(
              'ml-2 h-4 w-4 text-gray-700 opacity-0',
              isSorted && 'opacity-100',
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'sales',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Sales
          <ArrowUpDown
            className={cn(
              'ml-2 h-4 w-4 text-gray-700 opacity-0',
              isSorted && 'opacity-100',
            )}
          />
        </div>
      );
    },
    cell: ({ row }) => <div>{formatRupiah(row.getValue('sales'))}</div>,
  },
];

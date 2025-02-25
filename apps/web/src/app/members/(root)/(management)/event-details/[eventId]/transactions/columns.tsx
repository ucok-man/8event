'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type DataColumnType = {
  username: string;
  email: string;
  payment: {
    proof: string;
    totalTicketQuantity: number;
    tickets: { name: string; price: number; quantity: number }[];
    discount?: {
      points: number;
      voucher: number;
    };
    totalPrice: number;
  };
  action: 'WAITING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED';
};

export const columns: ColumnDef<DataColumnType>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Username
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
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Email
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
    accessorKey: 'payment',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Payment
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
    accessorKey: 'action',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Action
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
];

'use client';

import {
  type ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  summary: {
    totalDiscount: number;
    totalTicketSales: number;
    totalIncome: number;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  summary,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const footerItems: FooterRowsProp['items'] = [
    { label: 'Total Sales', value: summary.totalTicketSales },
    { label: 'Total Discount (-)', value: summary.totalDiscount },
    { label: 'Total Income', value: summary.totalIncome },
  ];

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="rounded-md border-y bg-brand-blue-100/60">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-brand-blue-100/60"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="whitespace-nowrap text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="rounded-md border-y text-gray-600">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="hover:bg-brand-blue-100/60"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="bg-transparent whitespace-nowrap text-gray-500">
          <FooterRows items={footerItems} />
        </TableFooter>
      </Table>
    </div>
  );
}

type FooterRowsProp = {
  items: {
    label: string;
    value: number;
  }[];
};

function FooterRows({ items }: FooterRowsProp) {
  return (
    <>
      {items.map((item, idx) => (
        <TableRow className="hover:bg-transparent group" key={idx}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="border-b group-hover:bg-brand-blue-100/60 text-gray-900">
            {item.label}
          </TableCell>
          <TableCell className="border-b text-gray-600 group-hover:bg-brand-blue-100/60">
            {formatRupiah(item.value)}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

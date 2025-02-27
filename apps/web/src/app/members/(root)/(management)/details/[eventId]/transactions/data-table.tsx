'use client';

import {
  type ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between w-full max-lg:flex-col">
        {/* Search Buyer and Email */}
        <div className="flex items-center pb-4 gap-2 text-gray-600">
          <div className="text-sm text-gray-600 font-semibold">Search : </div>
          <div>
            <Input
              placeholder="Searh for buyer name..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) || ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm h-7 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Filter Status/Action */}
        <div className="flex items-center pb-4 gap-2 text-gray-600">
          <div className="text-sm text-gray-600 font-semibold">
            Filter Action :{' '}
          </div>
          <div className="flex gap-2 items-center text-xs font-medium">
            <div className="border-x border-gray-300 px-2">
              <button
                className={cn(
                  'rounded-md px-2',
                  !table.getColumn('status')?.getFilterValue() &&
                    'bg-brand-blue-100/60',
                )}
                onClick={() => table.getColumn('status')?.setFilterValue('')}
              >
                All
              </button>
            </div>
            <div className="border-r border-gray-300 px-2">
              <button
                className={cn(
                  'rounded-md px-2',
                  table.getColumn('status')?.getFilterValue() ===
                    'WAITING_CONFIRMATION' && 'bg-brand-blue-100/60',
                )}
                onClick={() =>
                  table
                    .getColumn('status')
                    ?.setFilterValue('WAITING_CONFIRMATION')
                }
              >
                Waiting Confirmation
              </button>
            </div>
            <div className="border-r border-gray-300 px-2">
              <button
                className={cn(
                  'rounded-md px-2',
                  table.getColumn('status')?.getFilterValue() === 'COMPLETED' &&
                    'bg-brand-blue-100/60',
                )}
                onClick={() =>
                  table.getColumn('status')?.setFilterValue('COMPLETED')
                }
              >
                Completed
              </button>
            </div>
            <div className="border-r border-gray-300 px-2">
              <button
                className={cn(
                  'rounded-md px-2',
                  table.getColumn('status')?.getFilterValue() === 'CANCELLED' &&
                    'bg-brand-blue-100/60',
                )}
                onClick={() =>
                  table.getColumn('status')?.setFilterValue('CANCELLED')
                }
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  style={{ width: header.getSize() }}
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
                  <TableCell
                    key={cell.id}
                    className="whitespace-nowrap"
                    style={{ width: cell.column.getSize() }}
                  >
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
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="grainy-dark disabled:text-gray-500 text-gray-600"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="grainy-dark  text-gray-700"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

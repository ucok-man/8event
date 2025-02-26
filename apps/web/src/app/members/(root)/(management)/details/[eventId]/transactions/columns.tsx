'use client';

import { Icons } from '@/components/shared/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import { queryclient } from '@/context/query-provider';
import { toast } from '@/hooks/use-toast';
import { cn, formatRupiah } from '@/lib/utils';
import { AcceptRejectPaymentResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, Loader2, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export type DataColumnType = {
  transactionId: string;
  name: string;
  email: string;
  payment: number;
  paymentDetail: {
    proof: string;
    totalTicketQuantity: number;
    tickets: { name: string; price: number; quantity: number }[];
    discount: {
      points: number;
      voucher: number;
    };
    totalPrice: number;
  };
  status: 'WAITING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED';
  cancelledIn?: string;
};

export const columns: ColumnDef<DataColumnType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          Buyer Name
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
    cell: ({ row }) => {
      const payment = row.getValue<DataColumnType['payment']>('payment');
      const { proof, tickets, discount, totalPrice } =
        row.original.paymentDetail;

      if (payment <= 0) {
        return <div>{formatRupiah(payment)}</div>;
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex cursor-pointer flex-col">
              <div>{formatRupiah(payment)}</div>
              <MoreHorizontal className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="grainy-light text-sm w-[320px] h-[320px] overflow-y-auto">
            <div className="grainy-light text-gray-600">
              <div className="text-gray-700 font-semibold text-sm">
                <h2>Payment Detail</h2>
              </div>
              <Separator className="my-4" />

              <div>
                <h3 className="text-gray-600 mb-2 font-semibold">Proof</h3>
                <div className="w-full h-[160px] relative overflow-hidden rounded-md border border-gray-300">
                  <Image
                    src={proof}
                    alt="Payment Proof"
                    fill
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-gray-600 mb-2 font-semibold">Ticket</h3>
                <div className="w-full">
                  {tickets.map((ticket, idx) => (
                    <div
                      className="flex items-center gap-3 w-full border-b-2 border-dashed py-2 border-gray-200"
                      key={idx}
                    >
                      <div className="text-brand-blue-400">
                        <Icons.Ticket />
                      </div>
                      <div className="text-sm max-w-sm text-gray-600 flex flex-col w-full">
                        <h4 className="text-sm text-gray-700 font-semibold">
                          {ticket.name}
                        </h4>
                        <div className="flex w-full justify-between">
                          <p className="text-sm text-gray-600">
                            {ticket.quantity} Ticket
                          </p>
                          <p className="text-sm text-gray-700 font-semibold">
                            {formatRupiah(ticket.price * ticket.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-gray-600 mb-2 font-semibold">Discount</h3>
                <div className="w-full ">
                  <div className="flex w-full justify-between mb-2">
                    <p className="text-sm text-gray-600">Point</p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {formatRupiah(discount.points)}
                    </p>
                  </div>
                  <div className="flex w-full justify-between">
                    <p className="text-sm text-gray-600">Voucher</p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {formatRupiah(discount.voucher)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-gray-600 mb-2 font-semibold">
                  Total Price
                </h3>
                <p className="text-sm text-gray-700 font-semibold">
                  {formatRupiah(totalPrice)}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: 'status',
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
    cell: ({ row }) => {
      const status = row.getValue<DataColumnType['status']>('status');
      const transactionId = row.original.transactionId;

      const [actionType, setActionType] = useState<'accept' | 'reject' | ''>(
        '',
      );

      const { apiclient } = useAuthContext();
      const { mutate: takeaction, isPending } = useMutation({
        mutationFn: async (action: 'accept' | 'reject') => {
          let path = '';
          if (action === 'accept')
            path = `/transactions/id/${transactionId}/accept`;
          if (action === 'reject')
            path = `/transactions/id/${transactionId}/reject`;

          const { data } = await apiclient.patch(path);
          return data.transaction as AcceptRejectPaymentResponse['transaction'];
        },

        onError: () => {
          toast({
            title: 'Action Failed',
            description:
              'Sorry we have problem in our server, please try again later',
            variant: 'destructive',
          });
          setActionType('');
        },

        onSuccess: () => {
          queryclient.invalidateQueries({
            queryKey: ['event-detail'],
          });
          queryclient.refetchQueries({
            queryKey: ['event-detail'],
          });
          setActionType('');
        },
      });

      let value = '';
      switch (status) {
        case 'WAITING_CONFIRMATION':
          value = 'Waiting Confirmation';
          break;
        case 'COMPLETED':
          value = 'Completed';
          break;
        default:
          value = 'Cancelled';
          break;
      }

      if (status !== 'WAITING_CONFIRMATION') {
        return (
          <div
            className={cn(
              'rounded-lg shadow-sm border p-1 text-white font-medium max-w-[160px] px-2',
              status === 'COMPLETED' && 'bg-green-500',
              status === 'CANCELLED' && 'bg-brand-blue-500',
            )}
          >
            {value}
          </div>
        );
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex cursor-pointer flex-col">
              <div
                className={cn(
                  'rounded-lg shadow-sm border p-1 text-white font-medium max-w-[160px] px-2 bg-brand-rose-600',
                )}
              >
                {value}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="grainy-light text-sm w-[160px] overflow-y-auto">
            <div className="text-gray-700 font-semibold text-sm">
              <h2>Take Action</h2>
            </div>
            <Separator className="my-4" />
            <div className="flex w-full justify-between items-center gap-1">
              <button
                onClick={() => {
                  takeaction('accept');
                  setActionType('accept');
                }}
                className="py-1 rounded-md bg-green-500 border font-medium text-white px-2 w-full"
                disabled={isPending}
              >
                {isPending && actionType === 'accept' ? (
                  <div className="flex w-full justify-center items-center">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : (
                  'Accept'
                )}
              </button>
              <button
                onClick={() => {
                  takeaction('reject');
                  setActionType('reject');
                }}
                className="py-1 rounded-md bg-brand-blue-500 border font-medium text-white px-2 w-full"
                disabled={isPending}
              >
                {isPending && actionType === 'reject' ? (
                  <div className="flex w-full justify-center items-center">
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                ) : (
                  'Reject'
                )}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },

    size: 160,
    maxSize: 160,
  },
  {
    accessorKey: 'cancelledIn',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="flex cursor-pointer"
        >
          (Will) Cancel At
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
      const expiredAt =
        row.getValue<DataColumnType['cancelledIn']>('cancelledIn');

      return (
        <div>
          {expiredAt ? (
            <div>{format(expiredAt, 'dd MMMM yyyy HH:mm')}</div>
          ) : (
            <div></div>
          )}
        </div>
      );
    },
  },
];

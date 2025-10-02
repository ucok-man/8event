'use client';

import { Icons } from '@/components/shared/icons';
import SelectableVoucherCard from '@/components/shared/selectable-voucher-card';
import { usePaymentNotifContext } from '@/context/payment-notif-provider';
import { TransactionContextType } from '@/context/transaction-provider';
import { toast } from '@/hooks/use-toast';
import { fadeInUp } from '@/lib/animation-template';
import { cn, formatRupiah } from '@/lib/utils';
import { ChevronUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

type Props = Pick<
  TransactionContextType,
  | 'payload'
  | 'data'
  | 'addVoucher'
  | 'cancelVoucher'
  | 'addPointBalance'
  | 'cancelPointBalance'
  | 'disablePointBalance'
  | 'disableVoucher'
  | 'create'
  | 'createPending'
  | 'createError'
>;

export default function FloatingCartMobile({
  payload,
  data,
  addVoucher,
  cancelVoucher,
  addPointBalance,
  cancelPointBalance,
  disablePointBalance,
  disableVoucher,
  create,
  createPending,
  createError,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pendingTransaction } = usePaymentNotifContext();

  if (!data) return null;

  const onCheckout = () => {
    if (!data.user.id) {
      toast({
        title: 'Oops! 🫢',
        description: 'Please login first before continue on checkout',
        variant: 'destructive',
      });
      return;
    }

    if (data.user.role !== 'CUSTOMER') {
      toast({
        title: 'Oops! 🫢',
        description: 'Please login with your customer account to checkout',
        variant: 'destructive',
      });
      return;
    }

    if (pendingTransaction) {
      toast({
        title: 'Oops! 🫢',
        description:
          'Please complete your transaction first before continue on checkout',
        variant: 'destructive',
      });
      return;
    }

    if (payload.totalTicketQuantity <= 0) {
      toast({
        title: 'Oops! 🫢',
        description: 'Please select ticket first before continue on checkout',
        variant: 'destructive',
      });
      return;
    }
    create();
  };

  if (createError && createError!.status! >= 500) {
    toast({
      title: 'Checkout Failed',
      description: 'Oops we found some issue, please try again later',
      variant: 'destructive',
    });
  }

  const { vouchers, pointBalance } = data.user;

  return (
    <motion.div {...fadeInUp} className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white border-t shadow-lg">
        {/* Trigger button for expansion */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-t-lg px-4 py-2 border border-b-0 shadow-lg"
        >
          <ChevronUp
            className={cn(
              'h-4 w-4 transition-transform duration-300',
              isExpanded ? 'rotate-180' : '',
            )}
          />
        </button>

        {/* Expanded content area */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isExpanded ? 'max-h-[50vh] opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            <div className="flex flex-col items-center w-full">
              {payload.totalTicketQuantity <= 0 && (
                <div className="flex items-center gap-3 w-full border-b-2 border-dashed py-8 border-gray-200">
                  <div className="text-brand-blue-400">
                    <Icons.Ticket />
                  </div>
                  <p className="text-sm w-full  text-gray-600">
                    You haven't selected a ticket yet. Please select it first in
                    the TICKET menu tab.
                  </p>
                </div>
              )}
              {payload.totalTicketQuantity >= 0 && (
                <>
                  {payload.tickets.map((ticket) => {
                    return (
                      <div
                        className="flex items-center gap-3 w-full border-b-2 border-dashed py-8 border-gray-200"
                        key={ticket.ticketId}
                      >
                        <div className="text-brand-blue-400">
                          <Icons.Ticket />
                        </div>
                        <div className="text-sm text-gray-600 flex flex-col w-full grow">
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
                    );
                  })}
                </>
              )}
            </div>
            <div className="pt-8">
              {vouchers.length > 0 &&
                payload.priceBeforeDiscount > 0 &&
                !disableVoucher && (
                  <div className="flex flex-col w-full items-center gap-1 pb-8">
                    <div className="text-xs text-gray-600 whitespace-nowrap w-full">
                      Use Voucher
                    </div>
                    <SelectableVoucherCard
                      vouchers={vouchers.map((voucher) => ({
                        title: voucher.name,
                        amount: voucher.price,
                        description: voucher.description,
                        id: voucher.id,
                        expiryDate: voucher.expiredAt,
                      }))}
                      onSelect={(voucher) => {
                        addVoucher(voucher!.id);
                      }}
                      onCancel={() => cancelVoucher()}
                    />
                  </div>
                )}
              {pointBalance > 0 &&
                payload.priceBeforeDiscount > 0 &&
                !disablePointBalance && (
                  <div className="flex flex-col w-full items-center gap-1 pb-8">
                    <div className="text-xs text-gray-600 whitespace-nowrap w-full flex justify-between">
                      <span>Use Point</span>
                      <span>Current Point {pointBalance}</span>
                    </div>
                    {!payload.usedPoints && (
                      <button
                        className="text-gray-700 rounded-md font-semibold text-sm mr-auto hover:underline underline-offset-2"
                        onClick={() => {
                          addPointBalance(pointBalance);
                        }}
                      >
                        Redeem
                      </button>
                    )}
                    {payload.usedPoints && (
                      <>
                        <div className="w-full flex justify-between text-sm text-gray-700 font-semibold">
                          <p className="">Redeemed Point</p>
                          <p>{payload.usedPoints}</p>
                        </div>
                        <button
                          className="bg-brand-rose-700 text-white px-4 py-1 rounded-md font-medium text-sm w-full mt-2"
                          onClick={() => {
                            cancelPointBalance();
                          }}
                        >
                          Cancel Point
                        </button>
                      </>
                    )}
                  </div>
                )}
              <div className="pb-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">
                      Total {payload.totalTicketQuantity} Ticket
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {formatRupiah(payload.priceBeforeDiscount)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Total Discount</p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {formatRupiah(payload.totalDiscount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom part */}
        <div className="p-4 bg-white h-[72px] flex items-center">
          <div className="container max-w-7xl mx-auto flex items-center justify-between gap-24">
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-lg font-semibold">
                {formatRupiah(payload.priceAfterDiscount)}
              </p>
            </div>
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm w-32"
              onClick={onCheckout}
              disabled={createPending}
            >
              {createPending ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                'Buy Ticket'
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

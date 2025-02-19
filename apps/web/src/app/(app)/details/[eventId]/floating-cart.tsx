'use client';

import { Icons } from '@/components/shared/icons';
import SelectableVoucherCard from '@/components/shared/selectable-voucher-card';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionContextType } from '@/context/transaction-provider';
import { toast } from '@/hooks/use-toast';
import { formatRupiah } from '@/lib/utils';

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

export default function FloatingCart({
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
  const onCheckout = () => {
    if (payload.totalTicketQuantity <= 0) {
      toast({
        title: 'Unprocessable Request',
        description: 'Please select ticket first before continue on checkout',
        variant: 'destructive',
      });
      return;
    }
    create();
  };

  const {
    buyer: { vouchers, pointBalance },
  } = data!;

  if (createError && createError!.status! >= 500) {
    toast({
      title: 'Checkout Failed',
      description: 'Oops we found some issue, please try again later',
      variant: 'destructive',
    });
  }

  return (
    <div className="p-4 md:p-8">
      <div className="relative size-full w-[360px]">
        <Card className="sticky top-28 border-0 shadow-xl grainy-light w-full">
          <CardContent className="grainy-light">
            <div className="flex flex-col items-center">
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
                <div className="flex justify-between pt-2">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-sm text-gray-700 font-semibold">
                    {formatRupiah(payload.priceAfterDiscount)}
                  </p>
                </div>
              </div>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm w-full"
                onClick={onCheckout}
                disabled={createPending}
              >
                {!createPending ? 'Buy Ticket' : 'Processing...'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { GetUserByIdResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import VoucherCard from '../voucher-card';

export default function VoucherTab() {
  const { user: session, apiclient } = useAuthContext();

  const {
    data: user,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['my-voucher', session?.id],
    queryFn: async () => {
      const { data } = await apiclient.get('/users/me');
      return data.user as GetUserByIdResponse['user'];
    },
  });

  useEffect(() => {
    if (error || (!isFetching && !user))
      toast({
        title: 'Unable Get Vouchers',
        description: 'Sorry we found some issue on the server. Try again later',
        variant: 'destructive',
      });
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">My Vouchers</h3>
          <Separator className="mt-4" />
        </div>
        {/* Voucher Cards */}
        {isFetching ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-base text-muted-foreground animate-pulse">
              🤔 Preparing your data...
            </div>
          </div>
        ) : user!.vouchers.length <= 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-base font-semibold text-muted-foreground">
              🎟️ No Vouchers Available
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Check or browse available offers to earn more vouchers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {user!.vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                title={voucher.name}
                description={voucher.description}
                amount={voucher.price}
                expiryDate={voucher.expiredAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { cn, formatRupiah } from '@/lib/utils';
import { Separator } from '@radix-ui/react-separator';
import { format } from 'date-fns';
import { ClockAlert, Users } from 'lucide-react';
import { ReactNode } from 'react';

type Props = {
  ticket: {
    type: 'FREE' | 'PAID';
    name: string;
    description: string;
    amount: number;
    price?: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  };
  action?: ReactNode;
};

export default function TicketCard({ ticket, action }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 shadow-sm group transition-all duration-200 hover:shadow-md',
        ticket.type === 'FREE'
          ? 'border-brand-blue-200 bg-gradient-to-r from-brand-blue-50 to-white'
          : 'border-brand-rose-200 bg-gradient-to-r from-brand-rose-50 to-white',
      )}
    >
      {/* Decorative circles */}
      <div className="absolute -left-4 top-1/2 size-8 -translate-y-1/2 rounded-full bg-white"></div>
      <div className="absolute -right-4 top-1/2 size-8 -translate-y-1/2 rounded-full bg-white"></div>

      {/* Dashed line */}
      <div className="absolute inset-x-4 top-1/2 border-t-2 border-dashed border-gray-200 max-sm:hidden"></div>

      <div className="relative grid grid-cols-[1fr,auto] gap-4 p-6 max-sm:grid-cols-1">
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 max-sm:text-lg max-sm:leading-snug">
              {ticket.name}
            </h4>
            <Separator className="my-3" />
            <p className="mt-1 text-sm text-gray-600">{ticket.description}</p>
          </div>

          <div className="flex items-center gap-6 max-sm:flex-col max-sm:gap-3 ">
            <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-start">
              <ClockAlert className="size-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {format(new Date(ticket.startDate), 'MMM d')} -{' '}
                {format(new Date(ticket.endDate), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-start">
              <Users className="size-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {ticket.amount} available
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <span
            className={cn(
              'rounded-full px-4 py-1 text-sm font-medium',
              ticket.type === 'FREE'
                ? 'bg-brand-blue-100 text-brand-blue-800'
                : 'bg-brand-rose-100 text-brand-rose-800',
            )}
          >
            {ticket.type === 'FREE'
              ? 'Free'
              : `${ticket.type === 'PAID' ? formatRupiah(ticket.price!) : 0}`}
          </span>
        </div>
      </div>

      {/* other child */}
      {action}
    </div>
  );
}

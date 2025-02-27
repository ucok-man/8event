'use client';

import { Card } from '@/components/ui/card';
import { cn, formatRupiah } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

const voucherVariants = cva(
  'relative overflow-hidden transition-all duration-200 hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
        green: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        sunset: 'bg-gradient-to-r from-orange-500 to-red-500',
      },
      size: {
        default: 'p-4 sm:p-6',
        lg: 'p-6 sm:p-8',
        sm: 'p-3 sm:p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface VoucherCardProps extends VariantProps<typeof voucherVariants> {
  title: string;
  amount: number;
  description: string;
  expiryDate?: Date | string;
  className?: string;
  customGradient?: string;
}

export default function VoucherCard({
  title,
  amount,
  description,
  expiryDate,
  variant,
  size,
  className,
  customGradient,
}: VoucherCardProps) {
  return (
    <Card
      className={cn(
        voucherVariants({ variant, size }),
        customGradient,
        'text-white group',
        className,
      )}
    >
      {/* Decorative Elements */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-6 sm:h-8 bg-white rounded-r-full 
        after:absolute after:w-1.5 sm:after:w-2 after:h-6 sm:after:h-8 after:-left-1 after:top-0 after:bg-black/5"
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 sm:w-4 h-6 sm:h-8 bg-white rounded-l-full
        after:absolute after:w-1.5 sm:after:w-2 after:h-6 sm:after:h-8 after:-right-1 after:top-0 after:bg-black/5"
      />

      {/* Decorative circles pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-2 -top-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30" />
        <div className="absolute -right-2 -bottom-2 w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/30" />
      </div>

      {/* Content */}
      <div className="relative space-y-1 sm:space-y-2">
        <div
          className="text-xs font-medium tracking-wide uppercase opacity-90 
          transition-transform duration-200 group-hover:transform group-hover:-translate-y-0.5"
        >
          {title}
        </div>
        <div
          className="text-3xl  font-bold tracking-tight 
          transition-transform duration-200 group-hover:transform group-hover:-translate-y-0.5"
        >
          {formatRupiah(amount)} Off
        </div>
        <div
          className="text-xs text-white/90 
          transition-transform duration-200 group-hover:transform group-hover:-translate-y-0.5"
        >
          {description}
        </div>
        {expiryDate && (
          <div
            className="flex items-center space-x-1 text-2xs sm:text-xs text-white/80 mt-1 sm:mt-2
            transition-transform duration-200 group-hover:transform group-hover:-translate-y-0.5"
          >
            <CalendarDays className="w-3 h-3" />
            <span>
              Valid until: {format(new Date(expiryDate), 'MMM d, yyyy')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ReactNode } from 'react';
import Spinner from '../spinner';

type Props =
  | {
      isLoading?: boolean;
      isLink: true;
      link: string;
      label: string;
      icon: ReactNode;
      iconPosition: 'left' | 'right';
      className?: string;
    }
  | {
      isLoading?: boolean;
      isLink: false;
      type: 'button' | 'submit';
      onClick?: () => void;
      label: string;
      icon: ReactNode;
      iconPosition: 'left' | 'right';
      className?: string;
    };

export default function ButtonRoseOutline(props: Props) {
  return (
    <div>
      {props.isLink && (
        <Link
          href={props.link}
          className={cn(
            'group flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium gap-x-2 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-rose-400 focus:ring-offset-2 bg-transparent text-brand-rose-600 border border-brand-rose-600 hover:bg-brand-rose-600/90 hover:text-brand-white-50',
            props.isLoading && 'pointer-events-none opacity-50',
            props.className,
          )}
        >
          <div className="transition-transform duration-150 ease-in-out group-hover:scale-110">
            {props.isLoading ? <Spinner /> : props.icon}
          </div>
          {props.isLoading ? 'Wait...' : props.label}
        </Link>
      )}
      {!props.isLink && (
        <button
          type={props.type}
          onClick={props.onClick}
          className={cn(
            'w-full group flex items-center justify-center rounded-full px-4 py-3  text-sm font-medium gap-x-2 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg active:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-rose-400 focus:ring-offset-2 bg-transparent text-brand-rose-600 border border-brand-rose-600 hover:bg-brand-rose-600/90 hover:text-brand-white-50',
            props.isLoading && 'pointer-events-none opacity-50',
            props.className,
          )}
        >
          {props.iconPosition === 'left' && (
            <div className="transition-transform duration-150 ease-in-out group-hover:scale-110">
              {props.isLoading ? <Spinner /> : props.icon}
            </div>
          )}
          {props.isLoading ? 'Wait...' : props.label}
          {props.iconPosition === 'right' && (
            <div className="transition-transform duration-150 ease-in-out group-hover:scale-110">
              {props.isLoading ? <Spinner /> : props.icon}
            </div>
          )}
        </button>
      )}
    </div>
  );
}

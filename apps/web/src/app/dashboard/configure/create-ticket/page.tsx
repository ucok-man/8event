'use client';

import ButtonRose from '@/components/shared/button-rose';
import StepNavigationBackButton from '@/components/shared/step-navigation-back-button';
import TicketCard from '@/components/shared/ticket-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCreateEventContext } from '@/context/create-event-provider';
import { useRender } from '@/hooks/use-rendered';
import { toast } from '@/hooks/use-toast';
import { validEvent, validbanner } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronRightIcon,
  Info,
  SquarePen,
  Ticket,
  Trash2Icon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CREATE_EVENT_STEPS } from '../constant';
import FreeTicketDialog from './free-ticket-dialog';
import PaidTicketDialog from './paid-ticket-dialog';
import {
  DEFAULT_FREE_TICKET,
  DEFAULT_PAID_TICKET,
  FreeTicket,
  FreeTicketValidationSchema,
  PaidTicket,
  PaidTicketValidationSchema,
} from './validation';

type Ticket = FreeTicket | PaidTicket;

export default function TicketCreation() {
  const { isRendered } = useRender();
  const { payload, updateCreateTicketPayload, updateCreateTicketError } =
    useCreateEventContext();

  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(
    (payload?.createTicket?.data as Ticket[]) || [],
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [intend, setIntend] = useState<'EDIT' | 'CREATE'>('CREATE');
  const [ticketType, setTicketType] = useState<'FREE' | 'PAID'>('FREE');
  const [editValue, setEditValue] = useState<
    FreeTicket | PaidTicket | undefined
  >(undefined);
  const [editTarget, setEditTarget] = useState<number | undefined>(undefined);
  const [formError, setFormError] = useState<
    Record<string, { type: 'onChange'; message: string }> | undefined
  >(undefined);

  const freeTicketForm = useForm<FreeTicket>({
    resolver: zodResolver(FreeTicketValidationSchema),
    defaultValues: DEFAULT_FREE_TICKET,
  });

  const paidTicketForm = useForm<PaidTicket>({
    resolver: zodResolver(PaidTicketValidationSchema),
    defaultValues: DEFAULT_PAID_TICKET,
  });

  const openDialog = (
    param:
      | { intend: 'CREATE'; type: 'FREE' | 'PAID' }
      | {
          intend: 'EDIT';
          type: 'FREE' | 'PAID';
          ticket: FreeTicket | PaidTicket;
          target: number;
          hasErr?: Record<string, { type: 'onChange'; message: string }>;
        },
  ) => {
    setIntend(param.intend);
    setTicketType(param.type);
    setIsDialogOpen(true);
    if (param.intend === 'EDIT') {
      setEditValue(param.ticket);
      setEditTarget(param.target);
      if (param.hasErr) setFormError(param.hasErr);
    }
  };

  const onTicketRemove = (target: number) => {
    setTickets((prev) => prev.filter((_, idx) => idx !== target));
    updateCreateTicketError((ticketErr) => {
      if (ticketErr) delete ticketErr[target];
      return ticketErr;
    });
  };

  const onTicketCreate = (data: FreeTicket | PaidTicket) => {
    setTickets([...tickets, { ...data }]);
    setIsDialogOpen(false);
  };

  const onTicketUpdate = (target: number, data: FreeTicket | PaidTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket, index) =>
        index === target ? { ...ticket, ...data } : ticket,
      ),
    );
    updateCreateTicketError((ticketErr) => {
      if (ticketErr) delete ticketErr[target];
      return ticketErr;
    });
    setIsDialogOpen(false);
  };

  const onContinue = () => {
    if (tickets.length < 1) {
      toast({
        title: 'Invalid Action',
        description: 'Create your ticket first before continue',
        variant: 'destructive',
      });
      return;
    }
    const hasErr = Object.keys(payload?.createTicket?.error || {}).length > 1;
    if (hasErr) {
      toast({
        title: 'Invalid Action',
        description: 'Resolve the error first before continue',
        variant: 'destructive',
      });
      return;
    }

    router.push('/dashboard/configure/review-draft');
  };

  // update local storage when tickets are change
  useEffect(() => {
    updateCreateTicketPayload(() => tickets);
  }, [tickets]);

  useEffect(() => {
    if (isDialogOpen === false) {
      setEditValue(undefined);
      setEditTarget(undefined);
      setFormError(undefined);
      freeTicketForm.reset(DEFAULT_FREE_TICKET);
      paidTicketForm.reset(DEFAULT_PAID_TICKET);
    }
  }, [isDialogOpen]);

  let redirectPath: string | null = null;
  if (!payload.uploadBanner || !validbanner(payload.uploadBanner)) {
    redirectPath = '/dashboard/configure/upload-banner';
  } else if (!payload.createEvent || !validEvent(payload.createEvent)) {
    redirectPath = '/dashboard/configure/create-event';
  }
  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath); // `replace` prevents navigation history buildup
    }
  }, [redirectPath, router]);

  if (redirectPath) return <div></div>;

  console.log({ formError });

  return (
    <div className="container py-10 mx-auto">
      {isRendered && (
        <Card className="mx-auto max-w-4xl shadow-lg">
          <CardHeader className="space-y-4 border-b bg-white px-8 py-6">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-brand-rose-500" />
              <CardTitle className="text-2xl font-bold text-gray-800">
                Create Event Tickets
              </CardTitle>
            </div>
            <CardDescription className="text-base text-gray-600">
              Set up your event tickets by choosing between free and paid
              options. Create multiple ticket types to accommodate different
              attendee preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 bg-white px-8 py-6">
            <div className="flex gap-4 max-sm:flex-col max-sm:w-full">
              <Button
                onClick={() =>
                  openDialog({
                    intend: 'CREATE',
                    type: 'FREE',
                  })
                }
                className="flex-1 bg-brand-blue-500 hover:bg-brand-blue-600"
              >
                Create Free Ticket
              </Button>
              <Button
                onClick={() =>
                  openDialog({
                    intend: 'CREATE',
                    type: 'PAID',
                  })
                }
                className="flex-1 bg-brand-rose-500 hover:bg-brand-rose-600"
              >
                Create Paid Ticket
              </Button>
            </div>

            {tickets.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Created Tickets
                </h3>

                {/* Ticket List */}
                <div className="space-y-4">
                  {tickets.map((ticket, idx) => {
                    let haserror = undefined;
                    if (payload?.createTicket?.error) {
                      haserror = payload.createTicket.error[idx];
                    }

                    return (
                      <TicketCard
                        ticket={ticket}
                        key={idx}
                        action={
                          <>
                            {/* Error indicator */}
                            {haserror && (
                              <div className="absolute flex w-full justify-center pt-4 z-20 animate-pulse">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="text-red-500 size-5" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This ticket has error. Please fix it</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            )}

                            {/* action button */}
                            <div className="absolute inset-0 flex justify-center items-center w-full z-10 transition-all duration-300 py-2 px-4 gap-x-4 bg-black/10 opacity-0 group-hover:opacity-100">
                              <button
                                className="hover:cursor-pointer hover:scale-105"
                                onClick={() => onTicketRemove(idx)}
                              >
                                <Trash2Icon className="size-5 text-red-500" />
                              </button>
                              <button
                                className="hover:cursor-pointer hover:scale-105"
                                onClick={() =>
                                  openDialog({
                                    intend: 'EDIT',
                                    type: ticket.type,
                                    ticket: ticket,
                                    target: idx,
                                    hasErr: haserror,
                                  })
                                }
                              >
                                <SquarePen className="size-5 text-green-500" />
                              </button>
                            </div>
                          </>
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {ticketType === 'PAID' ? (
              <PaidTicketDialog
                targetIndex={editTarget}
                intend={intend}
                editValue={editValue as PaidTicket}
                onTicketUpdate={onTicketUpdate}
                form={paidTicketForm}
                isDialogOpen={isDialogOpen}
                onSubmit={onTicketCreate}
                setIsDialogOpen={setIsDialogOpen}
                formError={formError}
                key={'PAID'}
              />
            ) : (
              <FreeTicketDialog
                targetIndex={editTarget}
                intend={intend}
                editValue={editValue as FreeTicket}
                onTicketUpdate={onTicketUpdate}
                form={freeTicketForm}
                isDialogOpen={isDialogOpen}
                onSubmit={onTicketCreate}
                setIsDialogOpen={setIsDialogOpen}
                formError={formError}
                key={'FREE'}
              />
            )}

            <div className="flex flex-col-reverse gap-4 justify-between pt-4 w-full md:flex-row">
              <StepNavigationBackButton steps={CREATE_EVENT_STEPS} />
              <ButtonRose
                type="button"
                isLink={false}
                iconPosition="right"
                label="Continue"
                icon={<ChevronRightIcon className="size-5" />}
                onClick={onContinue}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

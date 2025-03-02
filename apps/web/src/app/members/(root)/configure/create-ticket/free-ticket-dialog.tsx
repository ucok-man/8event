'use client';

import TimePicker from '@/components/shared/time-picker';
import { TimeType } from '@/components/shared/time-picker/time-type';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEventContext } from '@/context/create-event-provider';
import {
  dateFrom,
  firstIsAfterSecondDate,
  firstIsBeforeSecondDate,
  targetIsBeforeCurrentDate,
} from '@/lib/datetime-utils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DEFAULT_FREE_TICKET, FreeTicket, PaidTicket } from './validation';

type Props = {
  intend: 'CREATE' | 'EDIT';
  editValue: FreeTicket;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  form: ReturnType<typeof useForm<FreeTicket>>;
  onSubmit: (data: FreeTicket | PaidTicket) => void;
  formError?: Record<string, { type: 'onChange'; message: string }>;
};

export default function FreeTicketDialog({
  isDialogOpen,
  setIsDialogOpen,
  form,
  onSubmit,
  intend,
  editValue,
  formError,
}: Props) {
  const { payload } = useCreateEventContext();
  const eventstart = dateFrom(payload?.createEvent?.data?.startDate || '');
  eventstart.setDate(eventstart.getDate() - 1);

  useEffect(() => {
    form.reset(editValue || DEFAULT_FREE_TICKET);
    if (formError) {
      for (const key in formError) {
        form.setError(key as any, formError[key]);
      }
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {intend === 'CREATE' ? 'Create Free Ticket' : 'Edit This Ticket'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {intend.toLowerCase()} a new FREE
            ticket for your event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ticket name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter ticket description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full border-gray-200 pl-3 text-left font-normal hover:bg-brand-blue-100',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom(field.value)}
                          onSelect={(selected) =>
                            field.onChange(selected?.toISOString())
                          }
                          disabled={(date) =>
                            firstIsAfterSecondDate(date, eventstart) ||
                            targetIsBeforeCurrentDate(date)
                          }
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full border-gray-200 pl-3 text-left font-normal hover:bg-brand-blue-100',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom(field.value)}
                          onSelect={(selected) =>
                            field.onChange(selected?.toISOString())
                          }
                          disabled={(date) =>
                            firstIsAfterSecondDate(date, eventstart) ||
                            firstIsBeforeSecondDate(
                              date,
                              dateFrom(form.getValues('startDate')),
                            ) ||
                            targetIsBeforeCurrentDate(date)
                          }
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value as TimeType}
                        onChange={field.onChange}
                        triggerClassName={cn(
                          'hover:bg-brand-blue-100 [&>span]:text-muted-foreground border border-input shadow-sm [&>span]:hover:text-accent-foreground',
                          field.value && '[&>span]:text-foreground',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      End Time
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value as TimeType}
                        onChange={field.onChange}
                        triggerClassName={cn(
                          'hover:bg-brand-blue-100 [&>span]:text-muted-foreground border border-input shadow-sm [&>span]:hover:text-accent-foreground',
                          field.value && '[&>span]:text-foreground',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-brand-blue-500 hover:bg-brand-blue-600"
              >
                {intend === 'CREATE' ? 'Create Ticket' : 'Edit Ticket'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

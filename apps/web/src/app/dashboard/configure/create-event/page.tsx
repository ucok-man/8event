'use client';

import { CREATE_EVENT_STEPS } from '@/app/dashboard/configure/constant';
import ButtonRose from '@/components/shared/button-rose';
import RichTextEditor from '@/components/shared/richtext-editor';
import StepNavigationBackButton from '@/components/shared/step-navigation-back-button';
import TimePicker from '@/components/shared/time-picker';
import { TimeType } from '@/components/shared/time-picker/time-type';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEventContext } from '@/context/create-event-provider';
import { cn, validbanner } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChevronRightIcon,
  Globe2,
  MapPin,
  PartyPopper,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import 'react-clock/dist/Clock.css';
import { useForm } from 'react-hook-form';
import 'react-time-picker/dist/TimePicker.css';
import { useIsClient } from 'usehooks-ts';
import { z } from 'zod';
import { EVENT_CATEGORY } from './constant';
import { CreateEventSchema } from './validation';

type FormData = z.infer<typeof CreateEventSchema>;

export default function CreateEventForm() {
  const isClient = useIsClient();
  const { payload, updateCreateEventPayload, updateCreateEventError } =
    useCreateEventContext();

  const router = useRouter();
  const [isPushing, startTransition] = useTransition();

  const [isOnlineEvent, setIsOnlineEvent] = useState(
    payload?.createEvent?.data?.isEventOnline || false,
  );

  const form = useForm<FormData>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: payload.createEvent.data,
    errors: payload.createEvent.error,
  });

  const onContinue = (data: FormData) => {
    updateCreateEventPayload((prev) => ({ ...prev, ...data }));
    updateCreateEventError(() => undefined);
    startTransition(() => {
      router.push('/dashboard/configure/create-ticket');
    });
  };

  const isEventOnlineChoosen = form.watch('isEventOnline');
  useEffect(() => {
    if (isEventOnlineChoosen) {
      form.setValue(
        'placeName',
        payload.createEvent.data.placeName || undefined,
      );
      form.setValue(
        'placeAddress',
        payload.createEvent.data.placeAddress || undefined,
      );
      form.setValue(
        'placeCity',
        payload.createEvent.data.placeCity || undefined,
      );
    } else {
      form.setValue(
        'urlStreaming',
        payload.createEvent.data.urlStreaming || undefined,
      );
    }
  }, [isEventOnlineChoosen]);

  let redirectPath: string | null = null;
  if (!payload.uploadBanner || !validbanner(payload.uploadBanner)) {
    redirectPath = '/dashboard/configure/upload-banner';
  }
  useEffect(() => {
    if (redirectPath) {
      router.replace(redirectPath); // `replace` prevents navigation history buildup
    }
  }, [redirectPath, router]);

  if (redirectPath || !isClient) return <div></div>;

  return (
    <div>
      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardHeader className="space-y-4 border-b bg-white px-8 py-6">
          <div className="flex items-center gap-3">
            <PartyPopper className="h-8 w-8 text-brand-rose-500" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              Create Your Event
            </CardTitle>
          </div>
          <CardDescription className="text-base text-gray-600">
            Fill in the details below to create an unforgettable event that will
            bring people together.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 bg-white px-8 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onContinue)}
              className="space-y-8"
            >
              <div className="space-y-8">
                <div className="flex w-full flex-col gap-6 md:flex-row">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Event Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a memorable name for your event"
                            className="border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 max-sm:text-sm"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Choose a clear and catchy name (max 500 characters).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="md:w-1/3">
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Category
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              className={cn(
                                'border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 text-muted-foreground',
                                field.value && 'text-foreground',
                              )}
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="">
                              {EVENT_CATEGORY.map((ec, i) => (
                                <SelectItem
                                  key={i}
                                  value={ec.value}
                                  className=""
                                >
                                  {ec.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="rounded-lg bg-brand-blue-50 p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={(selected) =>
                                  field.onChange(selected?.toISOString())
                                }
                                disabled={(date) => date < new Date()}
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={(selected) =>
                                  field.onChange(selected?.toISOString())
                                }
                                disabled={(date) =>
                                  date <
                                    new Date(form.getValues('startDate')) ||
                                  date < new Date()
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
                </div>
                <div className="rounded-lg bg-brand-rose-50 p-6">
                  <FormField
                    control={form.control}
                    name="isEventOnline"
                    render={({}) => (
                      <FormItem className="grow">
                        <div className="flex items-center gap-x-4">
                          <Switch
                            id="toggle-online-form"
                            checked={isOnlineEvent}
                            onCheckedChange={(checked) => {
                              setIsOnlineEvent(checked);
                              form.setValue('isEventOnline', checked);
                            }}
                            className="data-[state=checked]:bg-brand-rose-500"
                          />
                          <Label
                            htmlFor="toggle-online-form"
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                          >
                            {isOnlineEvent ? (
                              <Globe2 className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            {isOnlineEvent ? 'Online Event' : 'Offline Event'}
                          </Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    {isOnlineEvent ? (
                      <FormField
                        control={form.control}
                        name="urlStreaming"
                        render={({ field }) => (
                          <FormItem className="grow">
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Streaming URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://"
                                className="border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 max-sm:text-sm"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="flex w-full flex-col gap-6 md:flex-row">
                          <FormField
                            control={form.control}
                            name="placeName"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  Venue Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter venue name"
                                    className="border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 max-sm:text-sm"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="placeCity"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-sm font-semibold text-gray-700">
                                  City
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter city name"
                                    className="border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 max-sm:text-sm"
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="placeAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-700">
                                Full Address
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter the complete venue address"
                                  className="resize-none border-gray-200 focus:border-brand-rose-500 focus:ring-brand-rose-500 max-sm:text-sm"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-lg">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Event Description
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            description={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col-reverse gap-4 justify-between pt-4 w-full md:flex-row">
                  <StepNavigationBackButton steps={CREATE_EVENT_STEPS} />
                  <ButtonRose
                    isLoading={isPushing}
                    type="submit"
                    isLink={false}
                    iconPosition="right"
                    label="Continue"
                    icon={<ChevronRightIcon className="size-5" />}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

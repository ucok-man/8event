'use client';

import { Icons } from '@/components/shared/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { refetchNow } from '@/context/query-provider';
import { useOrganizer } from '@/hooks/use-organizer';
import { toast } from '@/hooks/use-toast';
import { fadeInUp, opacityUp } from '@/lib/animation-template';
import { currentDate, dateFrom } from '@/lib/datetime-utils';
import { cn } from '@/lib/utils';
import { GetUserByIdResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Loader2, LucideIcon, Mail, PencilLine, Star, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NameSchema } from './validation';

type FormData = z.infer<typeof NameSchema>;

export default function ProfilePage() {
  const {
    user: session,
    apiclient,
    update: updateSession,
    status,
  } = useOrganizer();
  const [nameOpen, setNameOpen] = useState(false);

  const {
    data: user,
    error,
    isPending,
  } = useQuery({
    queryKey: ['profile', session?.id],
    queryFn: async () => {
      const { data } = await apiclient.get('/users/me');
      return data.user as GetUserByIdResponse['user'];
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: '',
    },
  });

  const { mutate: updateName, isPending: updateNamePending } = useMutation({
    mutationFn: async (payload: { name: string }) => {
      return await apiclient.patch(`/users/me`, payload);
    },

    onSuccess: () => {
      updateSession();
      setNameOpen(false);
      refetchNow(['profile']);
    },

    onError: () => {
      refetchNow(['profile']);
      toast({
        title: 'Update Failed',
        description: 'Sorry we found some issue on the server. Try again later',
        variant: 'destructive',
      });
    },
  });

  const { mutate: uploadProfile, isPending: uploadPending } = useMutation({
    mutationFn: async (payload: File) => {
      const form = new FormData();
      form.append('file-upload', payload);
      if (session?.profilePicture) {
        await apiclient.delete('/media', {
          data: {
            mediaUrl: user?.profilePicture,
          },
        });
      }
      const { data } = await apiclient.post('/media/users/profile', form);
      return await apiclient.patch(`/users/me`, {
        profilePicture: data.imageUrl,
      });
    },

    onSuccess: async () => {
      updateSession();
      refetchNow(['profile']);
    },

    onError: () => {
      refetchNow(['profile']);
      toast({
        title: 'Update Failed',
        description: 'Sorry we found some issue on the server. Try again later',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (nameOpen === false) form.reset();
  }, [nameOpen]);

  if (isPending) {
    return (
      <div className="p-8 text-center">
        <div className="text-base text-muted-foreground">
          🤔 Preparing your data...
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Unable Get User Detail',
      description: 'Sorry we found some issue on the server. Try again later',
      variant: 'destructive',
    });
    return null;
  }
  if (!user || status === 'pending') return null;

  return (
    <motion.div {...opacityUp} className="mt-8">
      <motion.div {...fadeInUp} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700">Profile details</h3>
        <Separator className="mt-4" />
      </motion.div>

      <motion.div {...fadeInUp} className="mb-8">
        <div className="flex items-center justify-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 relative">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="text-2xl bg-gray-200/70">
                {user?.name
                  .split(' ')
                  .map((name) => name[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>

              {/* Spinner */}
              {uploadPending && (
                <div className="absolute inset-0 flex size-full items-center justify-center">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              )}
            </Avatar>
            <Icons.Camera className="absolute -bottom-1 left-0 size-7 text-brand-blue-800 grainy-light rounded-full" />
            {/* Upload Action */}
            <label
              htmlFor="upload-file"
              className="absolute inset-0 z-30 cursor-pointer"
            ></label>
            <input
              onChange={(e) => {
                if (e.target.files?.length) uploadProfile(e.target.files[0]);
              }}
              accept="image/png, image/jpeg, image/jpg"
              id="upload-file"
              type="file"
              disabled={uploadPending}
              className="hidden"
            />
          </div>

          {/* Username */}
          <div className="text-gray-700 font-medium w-full">
            <div className="flex gap-2 items-center w-full">
              <p>{user?.name}</p>
              <Popover open={nameOpen} onOpenChange={(val) => setNameOpen(val)}>
                <PopoverTrigger asChild>
                  <button className="text-brand-blue-800">
                    <PencilLine className="size-4" />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="grainy-light rounded-lg relative">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((payload) => {
                        updateName(payload);
                      })}
                      className="space-y-8 grainy-light"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a new name"
                                className="ring-1 ring-ring"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your public display name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <button
                        type="submit"
                        className="text-sm px-4 py-2 text-white font-medium bg-brand-blue-800 rounded-md"
                      >
                        {updateNamePending ? (
                          <div className="flex w-full justify-center items-center">
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Submiting...
                          </div>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </form>
                  </Form>

                  <button
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setNameOpen(false);
                    }}
                  >
                    <X className="size-4" />
                  </button>
                </PopoverContent>
              </Popover>
            </div>
            <div className="text-xs text-gray-500">
              Member since{' '}
              {format(
                dateFrom(user?.createdAt || currentDate()),
                'MMM dd, yyyy',
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Card
        title="Email addresses"
        value={user?.email || ''}
        subvalue="Primary"
        icon={Mail}
        className="max-w-xl shadow-sm mb-8 text-gray-700"
        iconClass="text-brand-rose-500"
      />

      <Card
        title="Creator Rating"
        value={user.rating.toFixed(2)}
        subvalue="Based on event reviews"
        icon={Star}
        className="max-w-xl shadow-sm text-gray-700"
        iconClass="text-yellow-500"
      />
    </motion.div>
  );
}

type CardProp = {
  title: string;
  value: string;
  subvalue: string;
  icon: LucideIcon;
  className?: string;
  iconClass?: string;
};

function Card({
  title,
  value,
  subvalue,
  icon,
  className,
  iconClass,
}: CardProp) {
  const Icon = icon;

  return (
    <motion.div {...fadeInUp} className={cn('space-y-4', className)}>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon
              className={cn(
                'size-5 text-muted-foreground text-brand-blue-800',
                iconClass,
              )}
            />
            <div>
              <p className="font-medium ">{value}</p>
              <p className="text-sm text-muted-foreground">{subvalue}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

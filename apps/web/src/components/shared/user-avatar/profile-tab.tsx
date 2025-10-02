'use client';

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
import { useAuthContext } from '@/context/auth-provider';
import { refetchNow } from '@/context/query-provider';
import { toast } from '@/hooks/use-toast';
import { GetUserByIdResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, LucideIcon, Mail, PencilLine, QrCode, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Icons } from '../icons';
import { NameSchema } from './validation';

type FormData = z.infer<typeof NameSchema>;

export default function ProfileTab() {
  const { user: session, apiclient, update: updateSession } = useAuthContext();
  const [nameOpen, setNameOpen] = useState(false);

  const {
    data: user,
    error,
    isFetching,
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

  useEffect(() => {
    if (error)
      toast({
        title: 'Unable Get User Detail',
        description: 'Sorry we found some issue on the server. Try again later',
        variant: 'destructive',
      });
  }, [error]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Profile details</h3>
        <Separator className="mt-4" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 relative">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="text-2xl bg-gray-200/70">
                {user?.name.at(0)?.toUpperCase() ?? 'U'}
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
              Point Balance {user?.pointBalance || 0}
            </div>
          </div>
        </div>
      </div>

      <Card
        title="Email addresses"
        value={user?.email || ''}
        subvalue="Primary"
        icon={Mail}
      />

      <Card
        title="Referral Code"
        value={user?.referralCode || ''}
        subvalue="Invite other and get point balance"
        icon={QrCode}
      />
    </div>
  );
}

type CardProp = {
  title: string;
  value: string;
  subvalue: string;
  icon: LucideIcon;
};

function Card({ title, value, subvalue, icon }: CardProp) {
  const Icon = icon;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon className="size-5 text-muted-foreground !text-brand-blue-800" />
            <div>
              <p className="font-medium ">{value}</p>
              <p className="text-sm text-muted-foreground">{subvalue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

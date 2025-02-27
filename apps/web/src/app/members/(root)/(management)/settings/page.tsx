'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from '@/hooks/use-toast';
import { fadeInUp, opacityUp } from '@/lib/animation-template';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ResetPasswordSchema } from './validation';

type FormData = z.infer<typeof ResetPasswordSchema>;

export default function SettingsPage() {
  const { apiclient } = useAuthContext();

  const form = useForm<FormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currPassword: '',
      confPasssword: '',
      newPassword: '',
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationFn: async (payload: {
      password: { current: string; new: string };
    }) => {
      return await apiclient.patch(`/users/me`, payload);
    },

    onSuccess: () => {
      toast({
        title: 'Update Success',
        description: 'Your password has been updated!',
        variant: 'default',
      });
      form.reset();
    },

    onError: (error: AxiosError) => {
      if (error.status! >= 500) {
        toast({
          title: 'Update Failed',
          description:
            'Sorry we found some issue on the server. Try again later',
          variant: 'destructive',
        });
        form.reset();
      } else if (error.status! === 422) {
        form.setError('currPassword', {
          message: 'Invalid value for current password',
          type: 'onChange',
        });
        form.setValue('confPasssword', '');
        form.setValue('newPassword', '');
      } else {
        toast({
          title: 'Update Failed',
          description:
            'Something went wrong, and your request cannot be proccessed',
          variant: 'destructive',
        });
        form.reset();
      }
    },
  });

  return (
    <div className="mt-8">
      <motion.div {...opacityUp} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700">
            Change Password
          </h3>
          <Separator className="mt-4" />
        </div>
        <Form {...form}>
          <motion.form
            {...fadeInUp}
            className="space-y-2 max-w-xl text-gray-700"
            onSubmit={form.handleSubmit((data) =>
              update({
                password: {
                  current: data.currPassword,
                  new: data.newPassword,
                },
              }),
            )}
          >
            <FormField
              control={form.control}
              name="currPassword"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confPasssword"
              render={({ field }) => (
                <FormItem className="pb-6">
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="text-sm px-4 py-2 text-white font-medium bg-brand-blue-800 rounded-md"
            >
              {updatePending ? (
                <div className="flex w-full justify-center items-center">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </motion.form>
        </Form>
      </motion.div>
    </div>
  );
}

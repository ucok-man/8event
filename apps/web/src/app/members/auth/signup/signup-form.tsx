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
import { useAuthContext } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SignupSchema } from './validation';

type FormData = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();
  const { apiclient, login } = useAuthContext();

  const form = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: async (params: FormData) => {
      const { data } = await apiclient.post('/auth/register', {
        ...params,
        role: 'ORGANIZER',
      });
      return { user: data.user, params: params };
    },
    onSuccess: async ({ user, params }) => {
      try {
        await login(
          {
            email: params.email,
            password: params.password,
          },
          'ORGANIZER',
        );
        startTransition(() => {
          router.push('/members/overview');
        });
      } catch (error) {
        startTransition(() => {
          router.push('/members/auth/signin');
        });
      } finally {
        form.reset();
      }
    },

    onError: (error: AxiosError) => {
      setIsLoading(false);
      if (error.status! >= 500) {
        toast({
          title: 'Server Error',
          description: 'sorry we have problem in our server, try again later',
          variant: 'destructive',
        });
        form.reset();
        return;
      }

      if (error.status! === 422) {
        const {
          error: { detail: errmap },
        } = error.response?.data as { error: { detail: any } };

        for (const key in errmap) {
          if (key === '_errors') continue;
          form.setError(key as any, {
            message: errmap[key]._errors,
            type: 'onChange',
          });
          form.setValue(key as any, '');
        }
      }
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    register(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="w-full font-medium bg-brand-blue-700 text-white rounded-md py-2"
          disabled={isLoading || isRedirecting}
        >
          {isLoading ? (
            <div className="flex w-full justify-center items-center">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </div>
          ) : isRedirecting ? (
            <div className="flex w-full justify-center items-center">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Redirecting...
            </div>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </Form>
  );
}

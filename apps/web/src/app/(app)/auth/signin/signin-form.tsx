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
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SigninSchema } from './validation';

type FormData = z.infer<typeof SigninSchema>;

export function SigninForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isRedirecting, startTransition] = useTransition();
  const { login } = useAuthContext();

  const form = useForm<FormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      await login(values, 'CUSTOMER');
      form.reset();
      startTransition(() => {
        router.push('/');
      });
    } catch (error) {
      if (error instanceof AxiosError && error.status! >= 500) {
        toast({
          title: 'Server Error',
          description: 'sorry we have problem in our server, try again later',
          variant: 'destructive',
        });
        form.reset();
        setIsLoading(false);
        return;
      }
      form.setError('email', {
        type: 'onChange',
        message: 'Invalid email or password',
      });
      form.setError('password', {
        type: 'onChange',
        message: 'Invalid email or password',
      });
      form.setValue('password', '');
      setIsLoading(false);
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              Login account...
            </div>
          ) : isRedirecting ? (
            <div className="flex w-full justify-center items-center">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Redirecting...
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </Form>
  );
}

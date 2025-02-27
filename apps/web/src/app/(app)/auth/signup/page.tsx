import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SignupForm } from './signup-form';

export default function SignupPage() {
  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-xl max-md:hidden">
        <Image
          src={'/auth.svg'}
          alt="Auth Image"
          width={360}
          height={360}
          className="object-fit size-full"
        />
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold">Never miss your favorite events</h2>
          <p className="text-muted-foreground text-center">
            Join{' '}
            <Link
              href={'/members/auth/signup'}
              className="text-brand-blue-900 underline underline-offset-2 font-medium"
            >
              our members
            </Link>{' '}
            and experience the ease of transacting and managing events at
            8Event.
          </p>
        </div>
      </div>
      <div className="w-full max-w-md space-y-8 p-8 rounded-xl">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-primary/5 rounded-full">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-center">
            Sign up for a new account to get started
          </p>
        </div>

        <SignupForm />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-brand-blue-900 underline underline-offset-2 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

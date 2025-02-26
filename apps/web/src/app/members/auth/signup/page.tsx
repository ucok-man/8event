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
          src={'/auth-members.svg'}
          alt="Auth Image"
          width={360}
          height={360}
          className="object-fit size-full"
        />
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-bold">Host and manage events with ease</h2>
          <p className="text-muted-foreground text-center">
            Effortless event management for creators—plan, organize, and shine!
          </p>
        </div>
      </div>
      <div className="w-full max-w-md space-y-8 p-8 rounded-xl">
        <div className="flex flex-col items-center space-y-2">
          <div className="p-3 bg-primary/5 rounded-full">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Signup Membership
          </h1>
          <p className="text-muted-foreground text-center">
            Join our member and feel the experience
          </p>
        </div>

        <SignupForm />

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/members/auth/signin"
            className="text-brand-blue-900 underline underline-offset-2 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

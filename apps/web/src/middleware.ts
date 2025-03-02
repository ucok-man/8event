/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/identity';
    console.log({
      apiUrl: apiUrl,
      cookie: req.headers.get('cookie'),
    });
    const res = await fetch(apiUrl, {
      headers: { cookie: req.headers.get('cookie') || '' }, // Forward cookies
      credentials: 'include', // Allow cookies in cross-origin requests
    });

    const requestPath = req.nextUrl.pathname;

    // 🔹 If user is NOT logged in
    if (!res.ok) {
      console.log({
        from: 'res !ok',
        res: res,
      });
      if (
        requestPath.startsWith('/members') &&
        !requestPath.startsWith('/members/auth')
      ) {
        return NextResponse.redirect(new URL('/members/auth/signin', req.url));
      }

      if (requestPath.startsWith('/payment')) {
        return NextResponse.rewrite(new URL('/404', req.url)); // Show 404 page
      }

      return NextResponse.next(); // other path is ok;
    }

    const { user } = (await res.json()) as {
      user: { role: 'CUSTOMER' | 'ORGANIZER' };
    };

    const userIsCustomer = user?.role === 'CUSTOMER';
    const userIsOrganizer = user?.role === 'ORGANIZER';

    // 🔹 If a CUSTOMER tries to access `/members/*` (except `/members/auth`)
    if (
      userIsCustomer &&
      requestPath.startsWith('/members') &&
      !requestPath.startsWith('/members/auth')
    ) {
      return NextResponse.redirect(new URL('/members/auth/signin', req.url));
    }

    // 🔹 If an ORGANIZER tries to access `/payment/*`
    if (userIsOrganizer && requestPath.startsWith('/payment')) {
      return NextResponse.rewrite(new URL('/404', req.url)); // Show 404 page
    }
    return NextResponse.next(); // Proceed if authorized
  } catch (error) {
    console.log({
      from: 'catch error',
      error: error,
    });
    throw error;
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};

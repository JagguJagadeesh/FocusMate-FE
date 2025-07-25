import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Debug
  console.log('Middleware Token:', token);
  console.log('Path:', pathname);

  // If logged in and visiting auth pages, redirect to dashboard
  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If not logged in and visiting protected pages
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/community'))) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*', '/community/:path*'],
};

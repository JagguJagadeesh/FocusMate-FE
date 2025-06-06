// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  if (pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/', req.url));

    response.cookies.set({
      name: 'token',
      value: '',
      path: '/',
      expires: new Date(0),
    });

    return response;
  }

  // ✅ Redirect logged-in users away from auth pages
  if (token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ✅ Redirect unauthenticated users from protected routes
  const protectedRoutes = ['/dashboard'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/signin', '/auth/signup', '/dashboard/:path*', '/logout'], // ✅ include /logout
};

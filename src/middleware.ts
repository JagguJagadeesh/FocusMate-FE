import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get('token')?.value

  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*', '/community/:path*'],
}

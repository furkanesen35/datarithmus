// packages/client/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to public routes
  if (
    pathname.startsWith('/auth') ||
    pathname === '/api/login' ||
    pathname === '/api/register' ||
    pathname === '/api/auth/google'
  ) {
    return NextResponse.next();
  }

  // Redirect to /auth/login if no token for protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Defer JWT verification to API routes or pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
};
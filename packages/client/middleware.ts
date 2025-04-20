// packages/client/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;

  // Allow unauthenticated access to /auth
  if (req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Redirect to /auth if no token
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // Defer JWT verification to API routes or pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
};
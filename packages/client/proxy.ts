// packages/client/proxy.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(req: NextRequest) {
  const token =
    req.headers.get('authorization')?.split(' ')[1] ||
    req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Allow unauthenticated access to public routes
  if (
    pathname.startsWith('/auth') ||
    pathname === '/api/auth/login' ||
    pathname === '/api/register' ||
    pathname === '/api/auth/google' ||
    pathname === '/api/enroll' ||
    pathname === '/api/auth/request-password-reset' ||
    pathname === '/api/auth/reset-password' ||
    pathname === '/api/auth/verify-email' ||
    pathname === '/api/auth/resend-verification'
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const payload = await verifyToken(token);
    // Redirect non-superusers from admin routes
    if (pathname.startsWith('/admin') && !payload.isSuperuser) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch {
    // Redirect to login if token verification fails
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
};

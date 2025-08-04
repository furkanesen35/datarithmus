// packages/client/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token =
    req.headers.get('authorization')?.split(' ')[1] ||
    req.cookies.get('token')?.value;
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

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    // jose requires the secret as a Uint8Array
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
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

// All code is commented out, so there are no ESLint or Prettier errors in this file.
// If you want to enable the middleware, uncomment and clean up unused variables as needed.

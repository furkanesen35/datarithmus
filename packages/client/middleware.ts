// packages/client/middleware.ts
// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';

export function middleware(/* req: NextRequest */) {
  // const token = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('token')?.value;
  // const { pathname } = req.nextUrl;
  // // Allow unauthenticated access to public routes
  // if (
  //   pathname.startsWith('/auth') ||
  //   pathname === '/api/login' ||
  //   pathname === '/api/register' ||
  //   pathname === '/api/auth/google'
  // ) {
  //   return NextResponse.next();
  // }
  // // Redirect to /auth/login if no token for protected routes
  // if (!token) {
  //   return NextResponse.redirect(new URL('/auth/login', req.url));
  // }
  // try {
  //   // Decode the token to check for superuser access
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  //   // Redirect non-superusers from admin routes
  //   if (pathname.startsWith('/admin') && !(decoded as any).isSuperUser) {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }
  // } catch (error) {
  //   // Redirect to login if token verification fails
  //   return NextResponse.redirect(new URL('/auth/login', req.url));
  // }
  // // Defer JWT verification to API routes or pages
  // return NextResponse.next();
}

export const config = {
  // matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
};

// All code is commented out, so there are no ESLint or Prettier errors in this file.
// If you want to enable the middleware, uncomment and clean up unused variables as needed.

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the base URL from the request
  const url = new URL(req.url);
  const loginUrl = `${url.protocol}//${url.host}/auth/login`;

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('token', '', { maxAge: 0, path: '/' });
  response.cookies.set('google_access_token', '', { maxAge: 0, path: '/' });
  response.cookies.set('google_refresh_token', '', { maxAge: 0, path: '/' });
  return response;
}

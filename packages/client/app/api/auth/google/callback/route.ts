// packages/client/app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '../../../../../lib/googleMeet';

export async function GET(request: NextRequest) {
  console.log('Google OAuth callback hit:', request.url);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      new URL(
        '/dashboard?auth_error=' + encodeURIComponent(error),
        request.url,
      ),
    );
  }

  if (!code) {
    console.warn('No code found in callback URL.');
    return NextResponse.redirect(
      new URL('/dashboard?auth_error=no_code', request.url),
    );
  }

  try {
    console.log('Exchanging code for tokens:', code);
    const tokens = await exchangeCodeForTokens(code);
    console.log('Tokens received from Google:', tokens);

    // Store tokens securely (you might want to encrypt these)
    const response = NextResponse.redirect(
      new URL('/dashboard?auth_success=true', request.url),
    );

    // Store access token in a secure HTTP-only cookie
    response.cookies.set('google_access_token', tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date
        ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
        : 3600,
      sameSite: 'lax',
    });
    console.log('Set google_access_token cookie:', tokens.access_token);

    // Store refresh token if available
    if (tokens.refresh_token) {
      response.cookies.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: 'lax',
      });
      console.log('Set google_refresh_token cookie:', tokens.refresh_token);
    }

    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.redirect(
      new URL('/dashboard?auth_error=token_exchange_failed', request.url),
    );
  }
}

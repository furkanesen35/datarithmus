// packages/client/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { signToken } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

function isDatabaseUnavailable(error: unknown): boolean {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    ['P1001', 'P1002', 'P1017'].includes(error.code)
  ) {
    return true;
  }

  return (
    error instanceof Prisma.PrismaClientInitializationError &&
    /can't reach database server|timed out fetching a new connection/i.test(
      error.message,
    )
  );
}

export async function POST(req: NextRequest) {
  let token: unknown;
  try {
    const body: { token?: unknown } = await req.json();
    token = body.token;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (typeof token !== 'string' || !token) {
    return NextResponse.json(
      { error: 'Google credential is missing.' },
      { status: 400 },
    );
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return NextResponse.json(
      { error: 'Google could not verify your sign-in. Please try again.' },
      { status: 401 },
    );
  }

  if (!payload?.email) {
    return NextResponse.json(
      { error: 'Google account did not provide an email address.' },
      { status: 401 },
    );
  }

  let user;
  try {
    const { email } = payload;
    user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: '',
          isSuperuser: false,
          username: email.split('@')[0], // Use email prefix as username
        },
      });
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          error: user.emailVerified
            ? 'This account has been deactivated. Please contact an administrator.'
            : 'Account not verified. Please check your email.',
        },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error('Google auth error:', error);
    if (isDatabaseUnavailable(error)) {
      return NextResponse.json(
        {
          error:
            'Sign-in is temporarily unavailable because the account service cannot be reached. Please try again in a moment.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  try {
    const jwtToken = await signToken({
      email: user.email,
      isSuperuser: user.isSuperuser,
    });

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      isSuperuser: user.isSuperuser,
    });
    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Failed to establish Google auth session:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

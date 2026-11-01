import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendPasswordResetEmail } from '../../../../lib/passwordReset';
import { getBaseUrl } from '../../../utils/baseUrl';

const prisma = new PrismaClient();

// POST /api/auth/request-password-reset { email }
export async function POST(req: NextRequest) {
  try {
    const body: { email?: unknown } = await req.json();
    if (typeof body.email !== 'string' || !body.email.trim()) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.trim() },
    });
    if (user) {
      await sendPasswordResetEmail(prisma, user, getBaseUrl());
    }

    return NextResponse.json({
      message:
        'If an account exists for that email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset email request failed:', error);
    return NextResponse.json(
      { error: 'Could not send password reset email. Please try again later.' },
      { status: 500 },
    );
  }
}

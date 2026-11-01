import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { isPasswordValid } from '../../../../lib/passwordPolicy';

const prisma = new PrismaClient();

// POST /api/auth/reset-password { token, password }
export async function POST(req: NextRequest) {
  const body: { token?: unknown; password?: unknown } = await req.json();
  const { token, password } = body;

  if (typeof token !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Missing token or new password' },
      { status: 400 },
    );
  }
  if (!isPasswordValid(password)) {
    return NextResponse.json(
      { error: 'Password does not meet the password requirements.' },
      { status: 400 },
    );
  }

  try {
    const reset = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!reset || reset.used || reset.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hash, mustChangePassword: false },
    });

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error during password reset:', err);
    return NextResponse.json(
      { error: 'Server error during password reset' },
      { status: 500 },
    );
  }
}

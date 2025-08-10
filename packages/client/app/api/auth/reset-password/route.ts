import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/auth/reset-password { token, password }
export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  console.log('=== PASSWORD RESET REQUEST ===');
  console.log('Token received:', token);
  console.log('Password received:', password ? '[PROVIDED]' : '[MISSING]');

  if (!token || !password) {
    console.error('Missing token or password');
    return NextResponse.json(
      { error: 'Missing token or new password' },
      { status: 400 },
    );
  }

  try {
    console.log('Looking for reset token in database...');
    const reset = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    console.log(
      'Found reset token:',
      reset
        ? `ID: ${reset.id}, Used: ${reset.used}, Expires: ${reset.expiresAt}`
        : 'NULL',
    );

    if (!reset || reset.used || reset.expiresAt < new Date()) {
      console.error('Invalid or expired token:', {
        found: !!reset,
        used: reset?.used,
        expired: reset ? reset.expiresAt < new Date() : false,
      });
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 },
      );
    }

    console.log('Hashing new password...');
    const hash = await bcrypt.hash(password, 10);

    console.log('Updating user password...');
    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hash, mustChangePassword: false },
    });
    console.log('User updated successfully, mustChangePassword set to false');

    console.log('Marking token as used...');
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });
    console.log('Token marked as used');

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error during password reset:', err);
    return NextResponse.json(
      { error: 'Server error during password reset' },
      { status: 500 },
    );
  }
}

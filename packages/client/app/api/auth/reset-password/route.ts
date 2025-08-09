import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/auth/reset-password { token, password }
export async function POST(req: NextRequest) {
  const { token, tempPassword, password } = await req.json();
  if (!token || !tempPassword || !password)
    return NextResponse.json(
      { error: 'Missing token, temporary password, or new password' },
      { status: 400 },
    );
  const reset = await prisma.passwordResetToken.findUnique({
    where: { token },
  });
  if (!reset || reset.used || reset.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }
  if (reset.tempPassword !== tempPassword) {
    return NextResponse.json(
      { error: 'Temporary password is incorrect' },
      { status: 400 },
    );
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hash },
  });
  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
  return NextResponse.json({ message: 'Password reset successful' });
}

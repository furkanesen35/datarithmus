import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// POST /api/auth/verify-email { token }
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token)
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });
  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }
  // Activate user and set mustChangePassword to true
  const user = await prisma.user.update({
    where: { id: record.userId },
    data: { isActive: true, mustChangePassword: true },
  });
  await prisma.emailVerificationToken.update({
    where: { token },
    data: { used: true },
  });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  });
  // Return token for frontend redirect
  return NextResponse.json({
    message: 'Email verified successfully',
    resetToken,
  });
}

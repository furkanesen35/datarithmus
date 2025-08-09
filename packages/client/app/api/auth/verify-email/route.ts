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
  // Activate user
  const user = await prisma.user.update({
    where: { id: record.userId },
    data: { isActive: true },
  });
  await prisma.emailVerificationToken.update({
    where: { token },
    data: { used: true },
  });

  // Find temp password from user (set at creation)
  // If you store temp password elsewhere, adjust this logic
  // For now, assume user.password is hashed temp password, so we need to get the unhashed temp password
  // Instead, fetch from the last invite-from-application (or store temp password in a field or another table)
  // For now, let's try to find the latest PasswordResetToken for this user, if any
  // If not found, generate a new temp password
  // Use tempPassword from EmailVerificationToken
  const tempPassword = record.tempPassword ?? '';
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      tempPassword,
      expiresAt,
    },
  });
  // Return token for frontend redirect
  return NextResponse.json({
    message: 'Email verified successfully',
    resetToken,
  });
}

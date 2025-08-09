import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/mail';
import { getBaseUrl } from '../../../utils/baseUrl';

const prisma = new PrismaClient();

// POST /api/auth/request-password-reset { email }
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const token = crypto.randomBytes(32).toString('hex');
  const tempPassword = crypto.randomBytes(8).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, tempPassword, expiresAt },
  });
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${token}`;
  // Send password reset email with temp password
  await sendMail({
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Your temporary password: <b>${tempPassword}</b></p><p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  return NextResponse.json({
    message: 'Password reset link and temporary password sent to your email.',
  });
}

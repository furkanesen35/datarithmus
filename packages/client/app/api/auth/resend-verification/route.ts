import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '../../../../lib/mail';
import crypto from 'crypto';
import { getBaseUrl } from '../../../utils/baseUrl';

const prisma = new PrismaClient();

// POST /api/auth/resend-verification { email }
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.isActive)
    return NextResponse.json(
      { error: 'User already verified' },
      { status: 400 },
    );

  // Invalidate old tokens
  await prisma.emailVerificationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // Create new token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
  await prisma.emailVerificationToken.create({
    data: { userId: user.id, token, expiresAt },
  });
  const verifyUrl = `${getBaseUrl()}/auth/verify-email?token=${token}`;
  try {
    await sendMail({
      to: user.email,
      subject: 'Verify your email (Resent)',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #2563eb;">Welcome to Datarithmus!</h2>
          <p>We received a request to resend your verification email. Please verify your email by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Verify Email</a>
          <p>If you did not create an account, you can ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
        </div>
      `,
    });
    return NextResponse.json({
      message: 'Verification email resent. Please check your inbox.',
    });
  } catch (mailError) {
    console.error('Resend email error:', mailError);
    return NextResponse.json(
      { error: 'Could not send verification email.' },
      { status: 500 },
    );
  }
}

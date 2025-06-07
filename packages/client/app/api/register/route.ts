// packages/client/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendMail } from '../../../lib/mail';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate email verification token first
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    let user;
    try {
      // Try to send the email before creating the user
      const verifyUrl = `http://localhost:3000/auth/verify-email?token=${token}`;
      await sendMail({
        to: email,
        subject: 'Verify your email',
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
            <h2 style="color: #2563eb;">Welcome to Datarithmus!</h2>
            <p>Thank you for registering. Please verify your email by clicking the button below:</p>
            <a href="${verifyUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Verify Email</a>
            <p>If you did not create an account, you can ignore this email.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
          </div>
        `,
      });
      // Only create the user and token if email send succeeds
      user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          isSuperuser: false,
        },
      });
      await prisma.emailVerificationToken.create({
        data: { userId: user.id, token, expiresAt },
      });
    } catch (mailError) {
      console.error('Email send error:', mailError);
      return NextResponse.json(
        { error: 'Registration failed: could not send verification email.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message:
        'Registration successful! Please check your email to verify your account.',
    });
  } catch {
    // Log the error for debugging
    // If error is an object, try to get a message
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

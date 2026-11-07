import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/mail';
import { getBaseUrl } from '../../../utils/baseUrl';
import { isPasswordValid } from '../../../../lib/passwordPolicy';
import { isEmailValid } from '../../../../lib/formValidation';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body: {
      username?: unknown;
      email?: unknown;
      password?: unknown;
    } = await req.json();
    const { username, email, password } = body;
    if (
      typeof username !== 'string' ||
      !username.trim() ||
      typeof email !== 'string' ||
      !isEmailValid(email) ||
      typeof password !== 'string' ||
      !isPasswordValid(password)
    ) {
      return NextResponse.json(
        {
          error:
            'Username, email, and a password meeting all password requirements are required.',
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim();
    const normalizedUsername = username.trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    // Save the account first so an email outage never blocks registration.
    // A nested create writes the user and token atomically in one query.
    // The account stays inactive until the email link is used.
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword,
        isSuperuser: false,
        isActive: false,
        emailVerified: false,
        emailVerificationTokens: { create: { token, expiresAt } },
      },
    });

    try {
      const verifyUrl = `${getBaseUrl()}/auth/verify-email#token=${token}`;
      await sendMail({
        to: normalizedEmail,
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
    } catch (mailError) {
      console.error('Email send error:', mailError);
      return NextResponse.json({
        emailSent: false,
        message:
          'Your account was created, but we could not send the verification email. Please request a new verification email.',
      });
    }

    return NextResponse.json({
      emailSent: true,
      message:
        'Registration successful! Please check your email to verify your account.',
    });
  } catch {
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}

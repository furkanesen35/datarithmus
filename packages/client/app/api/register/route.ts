// packages/client/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendMail } from '../../../lib/mail';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
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
        html: `<p>Welcome! Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
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
      return NextResponse.json({ error: 'Registration failed: could not send verification email.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    // Log the error for debugging
    console.error('Registration error:', error);
    // If error is an object, try to get a message
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
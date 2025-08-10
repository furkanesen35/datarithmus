// packages/client/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account not verified. Please check your email.' },
        { status: 403 },
      );
    }
    if (user.mustChangePassword) {
      // Generate password reset token
      const crypto = await import('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry
      console.log(
        'User must change password, creating reset token:',
        resetToken,
      );
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
        },
      });
      console.log('Reset token created successfully');
      return NextResponse.json(
        {
          error: 'Password change required',
          redirect: `/auth/reset-password?token=${resetToken}`,
        },
        { status: 403 },
      );
    }

    const token = jwt.sign(
      { email: user.email, isSuperuser: user.isSuperuser },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    );

    const response = NextResponse.json({
      email: user.email,
      isSuperuser: user.isSuperuser,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

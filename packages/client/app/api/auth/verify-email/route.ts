import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/auth/verify-email { token }
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token)
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: { select: { isActive: true, emailVerified: true } } },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }
  // Already verified: never touch isActive, so an admin deactivation sticks.
  if (record.user.emailVerified) {
    if (record.user.isActive) {
      return NextResponse.json({ message: 'Email already verified' });
    }
    return NextResponse.json(
      {
        error:
          'This account has been deactivated. Please contact an administrator.',
      },
      { status: 403 },
    );
  }
  if (record.used) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }

  // Activate the account; registration already collected the user's password.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { isActive: true, emailVerified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { token },
      data: { used: true },
    }),
  ]);

  return NextResponse.json({
    message: 'Email verified successfully',
  });
}

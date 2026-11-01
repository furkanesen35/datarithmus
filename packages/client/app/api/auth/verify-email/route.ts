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
    include: { user: { select: { isActive: true } } },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }
  if (record.used) {
    if (record.user.isActive) {
      return NextResponse.json({
        message: 'Email verified successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }

  // Activate the account; registration already collected the user's password.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { isActive: true },
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

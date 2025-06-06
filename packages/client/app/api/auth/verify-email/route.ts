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
  });
  if (!record || record.used || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 },
    );
  }
  await prisma.user.update({
    where: { id: record.userId },
    data: { isActive: true },
  });
  await prisma.emailVerificationToken.update({
    where: { token },
    data: { used: true },
  });
  return NextResponse.json({ message: 'Email verified successfully' });
}

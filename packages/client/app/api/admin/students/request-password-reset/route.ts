import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../../../lib/auth';
import { sendPasswordResetEmail } from '../../../../../lib/passwordReset';
import { getBaseUrl } from '../../../../utils/baseUrl';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const auth = await verifyToken(token);
    if (!auth.isSuperuser) {
      return NextResponse.json(
        { error: 'Superuser access required' },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const body: { id?: unknown } = await req.json();
    if (
      typeof body.id !== 'number' ||
      !Number.isInteger(body.id) ||
      body.id <= 0
    ) {
      return NextResponse.json({ error: 'A valid student ID is required.' }, {
        status: 400,
      });
    }

    const student = await prisma.user.findFirst({
      where: { id: body.id, isSuperuser: false },
      select: { id: true, email: true, username: true },
    });
    if (!student) {
      return NextResponse.json({ error: 'Student not found.' }, {
        status: 404,
      });
    }

    await sendPasswordResetEmail(prisma, student, getBaseUrl());
    return NextResponse.json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error('Admin password reset email failed:', error);
    return NextResponse.json(
      { error: 'Could not send password reset email. Please try again later.' },
      { status: 500 },
    );
  }
}

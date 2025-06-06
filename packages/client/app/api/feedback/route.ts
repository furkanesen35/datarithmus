// packages/client/app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
}

async function requireSuperuser(
  req: NextRequest,
): Promise<NextResponse | null> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
    ) as JwtPayload;
    if (!decoded.isSuperuser) {
      return NextResponse.json(
        { error: 'Superuser access required' },
        { status: 403 },
      );
    }
    return null;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(feedback);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { question, scale } = await req.json();
  if (!question || scale === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: { question, scale: Number(scale) },
  });

  return NextResponse.json(
    { message: 'Feedback created', feedback },
    { status: 201 },
  );
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, question, scale } = await req.json();
  if (!id || !question || scale === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const feedback = await prisma.feedback.update({
    where: { id: Number(id) },
    data: { question, scale: Number(scale) },
  });

  return NextResponse.json({ message: 'Feedback updated', feedback });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.feedback.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Feedback deleted' });
}

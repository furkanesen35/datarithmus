// packages/client/app/api/quizzes/route.ts
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
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    include: { questions: true },
  });
  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, questions } = await req.json();
  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json(
      { error: 'Missing title or questions' },
      { status: 400 },
    );
  }

  const quiz = await prisma.quiz.create({
    data: {
      title,
      questions: {
        create: questions.map((q: { question: string; options: string[]; correctAnswer: number }) => ({
          question: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer - 1, // store as 0-based
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json({ message: 'Quiz created', quiz }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, questions } = await req.json();
  if (!id || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const quiz = await prisma.quiz.update({
    where: { id: Number(id) },
    data: {
      questions: {
        set: [],
        create: questions.map((q: { question: string; options: string[]; correctAnswer: number }) => ({
          question: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer - 1,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json({ message: 'Quiz updated', quiz });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.quiz.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Quiz deleted' });
}

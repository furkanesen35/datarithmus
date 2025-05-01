// packages/client/app/api/student-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
}

async function requireSuperuser(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload;
    if (!decoded.isSuperuser) {
      return NextResponse.json({ error: 'Superuser access required' }, { status: 403 });
    }
    return null;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  // Get all non-superuser users
  const students = await prisma.user.findMany({
    where: { isSuperuser: false },
    select: { id: true, email: true, username: true },
    orderBy: { username: "asc" },
  });

  // Get all quizzes and their questions
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      questions: {
        orderBy: { id: "asc" },
        select: { id: true, question: true },
      },
    },
  });

  // Get all quiz results
  const quizResults = await prisma.quizResult.findMany();

  // Map: { [userId]: { [questionId]: { answer, isCorrect } } }
  const results: { [userId: number]: { [questionId: number]: { answer: number; isCorrect: boolean } } } = {};
  for (const r of quizResults) {
    if (!results[r.userId]) results[r.userId] = {};
    results[r.userId][r.questionId] = { answer: r.answer, isCorrect: r.isCorrect };
  }

  return NextResponse.json({ students, quizzes, results });
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { studentEmail, homeworkCompleted, quizScore, notes } = await req.json();
  if (!studentEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const progress = await prisma.studentProgress.create({
    data: {
      studentEmail,
      homeworkCompleted: Number(homeworkCompleted) || 0,
      quizScore: Number(quizScore) || 0,
      notes,
    },
  });

  return NextResponse.json({ message: "Progress created", progress }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, studentEmail, homeworkCompleted, quizScore, notes } = await req.json();
  if (!id || !studentEmail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const progress = await prisma.studentProgress.update({
    where: { id: Number(id) },
    data: {
      studentEmail,
      homeworkCompleted: Number(homeworkCompleted) || 0,
      quizScore: Number(quizScore) || 0,
      notes,
    },
  });

  return NextResponse.json({ message: "Progress updated", progress });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.studentProgress.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Progress deleted" });
}
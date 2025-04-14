import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const quizzes = await prisma.quiz.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { question, options, correctAnswer } = await req.json();
  if (!question || !options || correctAnswer === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      question,
      options: JSON.stringify(options),
      correctAnswer: Number(correctAnswer),
    },
  });

  return NextResponse.json({ message: "Quiz created", quiz }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, question, options, correctAnswer } = await req.json();
  if (!id || !question || !options || correctAnswer === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const quiz = await prisma.quiz.update({
    where: { id: Number(id) },
    data: {
      question,
      options: JSON.stringify(options),
      correctAnswer: Number(correctAnswer),
    },
  });

  return NextResponse.json({ message: "Quiz updated", quiz });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.quiz.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Quiz deleted" });
}
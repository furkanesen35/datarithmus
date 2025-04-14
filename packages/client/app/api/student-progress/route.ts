import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const progress = await prisma.studentProgress.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(progress);
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
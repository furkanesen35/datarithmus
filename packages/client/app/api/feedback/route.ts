import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(feedback);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { question, scale } = await req.json();
  if (!question || scale === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: { question, scale: Number(scale) },
  });

  return NextResponse.json({ message: "Feedback created", feedback }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, question, scale } = await req.json();
  if (!id || !question || scale === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const feedback = await prisma.feedback.update({
    where: { id: Number(id) },
    data: { question, scale: Number(scale) },
  });

  return NextResponse.json({ message: "Feedback updated", feedback });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.feedback.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Feedback deleted" });
}
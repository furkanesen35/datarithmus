import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const discussions = await prisma.discussion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(discussions);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, content, author, pinned } = await req.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const discussion = await prisma.discussion.create({
    data: { title, content, author, pinned: pinned || false },
  });

  return NextResponse.json({ message: "Discussion created", discussion }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, title, content, author, pinned } = await req.json();
  if (!id || !title || !content || !author) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const discussion = await prisma.discussion.update({
    where: { id: Number(id) },
    data: { title, content, author, pinned },
  });

  return NextResponse.json({ message: "Discussion updated", discussion });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.discussion.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Discussion deleted" });
}
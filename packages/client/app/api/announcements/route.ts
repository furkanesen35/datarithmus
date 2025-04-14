import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(announcements);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, content, pinned } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: { title, content, pinned: pinned || false },
  });

  return NextResponse.json({ message: "Announcement created", announcement }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, title, content, pinned } = await req.json();
  if (!id || !title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const announcement = await prisma.announcement.update({
    where: { id: Number(id) },
    data: { title, content, pinned },
  });

  return NextResponse.json({ message: "Announcement updated", announcement });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.announcement.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Announcement deleted" });
}
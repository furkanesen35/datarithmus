import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const schedules = await prisma.schedule.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, date, time, description } = await req.json();
  if (!title || !date || !time) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: { title, date: new Date(date), time, description },
  });

  return NextResponse.json({ message: "Schedule created", schedule }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id, title, date, time, description } = await req.json();
  if (!id || !title || !date || !time) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const schedule = await prisma.schedule.update({
    where: { id: Number(id) },
    data: { title, date: new Date(date), time, description },
  });

  return NextResponse.json({ message: "Schedule updated", schedule });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.schedule.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Schedule deleted" });
}
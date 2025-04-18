import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const homework = await prisma.homework.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(homework);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;
  const file = formData.get("file") as File | null;

  if (!title || !description || !dueDate) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let filePath: string | undefined;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const pathToSave = path.join(process.cwd(), "public/uploads", filename);
    await fs.mkdir(path.dirname(pathToSave), { recursive: true });
    await fs.writeFile(pathToSave, buffer);
    filePath = `/uploads/${filename}`;
  }

  const homework = await prisma.homework.create({
    data: { title, description, dueDate: new Date(dueDate), filePath },
  });

  return NextResponse.json({ message: "Homework created", homework }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("dueDate") as string;
  const file = formData.get("file") as File | null;

  if (!id || !title || !description || !dueDate) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const data: any = { title, description, dueDate: new Date(dueDate) };
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const pathToSave = path.join(process.cwd(), "public/uploads", filename);
    await fs.mkdir(path.dirname(pathToSave), { recursive: true });
    await fs.writeFile(pathToSave, buffer);
    data.filePath = `/uploads/${filename}`;
  }

  const homework = await prisma.homework.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json({ message: "Homework updated", homework });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const homework = await prisma.homework.findUnique({ where: { id: Number(id) } });
  if (homework?.filePath) {
    const filePath = path.join(process.cwd(), "public", homework.filePath);
    await fs.unlink(filePath).catch(() => {});
  }

  await prisma.homework.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Homework deleted" });
}
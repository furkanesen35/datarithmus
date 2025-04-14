import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const resources = await prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const link = formData.get("link") as string | null;
  const file = formData.get("file") as File | null;

  if (!title || !category) {
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

  const resource = await prisma.resource.create({
    data: { title, category, link: link || undefined, filePath },
  });

  return NextResponse.json({ message: "Resource created", resource }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const link = formData.get("link") as string | null;
  const file = formData.get("file") as File | null;

  if (!id || !title || !category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const data: any = { title, category, link: link || undefined };
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const pathToSave = path.join(process.cwd(), "public/uploads", filename);
    await fs.mkdir(path.dirname(pathToSave), { recursive: true });
    await fs.writeFile(pathToSave, buffer);
    data.filePath = `/uploads/${filename}`;
  }

  const resource = await prisma.resource.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json({ message: "Resource updated", resource });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({ where: { id: Number(id) } });
  if (resource?.filePath) {
    const filePath = path.join(process.cwd(), "public", resource.filePath);
    await fs.unlink(filePath).catch(() => {});
  }

  await prisma.resource.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Resource deleted" });
}
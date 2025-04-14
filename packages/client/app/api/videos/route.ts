import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;

  if (!title || !description || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public/uploads", filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);

  const video = await prisma.video.create({
    data: { title, description, filePath: `/uploads/${filename}` },
  });

  return NextResponse.json({ message: "Video uploaded", video }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const formData = await req.formData();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File | null;

  if (!id || !title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const data: any = { title, description };
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    data.filePath = `/uploads/${filename}`;
  }

  const video = await prisma.video.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json({ message: "Video updated", video });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  if (video?.filePath) {
    const filePath = path.join(process.cwd(), "public", video.filePath);
    await fs.unlink(filePath).catch(() => {});
  }

  await prisma.video.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: "Video deleted" });
}
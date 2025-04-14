// app/api/homework/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;
  const items = await prisma.homework.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
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
  const item = await prisma.homework.create({
    data: { title, description, dueDate: new Date(dueDate), filePath },
  });
  return NextResponse.json({ message: "Created", item }, { status: 201 });
}

// Add PUT, DELETE similarly
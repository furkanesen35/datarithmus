import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireSuperuser } from "../../../lib/authMiddleware";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/videos:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!title || !description || !file) {
      return NextResponse.json(
        { error: "Title, description, and file are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);

    const video = await prisma.video.create({
      data: {
        title,
        description,
        filePath: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({ message: "Video uploaded successfully", video }, { status: 201 });
  } catch (error) {
    console.error("POST /api/videos:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: "ID, title, and description are required" },
        { status: 400 }
      );
    }

    const data: any = { title, description };
    if (file) {
      if (!file.type.startsWith("video/")) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }
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

    return NextResponse.json({ message: "Video updated successfully", video });
  } catch (error) {
    console.error("PUT /api/videos:", error);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({ where: { id: Number(id) } });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete file
    if (video.filePath) {
      const filePath = path.join(process.cwd(), "public", video.filePath);
      await fs.unlink(filePath).catch(() => {});
    }

    await prisma.video.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/videos:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
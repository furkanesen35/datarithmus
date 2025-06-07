// packages/client/app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireSuperuser } from '../../../lib/authMiddleware';

const prisma = new PrismaClient();

export async function GET() {
  const authCheck = await requireSuperuser();
  if (authCheck) return authCheck;

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser();
  if (authCheck) return authCheck;

  const { title, description, videoUrl } = await req.json();
  if (!title || !description || !videoUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const video = await prisma.video.create({
    data: { title, description, videoUrl },
  });

  return NextResponse.json({ message: 'Video added', video }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authCheck = await requireSuperuser();
  if (authCheck) return authCheck;

  const { id, title, description, videoUrl } = await req.json();
  if (!id || !title || !description || !videoUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const video = await prisma.video.update({
    where: { id: Number(id) },
    data: { title, description, videoUrl },
  });

  return NextResponse.json({ message: 'Video updated', video });
}

export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser();
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.video.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Video deleted' });
}

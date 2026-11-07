// packages/client/app/api/discussion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/currentUser';
import { readJsonObject } from '../../../lib/requestBody';

const prisma = new PrismaClient();

export async function GET() {
  const discussions = await prisma.discussion.findMany({
    include: {
      author: {
        select: { username: true, email: true },
      },
      comments: {
        include: {
          author: {
            select: { username: true, email: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(discussions);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await readJsonObject<{ title?: unknown; content?: unknown }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { title, content } = body;
  if (
    typeof title !== 'string' ||
    !title.trim() ||
    typeof content !== 'string' ||
    !content.trim()
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const discussion = await prisma.discussion.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      authorId: user.id,
      pinned: false,
    },
    include: {
      author: {
        select: { username: true, email: true },
      },
    },
  });

  return NextResponse.json(
    { message: 'Discussion created', discussion },
    { status: 201 },
  );
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!user.isSuperuser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await readJsonObject<{
    id?: unknown;
    title?: unknown;
    content?: unknown;
    pinned?: unknown;
  }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { id, title, content, pinned } = body;
  if (
    typeof id !== 'number' ||
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof title !== 'string' ||
    !title.trim() ||
    typeof content !== 'string' ||
    !content.trim() ||
    typeof pinned !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const existing = await prisma.discussion.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }

  const discussion = await prisma.discussion.update({
    where: { id },
    data: { title: title.trim(), content: content.trim(), pinned },
  });

  return NextResponse.json({ message: 'Discussion updated', discussion });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!user.isSuperuser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await readJsonObject<{ id?: unknown }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { id } = body;
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
  }

  const existing = await prisma.discussion.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }

  // Delete all comments for this discussion first
  await prisma.comment.deleteMany({ where: { discussionId: id } });
  await prisma.discussion.delete({ where: { id } });
  return NextResponse.json({ message: 'Discussion deleted' });
}

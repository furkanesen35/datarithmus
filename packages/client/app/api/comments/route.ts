// packages/client/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '../../../lib/currentUser';
import { readJsonObject } from '../../../lib/requestBody';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const discussionId = searchParams.get('discussionId');

  if (!discussionId) {
    return NextResponse.json(
      { error: 'Discussion ID required' },
      { status: 400 },
    );
  }

  const comments = await prisma.comment.findMany({
    where: { discussionId: parseInt(discussionId) },
    include: {
      author: {
        select: { username: true, email: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await readJsonObject<{
    content?: unknown;
    discussionId?: unknown;
  }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { content, discussionId } = body;
  if (
    typeof content !== 'string' ||
    !content.trim() ||
    typeof discussionId !== 'number' ||
    !Number.isSafeInteger(discussionId) ||
    discussionId <= 0
  ) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    select: { id: true },
  });
  if (!discussion) {
    return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      authorId: user.id,
      discussionId,
    },
    include: {
      author: {
        select: { username: true, email: true },
      },
    },
  });

  return NextResponse.json(
    { message: 'Comment created', comment },
    { status: 201 },
  );
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await readJsonObject<{ id?: unknown }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const { id } = body;
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }
  if (comment.authorId !== user.id && !user.isSuperuser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ message: 'Comment deleted' });
}

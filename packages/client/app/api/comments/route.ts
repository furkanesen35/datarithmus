// packages/client/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
  const { content, authorId, discussionId } = await req.json();

  if (!content || !authorId || !discussionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: parseInt(authorId),
      discussionId: parseInt(discussionId),
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
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.comment.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Comment deleted' });
}

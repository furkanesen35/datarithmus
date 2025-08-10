// packages/client/app/api/discussion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
  const { title, content, authorId, pinned } = await req.json();
  if (!title || !content || !authorId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const discussion = await prisma.discussion.create({
    data: {
      title,
      content,
      authorId: parseInt(authorId),
      pinned: pinned || false,
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
  const { id, title, content, pinned, authorId } = await req.json();
  if (!id || !title || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Only update author if authorId is provided and valid
  const updateData: {
    title: string;
    content: string;
    pinned: boolean;
    authorId?: number;
  } = { title, content, pinned };
  if (authorId && !isNaN(parseInt(authorId))) {
    updateData.authorId = parseInt(authorId);
  }

  const discussion = await prisma.discussion.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return NextResponse.json({ message: 'Discussion updated', discussion });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  // Delete all comments for this discussion first
  await prisma.comment.deleteMany({ where: { discussionId: Number(id) } });
  await prisma.discussion.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Discussion deleted' });
}

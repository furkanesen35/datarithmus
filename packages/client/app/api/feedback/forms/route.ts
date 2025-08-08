// packages/client/app/api/feedback/forms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
  userId: number;
}

async function requireSuperuser(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
    ) as JwtPayload;
    if (!decoded.isSuperuser) {
      return NextResponse.json(
        { error: 'Superuser access required' },
        { status: 403 },
      );
    }
    return null;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// GET /api/feedback/forms - Get all feedback forms (admin only)
export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const forms = await prisma.feedbackForm.findMany({
    include: {
      questions: {
        include: {
          _count: {
            select: { responses: true }
          }
        }
      },
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(forms);
}

// POST /api/feedback/forms - Create new feedback form (admin only)
export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, questions } = await req.json();
  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: 'Title and questions array required' }, { status: 400 });
  }

  const form = await prisma.feedbackForm.create({
    data: {
      title,
      questions: {
        create: questions.map((q: string) => ({ question: q }))
      }
    },
    include: {
      questions: true
    }
  });

  return NextResponse.json(
    { message: 'Feedback form created', form },
    { status: 201 },
  );
}

// DELETE /api/feedback/forms - Delete feedback form (admin only)
export async function DELETE(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Form ID required' }, { status: 400 });
  }

  try {
    // Delete all responses first
    await prisma.feedbackResponse.deleteMany({
      where: { formId: Number(id) }
    });

    // Delete all questions
    await prisma.feedbackQuestion.deleteMany({
      where: { formId: Number(id) }
    });

    // Delete the form
    await prisma.feedbackForm.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ message: 'Feedback form deleted' });
  } catch (error) {
    console.error('Error deleting feedback form:', error);
    return NextResponse.json({ error: 'Failed to delete feedback form' }, { status: 500 });
  }
}

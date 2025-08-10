// packages/client/app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
  userId: number;
}

async function requireAuth(
  req: NextRequest,
): Promise<{ user: JwtPayload } | NextResponse> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret',
    ) as JwtPayload;
    return { user: decoded };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

async function requireSuperuser(
  req: NextRequest,
): Promise<NextResponse | null> {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  if (!authResult.user.isSuperuser) {
    return NextResponse.json(
      { error: 'Superuser access required' },
      { status: 403 },
    );
  }
  return null;
}

// GET /api/feedback - Get all feedback forms with questions and responses (admin only)
// GET /api/feedback?formId=X - Get specific form with questions and responses
export async function GET(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { searchParams } = new URL(req.url);
  const formId = searchParams.get('formId');

  if (formId) {
    const form = await prisma.feedbackForm.findUnique({
      where: { id: parseInt(formId) },
      include: {
        questions: {
          include: {
            responses: {
              include: {
                student: {
                  select: { username: true, email: true },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(form);
  }

  const forms = await prisma.feedbackForm.findMany({
    include: {
      questions: {
        include: {
          responses: {
            include: {
              student: {
                select: { username: true, email: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(forms);
}

// POST /api/feedback - Create new feedback form (admin only)
export async function POST(req: NextRequest) {
  const authCheck = await requireSuperuser(req);
  if (authCheck) return authCheck;

  const { title, questions } = await req.json();
  if (!title || !questions || !Array.isArray(questions)) {
    return NextResponse.json(
      { error: 'Title and questions array required' },
      { status: 400 },
    );
  }

  const form = await prisma.feedbackForm.create({
    data: {
      title,
      questions: {
        create: questions.map((q: string) => ({ question: q })),
      },
    },
    include: {
      questions: true,
    },
  });

  return NextResponse.json(
    { message: 'Feedback form created', form },
    { status: 201 },
  );
}

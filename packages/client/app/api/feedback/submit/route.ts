// packages/client/app/api/feedback/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
  userId: number;
}

async function requireAuth(req: NextRequest): Promise<{ user: JwtPayload } | NextResponse> {
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

// POST /api/feedback/submit - Submit feedback responses for a form
export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { formId, responses } = await req.json();
  if (!formId || !responses || !Array.isArray(responses)) {
    return NextResponse.json({ error: 'Form ID and responses array required' }, { status: 400 });
  }

  // Validate that the form exists
  const form = await prisma.feedbackForm.findUnique({
    where: { id: formId },
    include: { questions: true }
  });

  if (!form) {
    return NextResponse.json({ error: 'Feedback form not found' }, { status: 404 });
  }

  // Get user from database to ensure they exist
  const user = await prisma.user.findUnique({
    where: { email: authResult.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Validate responses format
  for (const response of responses) {
    if (!response.questionId || response.rating === undefined) {
      return NextResponse.json({ error: 'Each response must have questionId and rating' }, { status: 400 });
    }
    if (response.rating < 1 || response.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
  }

  try {
    // Delete existing responses for this user and form to allow resubmission
    await prisma.feedbackResponse.deleteMany({
      where: {
        studentId: user.id,
        formId: formId
      }
    });

    // Create new responses
    const createdResponses = await prisma.feedbackResponse.createMany({
      data: responses.map((response: { questionId: number; rating: number; comment?: string }) => ({
        questionId: response.questionId,
        studentId: user.id,
        formId: formId,
        rating: response.rating,
        comment: response.comment || null
      }))
    });

    return NextResponse.json(
      { message: 'Feedback submitted successfully', responses: createdResponses },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

// GET /api/feedback/submit?formId=X - Get user's existing responses for a form
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const formId = searchParams.get('formId');

  if (!formId) {
    return NextResponse.json({ error: 'Form ID required' }, { status: 400 });
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: authResult.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const responses = await prisma.feedbackResponse.findMany({
    where: {
      studentId: user.id,
      formId: parseInt(formId)
    },
    include: {
      question: true
    }
  });

  return NextResponse.json(responses);
}

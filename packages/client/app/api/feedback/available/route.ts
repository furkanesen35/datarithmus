// packages/client/app/api/feedback/available/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, type JwtPayload } from '../../../../lib/auth';

const prisma = new PrismaClient();

async function requireAuth(
  req: NextRequest,
): Promise<{ user: JwtPayload } | NextResponse> {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  try {
    const decoded = await verifyToken(token);
    return { user: decoded };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// GET /api/feedback/available - Get available feedback forms for students
export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: authResult.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const forms = await prisma.feedbackForm.findMany({
    include: {
      questions: true,
      responses: {
        where: { studentId: user.id },
        include: {
          question: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Add completion status to each form
  const formsWithStatus = forms.map((form) => ({
    ...form,
    isCompleted: form.responses.length === form.questions.length,
    userResponses: form.responses,
  }));

  return NextResponse.json(formsWithStatus);
}

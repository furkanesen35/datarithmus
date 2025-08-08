import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// POST /api/quiz-results
export async function POST(req: Request) {
  try {
    const { studentId, quizId, answers } = await req.json();
    if (!studentId || !quizId || !answers) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Fetch quiz and questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      const answer = answers[idx];
      if (answer !== undefined && answer === q.correctAnswer) {
        score++;
      }
    });

    // Save QuizResults
  const result = await prisma.quizResults.create({
      data: {
        studentId,
        quizId,
        answers,
        score,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/quiz-results?quizId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quizId = Number(searchParams.get('quizId'));
  if (!quizId) {
    return NextResponse.json({ error: 'Missing quizId.' }, { status: 400 });
  }
  try {
  const results = await prisma.quizResults.findMany({
      where: { quizId },
      include: { student: true, quiz: true },
    });
    return NextResponse.json({ results });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

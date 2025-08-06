// PATCH /api/enroll - update application status
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 });
  }
  try {
    await prisma.enrollmentApplication.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ message: 'Status updated.' });
  } catch {
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/enroll - create new application
export async function POST(req: NextRequest) {
  const { name, email, course, message } = await req.json();
  if (!name || !email || !course) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  try {
    await prisma.enrollmentApplication.create({
      data: { name, email, course, message },
    });
    return NextResponse.json({ message: 'Application submitted.' });
  } catch {
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}

// GET /api/enroll - get all applications (admin only)
export async function GET() {
  try {
    const applications = await prisma.enrollmentApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications.' }, { status: 500 });
  }
}

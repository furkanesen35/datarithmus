import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Create a new appointment request
export async function POST(req: NextRequest) {
  const { studentEmail, adminEmail, date, time, message } = await req.json();
  if (!studentEmail || !adminEmail || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const appointment = await prisma.appointmentRequest.create({
    data: {
      studentEmail,
      adminEmail,
      date,
      time,
      message,
      status: 'pending',
    },
  });
  return NextResponse.json(appointment);
}

// GET: List all appointment requests for a student (for dashboard)
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const studentEmail = url.searchParams.get('studentEmail');
  const adminEmail = url.searchParams.get('adminEmail');
  let where = {};
  if (studentEmail) {
    where = { studentEmail };
  } else if (adminEmail) {
    where = { adminEmail };
  } else {
    return NextResponse.json({ error: 'Missing studentEmail or adminEmail' }, { status: 400 });
  }
  const requests = await prisma.appointmentRequest.findMany({
    where,
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(requests);
}

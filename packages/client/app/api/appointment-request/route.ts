import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getCurrentUser } from '../../../lib/currentUser';
import { readJsonObject } from '../../../lib/requestBody';

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

// POST: Create a new appointment request
export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await readJsonObject<{
    adminEmail?: unknown;
    date?: unknown;
    time?: unknown;
    message?: unknown;
  }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { adminEmail, date, time, message } = body;
  if (
    typeof adminEmail !== 'string' ||
    !adminEmail.trim() ||
    typeof date !== 'string' ||
    !isValidDate(date) ||
    typeof time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
    (message !== undefined && typeof message !== 'string')
  ) {
    return NextResponse.json(
      { error: 'Invalid appointment request fields' },
      { status: 400 },
    );
  }

  const admin = await prisma.user.findUnique({
    where: { email: adminEmail.trim() },
    select: { isSuperuser: true },
  });
  if (!admin?.isSuperuser) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 400 });
  }

  const appointment = await prisma.appointmentRequest.create({
    data: {
      studentEmail: user.email,
      adminEmail: adminEmail.trim(),
      date,
      time,
      message: typeof message === 'string' && message.trim() ? message.trim() : null,
      status: 'pending',
    },
  });
  return NextResponse.json(appointment);
}

// GET: List all appointment requests for a student (for dashboard)
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const studentEmail = url.searchParams.get('studentEmail');
  const adminEmail = url.searchParams.get('adminEmail');

  if (studentEmail && adminEmail) {
    return NextResponse.json(
      { error: 'Choose one appointment owner filter' },
      { status: 400 },
    );
  }

  let where: { studentEmail?: string; adminEmail?: string };
  if (studentEmail) {
    if (studentEmail !== user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    where = { studentEmail: user.email };
  } else if (adminEmail) {
    if (!user.isSuperuser || adminEmail !== user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    where = { adminEmail: user.email };
  } else {
    return NextResponse.json(
      { error: 'Missing studentEmail or adminEmail' },
      { status: 400 },
    );
  }
  const requests = await prisma.appointmentRequest.findMany({
    where,
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(requests);
}

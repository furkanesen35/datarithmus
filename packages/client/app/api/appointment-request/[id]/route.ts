import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getCurrentUser } from '../../../../lib/currentUser';
import { readJsonObject } from '../../../../lib/requestBody';

// PATCH /api/appointment-request/[id]
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (!user.isSuperuser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const idSegment = req.nextUrl.pathname.split('/').pop();
  const id = Number(idSegment);
  if (!idSegment || !/^[1-9]\d*$/.test(idSegment) || !Number.isSafeInteger(id)) {
    return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 });
  }

  const body = await readJsonObject<{ status?: unknown }>(req);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (body.status !== 'approved' && body.status !== 'rejected') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const appointment = await prisma.appointmentRequest.findUnique({
    where: { id },
    select: { adminEmail: true },
  });
  if (!appointment || appointment.adminEmail !== user.email) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  const updated = await prisma.appointmentRequest.update({
    where: { id },
    data: { status: body.status },
  });
  return NextResponse.json(updated);
}

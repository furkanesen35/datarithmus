import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// PATCH /api/appointment-request/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const id = Number(params.id);
  const updated = await prisma.appointmentRequest.update({
    where: { id },
    data: { status },
  });
  // TODO: Optionally send Calendly link to student if approved
  return NextResponse.json(updated);
}

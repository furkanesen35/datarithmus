import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// PATCH /api/appointment-request/[id]
export async function PATCH(req: NextRequest) {
  const { status } = await req.json();
  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const id = Number(req.nextUrl.pathname.split('/').pop());
  const updated = await prisma.appointmentRequest.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(updated);
}

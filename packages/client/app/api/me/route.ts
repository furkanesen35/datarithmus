import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  try {
    const decoded = await verifyToken(token);
    // Fetch user id from database
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, email: true, isSuperuser: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      email: user.email,
      isSuperuser: user.isSuperuser,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

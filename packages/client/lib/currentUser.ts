import { NextRequest } from 'next/server';
import prisma from './prisma';
import { verifyToken } from './auth';

export async function getCurrentUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  let decoded;
  try {
    decoded = await verifyToken(token);
  } catch {
    return null;
  }

  return prisma.user.findUnique({
    where: { email: decoded.email },
    select: { id: true, email: true, isSuperuser: true },
  });
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get basic user info for scheduling purposes (no sensitive data)
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        isSuperuser: false, // Only return regular users for scheduling
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
      orderBy: { username: 'asc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

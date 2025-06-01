// Simple middleware to check for superuser status in API routes
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/authOptions';

interface SuperuserSessionUser {
  isSuperuser: boolean;
  email?: string;
  name?: string;
  // Add more known properties as needed
}

export async function requireSuperuser() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SuperuserSessionUser | undefined;
  if (!user || !user.isSuperuser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return null; // null means authorized
}

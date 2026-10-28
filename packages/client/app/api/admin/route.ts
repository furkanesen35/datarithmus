// packages/client/app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    if (!decoded.isSuperuser) {
      return NextResponse.json(
        { error: 'Superuser access required' },
        { status: 403 },
      );
    }
    return NextResponse.json({ message: 'Admin data' });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

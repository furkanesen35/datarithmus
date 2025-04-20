import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json(); // Google ID token from client

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    const { email, sub: googleId } = payload;

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Register new user
      user = await prisma.user.create({
        data: {
          email,
          password: '', // No password for Google users
          isSuperuser: false, // Default to non-superuser
        },
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { email: user.email, isSuperuser: user.isSuperuser },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token: jwtToken, email: user.email, isSuperuser: user.isSuperuser });
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
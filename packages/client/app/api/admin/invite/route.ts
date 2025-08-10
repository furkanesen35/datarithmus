import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/mail';
import { getBaseUrl } from '../../../utils/baseUrl';

const prisma = new PrismaClient();

// POST /api/admin/invite { email, username }
export async function POST(req: NextRequest) {
  const { email, username } = await req.json();
  if (!email || !username)
    return NextResponse.json(
      { error: 'Email and username required' },
      { status: 400 },
    );
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  // Generate a random initial password
  const password = crypto.randomBytes(12).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user (active but must change password)
  await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      isSuperuser: false,
      isActive: true,
      mustChangePassword: true,
    },
  });
  
  try {
    await sendMail({
      to: email,
      subject: "You're invited to Datarithmus!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #2563eb;">You've been invited!</h2>
          <p>An admin has created an account for you. Your initial password is:</p>
          <div style="font-size: 1.2em; font-weight: bold; margin: 12px 0; padding: 12px; background: #e5e7eb; border-radius: 4px;">${password}</div>
          <p>You can now log in and will be prompted to create your own password.</p>
          <a href="${getBaseUrl()}/auth/login" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Login Now</a>
          <p>If you did not expect this invitation, please contact support.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
        </div>
      `,
    });
    return NextResponse.json({ message: 'Invitation sent!' });
  } catch (mailError) {
    console.error('Invite email error:', mailError);
    return NextResponse.json(
      { error: 'Could not send invitation email.' },
      { status: 500 },
    );
  }
}

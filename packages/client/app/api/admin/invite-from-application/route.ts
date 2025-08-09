import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/mail';
import { getBaseUrl } from '../../../utils/baseUrl';

const prisma = new PrismaClient();

// POST /api/admin/invite-from-application { id }
export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing application id.' }, { status: 400 });

  const app = await prisma.enrollmentApplication.findUnique({ where: { id } });
  if (!app) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  if (app.status !== 'pending') return NextResponse.json({ error: 'Application not pending.' }, { status: 400 });

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email: app.email } });
  if (existing) return NextResponse.json({ error: 'User already exists.' }, { status: 400 });

  // Generate password and token
  const tempPassword = crypto.randomBytes(8).toString('hex');
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

  // Create user (inactive)
  const user = await prisma.user.create({
    data: {
      email: app.email,
      username: app.name,
      password: hashedPassword,
      isSuperuser: false,
      isActive: false,
    },
  });
  await prisma.emailVerificationToken.create({
    data: { userId: user.id, token, tempPassword, expiresAt },
  });
  await prisma.enrollmentApplication.update({
    where: { id },
    data: { status: 'approved' },
  });
  const verifyUrl = `${getBaseUrl()}/auth/verify-email?token=${token}`;
  try {
    await sendMail({
      to: app.email,
      subject: "You're invited to Datarithmus!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #2563eb;">You've been invited!</h2>
          <p>An admin has approved your application. Your temporary password is:</p>
          <div style="font-size: 1.2em; font-weight: bold; margin: 12px 0;">${tempPassword}</div>
          <p>Please verify your email and set your own password by clicking the button below:</p>
          <a href="${verifyUrl}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Verify Email</a>
          <p>If you did not expect this invitation, you can ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
        </div>
      `,
    });
    return NextResponse.json({ message: 'Invitation sent!' });
  } catch {
    return NextResponse.json({ error: 'Could not send invitation email.' }, { status: 500 });
  }
}

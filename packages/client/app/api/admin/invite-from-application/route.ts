import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '../../../../lib/mail';

const prisma = new PrismaClient();

// POST /api/admin/invite-from-application { id }
export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json(
      { error: 'Missing application id.' },
      { status: 400 },
    );

  const app = await prisma.enrollmentApplication.findUnique({ where: { id } });
  if (!app)
    return NextResponse.json(
      { error: 'Application not found.' },
      { status: 404 },
    );
  if (app.status !== 'pending')
    return NextResponse.json(
      { error: 'Application not pending.' },
      { status: 400 },
    );

  // Check if user already exists
  const existing = await prisma.user.findUnique({
    where: { email: app.email },
  });
  if (existing)
    return NextResponse.json(
      { error: 'User already exists.' },
      { status: 400 },
    );

  // Create user (active, no verification needed since they were met face-to-face)
  const password = crypto.randomBytes(12).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email: app.email,
      username: app.name,
      password: hashedPassword,
      isSuperuser: false,
      isActive: true,
      mustChangePassword: true,
    },
  });
  await prisma.enrollmentApplication.update({
    where: { id },
    data: { status: 'approved' },
  });

  // Send invitation mail with initial password
  try {
    await sendMail({
      to: app.email,
      subject: "You're invited to Datarithmus!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #2563eb;">You've been accepted!</h2>
          <p>Congratulations! You have been accepted to Datarithmus. Your initial password is:</p>
          <div style="font-size: 1.2em; font-weight: bold; margin: 12px 0;">${password}</div>
          <p>Please log in and change your password during onboarding.</p>
          <p>If you did not expect this invitation, you can ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
        </div>
      `,
    });
    return NextResponse.json({ message: 'Invitation sent!' });
  } catch {
    return NextResponse.json(
      { error: 'Could not send invitation email.' },
      { status: 500 },
    );
  }
}

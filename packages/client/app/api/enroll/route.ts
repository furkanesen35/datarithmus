// PATCH /api/enroll - update application status
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status.' }, { status: 400 });
  }
  try {
    await prisma.enrollmentApplication.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ message: 'Status updated.' });
  } catch {
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '../../../lib/mail';

const prisma = new PrismaClient();

// POST /api/enroll - create new application
export async function POST(req: NextRequest) {
  const { name, email, course, message } = await req.json();
  if (!name || !email || !course) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  try {
    await prisma.enrollmentApplication.create({
      data: { name, email, course, message },
    });

    // Send Google Meet invitation email
    const googleMeetLink = process.env.GOOGLE_MEET_LINK || 'https://meet.google.com/aga-zrqj-skt';
    const meetingDate = 'September 30, 2025';
    const meetingTime = '09:00-10:00 PM';
    
    try {
      await sendMail({
        to: email,
        subject: "Datarithmus Application - Online Meeting Invitation",
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
            <h2 style="color: #2563eb;">Application Received</h2>
            <p>Dear Mr./Mrs. ${name},</p>
            <p>We have received your application for the <strong>${course}</strong> program. For the next step, you are invited to an online meeting that takes place on <strong>${meetingDate}</strong> at <strong>${meetingTime}</strong>.</p>
            <p>Please join the meeting using the link below:</p>
            <a href="${googleMeetLink}" style="display: inline-block; margin: 16px 0; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Join Google Meet</a>
            <p>We look forward to meeting you there.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <small style="color: #888;">&copy; ${new Date().getFullYear()} Datarithmus</small>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send Google Meet invitation:', emailError);
      // Application is still created even if email fails
    }

    return NextResponse.json({ message: 'Application submitted.' });
  } catch {
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 });
  }
}

// GET /api/enroll - get all applications (admin only)
export async function GET() {
  try {
    const applications = await prisma.enrollmentApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(applications);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications.' }, { status: 500 });
  }
}

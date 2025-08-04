import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateGoogleMeetLink } from '../../../lib/googleMeet';
import { sendMail } from '../../../lib/mail';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(schedules);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, start, end, description, participants } = await req.json();
    if (!title || !start || !end) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    const participantEmails = [];
    if (
      participants &&
      Array.isArray(participants) &&
      participants.length > 0
    ) {
      for (const participantId of participants) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(participantId) },
          select: { email: true },
        });
        if (user?.email) participantEmails.push(user.email);
      }
    }
    let googleMeetLink = '';
    try {
      const googleAccessToken =
        req.cookies.get('google_access_token')?.value || '';
      const meetResult = await generateGoogleMeetLink({
        title,
        start: startDate,
        end: endDate,
        description,
        participants: participantEmails,
        userAccessToken: googleAccessToken,
      });
      if (meetResult.success && meetResult.meetLink) {
        googleMeetLink = meetResult.meetLink;
      }
    } catch {}
    const schedule = await prisma.schedule.create({
      data: {
        title,
        start: startDate,
        end: endDate,
        description,
        googleMeetLink,
      },
    });
    if (
      participants &&
      Array.isArray(participants) &&
      participants.length > 0
    ) {
      for (const participantId of participants) {
        await prisma.meetingParticipant.create({
          data: {
            scheduleId: schedule.id,
            userId: parseInt(participantId),
          },
        });
      }
    }
    if (participantEmails.length > 0) {
      const emailSubject = `Meeting Scheduled: ${title}`;
      const emailBody = `You have been invited to a meeting:<br>Title: ${title}<br>Start: ${startDate.toLocaleString()}<br>End: ${endDate.toLocaleString()}<br>${description ? `Description: ${description}<br>` : ''}${googleMeetLink ? `Google Meet Link: <a href='${googleMeetLink}'>${googleMeetLink}</a>` : ''}`;
      for (const email of participantEmails) {
        await sendMail({ to: email, subject: emailSubject, html: emailBody });
      }
    }
    return NextResponse.json({ success: true, schedule });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('PUT /api/schedule body:', body);
    const { id, title, start, end, description, participants } = body;
    if (!id || !title || !start || !end) {
      console.log('PUT /api/schedule missing fields:', {
        id,
        title,
        start,
        end,
      });
      return NextResponse.json(
        {
          error: 'Missing required fields',
          received: { id, title, start, end },
        },
        { status: 400 },
      );
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    const participantEmails = [];
    if (
      participants &&
      Array.isArray(participants) &&
      participants.length > 0
    ) {
      for (const participantId of participants) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(participantId) },
          select: { email: true },
        });
        if (user?.email) participantEmails.push(user.email);
      }
    }
    let googleMeetLink = '';
    try {
      const googleAccessToken =
        req.cookies.get('google_access_token')?.value || '';
      const meetResult = await generateGoogleMeetLink({
        title,
        start: startDate,
        end: endDate,
        description,
        participants: participantEmails,
        userAccessToken: googleAccessToken,
      });
      if (meetResult.success && meetResult.meetLink) {
        googleMeetLink = meetResult.meetLink;
      }
    } catch {}
    // Update schedule
    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        title,
        start: startDate,
        end: endDate,
        description,
        googleMeetLink,
      },
    });
    // Update participants: remove all, then add new
    await prisma.meetingParticipant.deleteMany({
      where: { scheduleId: parseInt(id) },
    });
    if (
      participants &&
      Array.isArray(participants) &&
      participants.length > 0
    ) {
      for (const participantId of participants) {
        await prisma.meetingParticipant.create({
          data: {
            scheduleId: schedule.id,
            userId: parseInt(participantId),
          },
        });
      }
    }
    if (participantEmails.length > 0) {
      const emailSubject = `Meeting Updated: ${title}`;
      const emailBody = `Your meeting has been updated:<br>Title: ${title}<br>Start: ${startDate.toLocaleString()}<br>End: ${endDate.toLocaleString()}<br>${description ? `Description: ${description}<br>` : ''}${googleMeetLink ? `Google Meet Link: <a href='${googleMeetLink}'>${googleMeetLink}</a>` : ''}`;
      for (const email of participantEmails) {
        await sendMail({ to: email, subject: emailSubject, html: emailBody });
      }
    }
    return NextResponse.json({ success: true, schedule });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let id: string | undefined;
    // Try to get id from query param first
    const url = new URL(req.url);
    id = url.searchParams.get('id') || undefined;
    // If not found, try to get from body (for fetch with body)
    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }
    if (!id) {
      return NextResponse.json(
        { error: 'Missing schedule ID' },
        { status: 400 },
      );
    }
    await prisma.meetingParticipant.deleteMany({
      where: { scheduleId: parseInt(id) },
    });
    await prisma.schedule.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 },
    );
  }
}

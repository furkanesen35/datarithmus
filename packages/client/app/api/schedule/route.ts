// packages/client/app/api/schedule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateGoogleMeetLink } from '../../../lib/googleMeet';
import { sendMail } from '../../../lib/mail';

const prisma = new PrismaClient();

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  // Transform data to match FullCalendar format
  const transformedSchedules = schedules.map(schedule => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: schedule.date.toISOString(),
    end: schedule.date.toISOString(), // For now, same as start
    userId: schedule.userId?.toString(),
    googleMeetLink: schedule.googleMeetLink,
    extendedProps: {
      time: schedule.time,
      description: schedule.description,
      googleMeetLink: schedule.googleMeetLink,
      userId: schedule.userId,
    }
  }));
  
  return NextResponse.json(transformedSchedules);
}

export async function POST(req: NextRequest) {
  try {
    const { title, date, time, description, userId } = await req.json();
    if (!title || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate Google Meet link
    const googleMeetLink = generateGoogleMeetLink();

    // Create the schedule in database
    const schedule = await prisma.schedule.create({
      data: { 
        title, 
        date: new Date(date), 
        time, 
        description,
        userId: userId ? parseInt(userId) : null,
        googleMeetLink,
      },
    });

    // Get user details for email if userId is provided
    let user = null;
    if (userId) {
      try {
        user = await prisma.user.findUnique({
          where: { id: parseInt(userId) },
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    // Send email invitation if user is found
    if (user && user.email) {
      try {
        const inviteData = {
          title: schedule.title,
          date: schedule.date,
          time: schedule.time,
          googleMeetLink: schedule.googleMeetLink || '',
          organizerEmail: process.env.ADMIN_EMAIL || 'admin@datarithmus.com',
          organizerName: 'Datarithmus Admin',
          participantEmail: user.email,
          participantName: user.username,
          description: schedule.description || undefined,
        };

        // Send email invitation
        console.log('📧 Meeting Invitation Created:');
        console.log('To:', user.email);
        console.log('Subject: Meeting Invitation -', schedule.title);
        
        // Send actual email
        try {
          await sendMail({
            to: user.email,
            subject: `Meeting Invitation - ${schedule.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>📅 MEETING INVITATION</h2>
                <p>Hello ${user.username},</p>
                <p>You have been invited to a meeting by Datarithmus Admin.</p>
                
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p><strong>📋 Title:</strong> ${schedule.title}</p>
                  <p><strong>📅 Date:</strong> ${inviteData.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>🕒 Time:</strong> ${schedule.time}</p>
                  ${schedule.description ? `<p><strong>Description:</strong> ${schedule.description}</p>` : ''}
                </div>
                
                <p>
                  <a href="${schedule.googleMeetLink}" style="background-color: #4285f4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    🎥 Join Google Meet
                  </a>
                </p>
                
                <p>Looking forward to meeting with you!</p>
                <p>Best regards,<br>Datarithmus Admin</p>
              </div>
            `
          });
          console.log('✅ Email sent successfully to:', user.email);
        } catch (emailSendError) {
          console.error('❌ Failed to send email:', emailSendError);
          // Don't fail the meeting creation if email fails
        }
        
      } catch (emailError) {
        console.error('Error sending email invitation:', emailError);
      }
    }

    return NextResponse.json(
      { 
        message: 'Schedule created successfully', 
        schedule: {
          ...schedule,
          googleMeetLink: schedule.googleMeetLink,
        }
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, title, date, time, description } = await req.json();
  if (!id || !title || !date || !time) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const schedule = await prisma.schedule.update({
    where: { id: Number(id) },
    data: { title, date: new Date(date), time, description },
  });

  return NextResponse.json({ message: 'Schedule updated', schedule });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  await prisma.schedule.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Schedule deleted' });
}

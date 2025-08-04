import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateGoogleMeetLink } from '../../../lib/googleMeet';

export async function POST(req: NextRequest) {
  try {
    // Parse request body for event details
    const { summary, description, start, end, attendees } = await req.json();

    // Get Google access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('google_access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google access token not found.' },
        { status: 401 },
      );
    }

    // Map parameters for generateGoogleMeetLink
    const result = await generateGoogleMeetLink({
      title: summary,
      description,
      start: new Date(start),
      end: new Date(end),
      participants: attendees,
      userAccessToken: accessToken,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate Meet link.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ meetLink: result.meetLink });
  } catch (error) {
    let message = 'Internal server error.';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

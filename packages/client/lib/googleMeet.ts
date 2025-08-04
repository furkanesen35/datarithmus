import fetch from 'node-fetch';

// Temporary stub for Google Meet link generation
export async function generateGoogleMeetLink({
  title,
  start,
  end,
  description,
  participants = [],
  userAccessToken,
}: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  participants?: string[];
  userAccessToken: string;
}) {
  if (!userAccessToken) {
    console.error('Google Meet: Missing Google access token');
    return { success: false, error: 'Missing Google access token' };
  }

  const event = {
    summary: title,
    description: description || '',
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    attendees: participants.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Meet: Calendar API error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log(
      'Google Meet: Calendar API response:',
      JSON.stringify(data, null, 2),
    );
    type EntryPoint = { entryPointType: string; uri: string };
    const entryPoints: EntryPoint[] | undefined =
      data.conferenceData?.entryPoints;
    const meetLink = entryPoints?.find(
      (ep) => ep.entryPointType === 'video',
    )?.uri;
    if (!meetLink) {
      console.warn(
        'Google Meet: No Meet link found in event response:',
        JSON.stringify(data, null, 2),
      );
    }
    return { success: true, meetLink };
  } catch (err) {
    console.error('Google Meet: Unexpected error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function exchangeCodeForTokens(code: string) {
  const params = new URLSearchParams();
  params.append('code', code);
  params.append('client_id', process.env.GOOGLE_CLIENT_ID || '');
  params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET || '');
  params.append('redirect_uri', process.env.GOOGLE_REDIRECT_URI || '');
  params.append('grant_type', 'authorization_code');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  return await response.json();
}

export function getGoogleAuthURL(id: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/meetings.space.created',
      'openid',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: id,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

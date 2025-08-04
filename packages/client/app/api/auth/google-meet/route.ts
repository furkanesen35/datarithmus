// packages/client/app/api/auth/google-meet/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthURL } from '../../../../lib/googleMeet';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 },
      );
    }
    const authUrl = getGoogleAuthURL(id);
    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate auth URL' },
      { status: 500 },
    );
  }
}

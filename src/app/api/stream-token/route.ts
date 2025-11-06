import { NextRequest, NextResponse } from 'next/server';
import { generateUserToken } from '@/lib/getstream';

interface TokenRequest {
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: TokenRequest = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Generate token with 24 hour expiry
    const token = await generateUserToken(userId, 86400);

    return NextResponse.json({
      token,
      userId,
      apiKey: process.env.NEXT_PUBLIC_GETSTREAM_API_KEY,
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
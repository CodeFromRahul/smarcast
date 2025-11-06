'use server';

import {
  createWebinar,
  generateUserToken,
  type WebinarCreatePayload,
} from '@/lib/getstream';

export interface CreateWebinarInput {
  webinarId: string;
  title: string;
  description?: string;
  userId: string;
  startsAt?: string;
}

export interface CreateWebinarResult {
  success: boolean;
  callId: string;
  token: string;
  joinUrl: string;
  error?: string;
}

export async function createWebinarAction(
  input: CreateWebinarInput
): Promise<CreateWebinarResult> {
  try {
    // Check if GetStream is configured
    if (!process.env.NEXT_PUBLIC_GETSTREAM_API_KEY || !process.env.GETSTREAM_API_SECRET) {
      return {
        success: false,
        callId: '',
        token: '',
        joinUrl: '',
        error: 'GetStream API credentials not configured. Please add NEXT_PUBLIC_GETSTREAM_API_KEY and GETSTREAM_API_SECRET to your .env file.',
      };
    }

    // Validate input
    if (!input.webinarId || !input.userId) {
      return {
        success: false,
        callId: '',
        token: '',
        joinUrl: '',
        error: 'Missing required fields',
      };
    }

    // Create webinar on GetStream
    const payload: WebinarCreatePayload = {
      id: input.webinarId,
      title: input.title,
      description: input.description,
      created_by_user_id: input.userId,
      starts_at: input.startsAt,
    };

    const webinarResponse = await createWebinar(payload);

    if (!webinarResponse?.call?.id) {
      throw new Error('Failed to create webinar');
    }

    // Generate token for the user
    const token = await generateUserToken(input.userId, 86400); // 24 hours

    // Construct join URL
    const joinUrl = `/webinar/${webinarResponse.call.id}`;

    return {
      success: true,
      callId: webinarResponse.call.id,
      token,
      joinUrl,
    };
  } catch (error) {
    console.error('Error creating webinar:', error);
    return {
      success: false,
      callId: '',
      token: '',
      joinUrl: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
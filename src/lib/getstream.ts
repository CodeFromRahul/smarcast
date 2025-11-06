import { StreamClient } from '@stream-io/node-sdk';
import { SignJWT } from 'jose';

const API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY!;
const API_SECRET = process.env.GETSTREAM_API_SECRET!;

// Initialize Stream client
let client: StreamClient | null = null;

function getStreamClient(): StreamClient {
  if (!client) {
    if (!API_KEY || !API_SECRET) {
      throw new Error('GetStream credentials not configured. Please set NEXT_PUBLIC_GETSTREAM_API_KEY and GETSTREAM_API_SECRET in your .env file.');
    }
    
    // Correct initialization with object parameter
    client = new StreamClient({
      apiKey: API_KEY,
      apiSecret: API_SECRET,
    });
  }
  return client;
}

export interface WebinarCreatePayload {
  id: string;
  title?: string;
  description?: string;
  created_by_user_id: string;
  starts_at?: string;
}

export interface WebinarResponse {
  call: {
    id: string;
    type: string;
    created_at: string;
    updated_at: string;
    created_by: {
      id: string;
      name?: string;
    };
  };
}

// Generate JWT token for user using jose library
export async function generateUserToken(userId: string, expiresIn: number = 7200): Promise<string> {
  try {
    if (!API_SECRET) {
      throw new Error('GETSTREAM_API_SECRET is not configured');
    }

    const secret = new TextEncoder().encode(API_SECRET);
    const issuedAt = Math.floor(Date.now() / 1000);
    const expirationTime = issuedAt + expiresIn;

    const token = await new SignJWT({
      user_id: userId,
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer('stream-sdk')
      .setIssuedAt(issuedAt)
      .setExpirationTime(expirationTime)
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Failed to generate user token:', error);
    throw error;
  }
}

// Create webinar/livestream call using SDK call.getOrCreate()
export async function createWebinar(
  payload: WebinarCreatePayload
): Promise<WebinarResponse> {
  try {
    const streamClient = getStreamClient();
    
    const callType = 'livestream';
    const callId = payload.id;

    // Create call object
    const call = streamClient.video.call(callType, callId);

    // Use getOrCreate to create or fetch existing call
    const response = await call.getOrCreate({
      data: {
        created_by_id: payload.created_by_user_id,
        custom: {
          title: payload.title || 'Untitled Webinar',
          description: payload.description || '',
        },
        starts_at: payload.starts_at,
        settings_override: {
          backstage: {
            enabled: true,
          },
          broadcasting: {
            enabled: true,
            hls: {
              auto_on: false,
            },
          },
          recording: {
            mode: 'available',
            quality: 'high',
          },
        },
      },
    });

    return {
      call: {
        id: response.call.id,
        type: response.call.type,
        created_at: response.call.created_at,
        updated_at: response.call.updated_at,
        created_by: response.call.created_by,
      },
    };
  } catch (error: any) {
    console.error('Failed to create webinar:', error);
    throw error;
  }
}

// Get existing webinar call
export async function getWebinar(callId: string): Promise<WebinarResponse> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    const call = streamClient.video.call(callType, callId);
    const response = await call.get();

    return {
      call: {
        id: response.call.id,
        type: response.call.type,
        created_at: response.call.created_at,
        updated_at: response.call.updated_at,
        created_by: response.call.created_by,
      },
    };
  } catch (error) {
    console.error('Failed to get webinar:', error);
    throw error;
  }
}

// Start webinar (go live from backstage)
export async function startWebinar(
  callId: string
): Promise<void> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    const call = streamClient.video.call(callType, callId);
    await call.goLive();
  } catch (error) {
    console.error('Failed to start webinar:', error);
    throw error;
  }
}

// Stop webinar
export async function stopWebinar(
  callId: string
): Promise<void> {
  try {
    const streamClient = getStreamClient();
    const callType = 'livestream';

    const call = streamClient.video.call(callType, callId);
    await call.stopLive();
  } catch (error) {
    console.error('Failed to stop webinar:', error);
    throw error;
  }
}
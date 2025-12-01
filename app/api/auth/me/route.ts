import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/discord';
import { AuthUser } from '@/lib/types/auth.types';

interface SessionData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * GET /api/auth/me
 * 
 * Returns the current authenticated user's information
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }
    
    // Decode session
    const sessionData: SessionData = JSON.parse(
      Buffer.from(sessionCookie, 'base64').toString('utf-8')
    );
    
    // Check if session is expired
    if (Date.now() > sessionData.expiresAt) {
      // TODO: Implement token refresh
      const response = NextResponse.json({ user: null, error: 'Session expired' });
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
    
    return NextResponse.json({ user: sessionData.user });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ user: null, error: 'Invalid session' });
  }
}

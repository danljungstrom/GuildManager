import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/discord';

/**
 * POST /api/auth/logout
 * 
 * Logs out the user by clearing the auth session cookie
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear the auth session cookie
  response.cookies.delete(AUTH_COOKIE_NAME);
  
  return response;
}

/**
 * GET /api/auth/logout
 * 
 * Alternative GET endpoint that redirects after logout
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear the auth session cookie
  response.cookies.delete(AUTH_COOKIE_NAME);
  
  return response;
}

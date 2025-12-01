import { NextRequest, NextResponse } from 'next/server';
import { getDiscordAuthUrl } from '@/lib/auth/discord';

/**
 * GET /api/auth/discord
 * 
 * Initiates Discord OAuth flow by redirecting to Discord's authorization page
 */
export async function GET(request: NextRequest) {
  try {
    // Get the base URL for redirect
    const baseUrl = request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/discord/callback`;
    
    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();
    
    // Get the Discord auth URL
    const authUrl = getDiscordAuthUrl(redirectUri, state);
    
    // Create response with redirect
    const response = NextResponse.redirect(authUrl);
    
    // Store state in cookie for verification
    response.cookies.set('discord_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Discord auth error:', error);
    return NextResponse.redirect(
      new URL('/?error=discord_auth_failed', request.url)
    );
  }
}

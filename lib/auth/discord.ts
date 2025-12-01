/**
 * Discord OAuth Constants
 */

export const DISCORD_API_BASE = 'https://discord.com/api/v10';

export const DISCORD_OAUTH_URL = 'https://discord.com/api/oauth2/authorize';

export const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';

// OAuth scopes we need
export const DISCORD_SCOPES = [
  'identify',        // Get user info
  'email',           // Get user email
  'guilds',          // List user's guilds
  'guilds.members.read', // Get user's roles in guilds
].join(' ');

// Cookie name for storing auth session
export const AUTH_COOKIE_NAME = 'gm_auth_session';

// Session expiry (7 days)
export const SESSION_EXPIRY_DAYS = 7;

/**
 * Get Discord OAuth URL for authorization
 */
export function getDiscordAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_DISCORD_CLIENT_ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: DISCORD_SCOPES,
  });

  if (state) {
    params.append('state', state);
  }

  return `${DISCORD_OAUTH_URL}?${params.toString()}`;
}

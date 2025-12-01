import { NextRequest, NextResponse } from 'next/server';
import { 
  DISCORD_API_BASE, 
  DISCORD_TOKEN_URL, 
  AUTH_COOKIE_NAME,
  SESSION_EXPIRY_DAYS 
} from '@/lib/auth/discord';
import { 
  DiscordUser, 
  DiscordGuildMember, 
  AuthUser, 
  PermissionLevel,
  DiscordTokens,
  RoleMapping,
} from '@/lib/types/auth.types';
import { getGuildConfig } from '@/lib/services/guild-config.service';

/**
 * GET /api/auth/discord/callback
 * 
 * Handles the OAuth callback from Discord after user authorization
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Check for errors from Discord
    if (error) {
      console.error('Discord OAuth error:', error);
      return NextResponse.redirect(
        new URL('/?error=discord_denied', request.url)
      );
    }
    
    // Verify code exists
    if (!code) {
      return NextResponse.redirect(
        new URL('/?error=no_code', request.url)
      );
    }
    
    // Verify state matches (CSRF protection)
    const storedState = request.cookies.get('discord_oauth_state')?.value;
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL('/?error=invalid_state', request.url)
      );
    }
    
    // Exchange code for tokens
    const baseUrl = request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/discord/callback`;
    
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    
    // Get user info from Discord
    const discordUser = await getDiscordUser(tokens.access_token);
    
    // Get user's guild membership and roles
    const { permissionLevel, roles } = await getUserPermissions(
      tokens.access_token,
      discordUser.id
    );
    
    // Create auth user object
    const authUser: AuthUser = {
      id: discordUser.id,
      discordUsername: discordUser.username,
      displayName: discordUser.global_name || discordUser.username,
      avatar: discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : undefined,
      permissionLevel,
      roles,
      lastUpdated: new Date().toISOString(),
    };
    
    // Create session token (simple base64 encoding for now)
    // TODO: Use proper JWT or encrypted session
    const sessionData = JSON.stringify({
      user: authUser,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });
    const sessionToken = Buffer.from(sessionData).toString('base64');
    
    // Redirect to home with session cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set auth session cookie
    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * SESSION_EXPIRY_DAYS,
      path: '/',
    });
    
    // Clear the OAuth state cookie
    response.cookies.delete('discord_oauth_state');
    
    return response;
  } catch (error) {
    console.error('Discord callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=callback_failed', request.url)
    );
  }
}

/**
 * Exchange authorization code for access tokens
 */
async function exchangeCodeForTokens(
  code: string, 
  redirectUri: string
): Promise<DiscordTokens> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Discord OAuth credentials not configured');
  }
  
  const response = await fetch(DISCORD_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }
  
  return response.json();
}

/**
 * Get Discord user information
 */
async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get Discord user');
  }
  
  return response.json();
}

/**
 * Get user's permissions based on their Discord roles
 */
async function getUserPermissions(
  accessToken: string,
  userId: string
): Promise<{ permissionLevel: PermissionLevel; roles: string[] }> {
  const configuredGuildId = process.env.DISCORD_GUILD_ID;
  
  if (!configuredGuildId) {
    // No guild configured, default to viewer
    return { permissionLevel: PermissionLevel.VIEWER, roles: [] };
  }
  
  try {
    // Load guild config to get owner ID and role mappings
    const guildConfig = await getGuildConfig();
    
    // Check if user is the site owner (SuperAdmin)
    if (guildConfig?.discord?.ownerId === userId) {
      // Owner always has SuperAdmin, get their roles for display
      const response = await fetch(
        `${DISCORD_API_BASE}/users/@me/guilds/${configuredGuildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      const roles = response.ok 
        ? (await response.json() as DiscordGuildMember).roles 
        : [];
      
      return { 
        permissionLevel: PermissionLevel.SUPERADMIN, 
        roles 
      };
    }
    
    // Get user's member info in the configured guild
    const response = await fetch(
      `${DISCORD_API_BASE}/users/@me/guilds/${configuredGuildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      // User is not in the guild
      return { permissionLevel: PermissionLevel.VIEWER, roles: [] };
    }
    
    const member: DiscordGuildMember = await response.json();
    
    // Determine permission level from role mappings
    const roleMappings = guildConfig?.discord?.roleMappings || [];
    let highestPermission = PermissionLevel.MEMBER; // Default for guild members
    
    for (const userRoleId of member.roles) {
      const mapping = roleMappings.find(
        (m: RoleMapping) => m.discordRoleId === userRoleId
      );
      if (mapping && mapping.permissionLevel > highestPermission) {
        highestPermission = mapping.permissionLevel;
      }
    }
    
    return { 
      permissionLevel: highestPermission, 
      roles: member.roles 
    };
  } catch (error) {
    console.error('Error getting guild member:', error);
    return { permissionLevel: PermissionLevel.VIEWER, roles: [] };
  }
}

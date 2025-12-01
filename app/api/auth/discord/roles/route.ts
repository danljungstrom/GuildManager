import { NextRequest, NextResponse } from 'next/server';
import { DISCORD_API_BASE, AUTH_COOKIE_NAME } from '@/lib/auth/discord';
import { DiscordRole } from '@/lib/types/auth.types';

interface SessionData {
  accessToken: string;
}

/**
 * GET /api/auth/discord/roles
 * 
 * Fetches the roles from the configured Discord guild
 * Requires the user to be authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Get session
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Decode session
    const sessionData: SessionData = JSON.parse(
      Buffer.from(sessionCookie, 'base64').toString('utf-8')
    );
    
    const guildId = process.env.DISCORD_GUILD_ID;
    
    if (!guildId) {
      return NextResponse.json(
        { error: 'Discord guild not configured' },
        { status: 400 }
      );
    }
    
    // Note: To get ALL roles in a guild, we need a bot token, not a user token
    // User tokens can only get the roles the user has
    // For now, we'll use a bot token if available, otherwise return user's roles
    
    const botToken = process.env.DISCORD_BOT_TOKEN;
    
    if (botToken) {
      // Use bot to get all guild roles
      const response = await fetch(
        `${DISCORD_API_BASE}/guilds/${guildId}/roles`,
        {
          headers: {
            Authorization: `Bot ${botToken}`,
          },
        }
      );
      
      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to fetch guild roles:', error);
        return NextResponse.json(
          { error: 'Failed to fetch guild roles' },
          { status: 500 }
        );
      }
      
      const roles: DiscordRole[] = await response.json();
      
      // Filter out @everyone role and sort by position (highest first)
      const filteredRoles = roles
        .filter(role => role.name !== '@everyone')
        .sort((a, b) => b.position - a.position);
      
      return NextResponse.json({ roles: filteredRoles });
    } else {
      // No bot token - get user's roles in the guild
      const response = await fetch(
        `${DISCORD_API_BASE}/users/@me/guilds/${guildId}/member`,
        {
          headers: {
            Authorization: `Bearer ${sessionData.accessToken}`,
          },
        }
      );
      
      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch member roles', needsBot: true },
          { status: 400 }
        );
      }
      
      const member = await response.json();
      
      // We only have role IDs, not full role info
      // Return them as-is, the UI will need to handle this
      return NextResponse.json({ 
        roleIds: member.roles,
        needsBot: true,
        message: 'Add a Discord bot to see all server roles'
      });
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/discord';
import { AuthUser, PermissionLevel } from '@/lib/types/auth.types';
import { getGuildConfig } from '@/lib/services/guild-config.service';

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
 * Dynamically checks permissions based on:
 * 1. Site owner status (always SUPERADMIN)
 * 2. Discord role mappings configured in settings
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

    // Dynamically determine permission level
    const user = { ...sessionData.user };
    try {
      const guildConfig = await getGuildConfig();

      // Check if user is site owner - always SUPERADMIN
      if (guildConfig?.discord?.ownerId === user.id) {
        user.permissionLevel = PermissionLevel.SUPERADMIN;
      } else if (guildConfig?.discord?.roleMappings && user.roles?.length > 0) {
        // Check role mappings - user gets highest permission from any matching role
        let highestPermission = PermissionLevel.VIEWER;

        for (const roleId of user.roles) {
          const mapping = guildConfig.discord.roleMappings.find(
            m => m.discordRoleId === roleId
          );
          if (mapping && mapping.permissionLevel > highestPermission) {
            highestPermission = mapping.permissionLevel;
          }
        }

        user.permissionLevel = highestPermission;
      }
    } catch {
      // If we can't fetch config, use cached permission level
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ user: null, error: 'Invalid session' });
  }
}

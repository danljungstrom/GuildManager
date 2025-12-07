/**
 * Authentication and Authorization Types
 * 
 * Defines types for Discord OAuth, user roles, and permissions
 */

/**
 * Permission levels for the application
 * Higher number = more permissions
 */
export enum PermissionLevel {
  VIEWER = 0,      // Can view public content only
  MEMBER = 1,      // Can sign up for raids, view roster
  MODERATOR = 2,   // Can edit class members, manage signups
  ADMIN = 3,       // Can manage raids, roster, most settings
  SUPERADMIN = 4,  // Full control, can manage other admins
}

/**
 * Discord user information returned from OAuth
 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  email?: string;
}

/**
 * Discord guild (server) member information
 */
export interface DiscordGuildMember {
  user: DiscordUser;
  nick?: string;
  roles: string[]; // Array of role IDs
  joined_at: string;
}

/**
 * Discord role information
 */
export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
}

/**
 * Mapping of Discord role ID to app permission level
 */
export interface RoleMapping {
  discordRoleId: string;
  discordRoleName: string; // For display purposes
  permissionLevel: PermissionLevel;
}

/**
 * Discord integration settings stored in Firestore
 */
export interface DiscordSettings {
  enabled: boolean;
  guildId: string; // Discord server ID
  guildName?: string; // For display
  roleMappings: RoleMapping[];
  // Bot token is stored securely, not in client-accessible config
}

/**
 * Authenticated user stored in context/session
 */
export interface AuthUser {
  id: string; // Discord user ID
  discordUsername: string;
  displayName: string; // global_name or username
  avatar?: string;
  permissionLevel: PermissionLevel;
  roles: string[]; // Discord role IDs they have
  lastUpdated: string; // ISO timestamp
}

/**
 * Auth state for the application
 */
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * OAuth tokens from Discord
 */
export interface DiscordTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/**
 * Permission level labels for UI display
 */
export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  [PermissionLevel.VIEWER]: 'Viewer',
  [PermissionLevel.MEMBER]: 'Member',
  [PermissionLevel.MODERATOR]: 'Moderator',
  [PermissionLevel.ADMIN]: 'Admin',
  [PermissionLevel.SUPERADMIN]: 'Owner',
};

/**
 * Permission level descriptions
 */
export const PERMISSION_DESCRIPTIONS: Record<PermissionLevel, string> = {
  [PermissionLevel.VIEWER]: 'Can view public content only',
  [PermissionLevel.MEMBER]: 'Can sign up for raids and view full roster',
  [PermissionLevel.MODERATOR]: 'Can manage class members and raid signups',
  [PermissionLevel.ADMIN]: 'Can manage raids, roster, and most settings',
  [PermissionLevel.SUPERADMIN]: 'Site owner with full control',
};

/**
 * Default role mappings suggestion
 */
export const SUGGESTED_ROLE_MAPPINGS = [
  { discordRoleName: 'Guild Master', permissionLevel: PermissionLevel.SUPERADMIN },
  { discordRoleName: 'Officer', permissionLevel: PermissionLevel.ADMIN },
  { discordRoleName: 'Class Lead', permissionLevel: PermissionLevel.MODERATOR },
  { discordRoleName: 'Raider', permissionLevel: PermissionLevel.MEMBER },
];

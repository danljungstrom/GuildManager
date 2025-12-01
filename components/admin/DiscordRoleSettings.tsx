'use client';

import * as React from 'react';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { useGuild } from '@/lib/contexts/GuildContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PermissionLevel, 
  PERMISSION_LABELS, 
  PERMISSION_DESCRIPTIONS,
  RoleMapping,
  DiscordRole,
} from '@/lib/types/auth.types';
import { updateGuildConfig } from '@/lib/services/guild-config.service';

export function DiscordRoleSettings() {
  const { user, isAdmin } = useAuth();
  const { config, refreshConfig } = useGuild();
  
  const [roles, setRoles] = React.useState<DiscordRole[]>([]);
  const [roleMappings, setRoleMappings] = React.useState<RoleMapping[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [needsBot, setNeedsBot] = React.useState(false);

  // Load existing mappings from config
  React.useEffect(() => {
    if (config?.discord?.roleMappings) {
      setRoleMappings(config.discord.roleMappings);
    }
  }, [config]);

  // Fetch Discord roles
  const fetchRoles = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/discord/roles');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        if (data.needsBot) {
          setNeedsBot(true);
        }
      } else if (data.roles) {
        setRoles(data.roles);
        setNeedsBot(false);
      } else if (data.needsBot) {
        setNeedsBot(true);
        setError('A Discord bot is required to fetch all server roles');
      }
    } catch (err) {
      setError('Failed to fetch Discord roles');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      fetchRoles();
    }
  }, [isAdmin, fetchRoles]);

  // Update role permission
  const updateRolePermission = (roleId: string, roleName: string, level: PermissionLevel | null) => {
    setRoleMappings(prev => {
      // Remove existing mapping for this role
      const filtered = prev.filter(m => m.discordRoleId !== roleId);
      
      // If setting to null (removing), just return filtered
      if (level === null) {
        return filtered;
      }
      
      // Add new mapping
      return [...filtered, {
        discordRoleId: roleId,
        discordRoleName: roleName,
        permissionLevel: level,
      }];
    });
  };

  // Get current permission for a role
  const getRolePermission = (roleId: string): PermissionLevel | undefined => {
    return roleMappings.find(m => m.discordRoleId === roleId)?.permissionLevel;
  };

  // Save mappings to Firestore
  const saveMappings = async () => {
    if (!config) return;
    
    setSaving(true);
    setError(null);
    
    try {
      await updateGuildConfig({
        ...config,
        discord: {
          ...config.discord,
          enabled: true,
          roleMappings,
        },
      });
      await refreshConfig();
    } catch (err) {
      setError('Failed to save role mappings');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discord Role Permissions</CardTitle>
          <CardDescription>
            You need admin access to configure role permissions.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Discord Role Permissions</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRoles}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Roles
          </Button>
        </CardTitle>
        <CardDescription>
          Map Discord roles to permission levels. Users with multiple roles get the highest permission.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Owner info */}
        {config?.discord?.ownerId && (
          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
            <Info className="h-4 w-4 mt-0.5 text-primary" />
            <div className="text-sm">
              <span className="font-medium">Site Owner</span>
              <p className="text-muted-foreground">
                The person who set up this site always has Super Admin access, regardless of role mappings.
                {user?.id === config.discord.ownerId && ' (That\'s you!)'}
              </p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {/* Bot needed message */}
        {needsBot && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 text-warning-foreground rounded-lg border border-warning/20">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Discord Bot Recommended</span>
              <p className="text-muted-foreground">
                Add a Discord bot to automatically fetch all server roles. 
                Without a bot, you&apos;ll need to manually enter role IDs.
              </p>
            </div>
          </div>
        )}

        {/* Permission level legend */}
        <div className="space-y-2">
          <Label>Permission Levels</Label>
          <div className="grid gap-2 text-sm">
            {Object.values(PermissionLevel)
              .filter(v => typeof v === 'number')
              .map(level => (
                <div key={level} className="flex items-center gap-2">
                  <span className="font-medium w-24">{PERMISSION_LABELS[level as PermissionLevel]}</span>
                  <span className="text-muted-foreground">
                    {PERMISSION_DESCRIPTIONS[level as PermissionLevel]}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Role mappings */}
        {roles.length > 0 && (
          <div className="space-y-3">
            <Label>Role Mappings</Label>
            <div className="space-y-2">
              {roles.map(role => (
                <div 
                  key={role.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: role.color 
                          ? `#${role.color.toString(16).padStart(6, '0')}` 
                          : '#99aab5'
                      }}
                    />
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <Select
                    value={getRolePermission(role.id)?.toString() ?? 'none'}
                    onValueChange={(value) => {
                      if (value === 'none') {
                        updateRolePermission(role.id, role.name, null);
                      } else {
                        updateRolePermission(role.id, role.name, parseInt(value) as PermissionLevel);
                      }
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="No access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No special access</SelectItem>
                      <SelectItem value={PermissionLevel.MEMBER.toString()}>
                        {PERMISSION_LABELS[PermissionLevel.MEMBER]}
                      </SelectItem>
                      <SelectItem value={PermissionLevel.MODERATOR.toString()}>
                        {PERMISSION_LABELS[PermissionLevel.MODERATOR]}
                      </SelectItem>
                      <SelectItem value={PermissionLevel.ADMIN.toString()}>
                        {PERMISSION_LABELS[PermissionLevel.ADMIN]}
                      </SelectItem>
                      <SelectItem value={PermissionLevel.SUPERADMIN.toString()}>
                        {PERMISSION_LABELS[PermissionLevel.SUPERADMIN]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <Button onClick={saveMappings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Role Mappings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

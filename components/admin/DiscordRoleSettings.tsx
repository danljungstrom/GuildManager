'use client';

import * as React from 'react';
import { AlertCircle, Plus, Trash2, HelpCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { useGuild } from '@/lib/contexts/GuildContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  PermissionLevel,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  RoleMapping,
} from '@/lib/types/auth.types';
import { updateGuildConfig } from '@/lib/services/guild-config.service';

export function DiscordRoleSettings() {
  const { isAdmin } = useAuth();
  const { config, refreshConfig } = useGuild();

  const [roleMappings, setRoleMappings] = React.useState<RoleMapping[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [guideOpen, setGuideOpen] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  // Manual role entry state
  const [newRoleId, setNewRoleId] = React.useState('');
  const [newRoleName, setNewRoleName] = React.useState('');
  const [newRolePermission, setNewRolePermission] = React.useState<PermissionLevel>(PermissionLevel.MEMBER);

  // Load existing mappings from config
  React.useEffect(() => {
    if (config?.discord?.roleMappings) {
      setRoleMappings(config.discord.roleMappings);
      setInitialized(true);
    }
  }, [config]);

  // Auto-save when roleMappings change (after initial load)
  React.useEffect(() => {
    if (!initialized || !config) return;

    const saveChanges = async () => {
      try {
        await updateGuildConfig({
          ...config,
          discord: {
            ...config.discord,
            enabled: config.discord?.enabled ?? true,
            roleMappings,
          },
        });
        await refreshConfig();
        setError(null);
      } catch {
        setError('Failed to save role mappings');
      }
    };

    saveChanges();
  }, [roleMappings, initialized]);

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

  // Add manual role mapping
  const addManualRole = () => {
    if (!newRoleId.trim() || !newRoleName.trim()) return;

    // Check if role already exists
    if (roleMappings.some(m => m.discordRoleId === newRoleId.trim())) {
      setError('This role ID is already mapped');
      return;
    }

    setRoleMappings(prev => [...prev, {
      discordRoleId: newRoleId.trim(),
      discordRoleName: newRoleName.trim(),
      permissionLevel: newRolePermission,
    }]);

    // Clear form
    setNewRoleId('');
    setNewRoleName('');
    setNewRolePermission(PermissionLevel.MEMBER);
    setError(null);
  };

  // Remove a role mapping
  const removeRoleMapping = (roleId: string) => {
    setRoleMappings(prev => prev.filter(m => m.discordRoleId !== roleId));
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
        <CardTitle>Discord Role Permissions</CardTitle>
        <CardDescription>
          Map Discord roles to permission levels. Users with multiple roles get the highest permission.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {/* Current Role Mappings */}
        {roleMappings.length > 0 && (
          <div className="space-y-3">
            <Label>Current Role Mappings</Label>
            <div className="space-y-2">
              {roleMappings.map(mapping => (
                <div
                  key={mapping.discordRoleId}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">{mapping.discordRoleName}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({mapping.discordRoleId})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={mapping.permissionLevel.toString()}
                      onValueChange={(value) => {
                        updateRolePermission(mapping.discordRoleId, mapping.discordRoleName, parseInt(value) as PermissionLevel);
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRoleMapping(mapping.discordRoleId)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Role Mapping */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label>Add Role Mapping</Label>
            <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <HelpCircle className="h-4 w-4" />
                  How to get Role ID
                  <ChevronDown className={`h-4 w-4 transition-transform ${guideOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
          <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
            <CollapsibleContent className="mb-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">1. Enable Developer Mode</p>
                  <p className="text-muted-foreground">
                    User Settings → Advanced → Developer Mode <span className="text-primary font-medium">On</span>
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">2. Copy the Role ID</p>
                  <p className="text-muted-foreground">
                    Server Settings → Roles → Select Role → <span className="font-mono">⋯</span> (top right) → Copy Role ID
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Role ID"
              value={newRoleId}
              onChange={(e) => setNewRoleId(e.target.value)}
            />
            <Input
              placeholder="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <Select
              value={newRolePermission.toString()}
              onValueChange={(value) => setNewRolePermission(parseInt(value) as PermissionLevel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <Button onClick={addManualRole} disabled={!newRoleId.trim() || !newRoleName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Permission level legend */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Permission Levels Reference</Label>
          <div className="grid gap-1 text-sm">
            {Object.values(PermissionLevel)
              .filter(v => typeof v === 'number' && v !== PermissionLevel.VIEWER)
              .map(level => (
                <div key={level} className="flex items-center gap-2">
                  <span className="font-medium w-24">{PERMISSION_LABELS[level as PermissionLevel]}</span>
                  <span className="text-muted-foreground text-xs">
                    {PERMISSION_DESCRIPTIONS[level as PermissionLevel]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

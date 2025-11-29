'use client';

// TODO: Add Firebase Authentication to protect this admin route
// This page should only be accessible to authenticated admin users
// Steps to implement:
// 1. Set up Firebase Authentication (see Firebase console)
// 2. Create an authentication context/hook
// 3. Add a useEffect to check if user is authenticated and is an admin
// 4. Redirect to login page if not authenticated
// 5. Show "Unauthorized" message if authenticated but not an admin
// Example implementation:
// const { user, loading } = useAuth();
// useEffect(() => {
//   if (!loading && (!user || !user.isAdmin)) {
//     router.push('/login');
//   }
// }, [user, loading, router]);

import { useState } from 'react';
import { useGuild } from '@/lib/contexts/GuildContext';
import { updateGuildConfig } from '@/lib/services/guild-config.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { WoWExpansion, WoWRegion, WoWFaction } from '@/lib/types/guild-config.types';
import { ArrowLeft } from 'lucide-react';
import { GuildLogo } from '@/components/ui/guild-logo';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { config, refreshConfig } = useGuild();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: config?.metadata.name || '',
    server: config?.metadata.server || '',
    region: (config?.metadata.region || 'US') as WoWRegion,
    faction: (config?.metadata.faction || 'Alliance') as WoWFaction,
    expansion: (config?.metadata.expansion || 'classic') as WoWExpansion,
    description: config?.metadata.description || '',
    primaryColor: config?.theme.colors.primary || '41 40% 60%',
    accentColor: config?.theme.colors.accent || '41 40% 60%',
    enableRaidPlanning: config?.features?.enableRaidPlanning ?? true,
    enableAttunementTracking: config?.features?.enableAttunementTracking ?? true,
    enableProfessionTracking: config?.features?.enableProfessionTracking ?? true,
    enablePublicRoster: config?.features?.enablePublicRoster ?? true,
  });

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateGuildConfig({
        metadata: {
          name: formData.name,
          server: formData.server,
          region: formData.region as WoWRegion,
          faction: formData.faction as WoWFaction,
          expansion: formData.expansion as WoWExpansion,
          description: formData.description,
        },
        theme: {
          colors: {
            ...config.theme.colors,
            primary: formData.primaryColor,
            accent: formData.accentColor,
          },
        },
        features: {
          enableRaidPlanning: formData.enableRaidPlanning,
          enableAttunementTracking: formData.enableAttunementTracking,
          enableProfessionTracking: formData.enableProfessionTracking,
          enablePublicRoster: formData.enablePublicRoster,
        },
      });

      await refreshConfig();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your guild&apos;s configuration and appearance
          </p>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-md text-green-500">
            Settings saved successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
            {error}
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="branding">Logo & Branding</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Guild Information</CardTitle>
                <CardDescription>
                  Basic information about your guild
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Guild Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="server">Server Name</Label>
                  <Input
                    id="server"
                    value={formData.server}
                    onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value as WoWRegion })}>
                      <SelectTrigger id="region">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="EU">EU</SelectItem>
                        <SelectItem value="KR">KR</SelectItem>
                        <SelectItem value="TW">TW</SelectItem>
                        <SelectItem value="CN">CN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faction">Faction</Label>
                    <Select value={formData.faction} onValueChange={(value) => setFormData({ ...formData, faction: value as WoWFaction })}>
                      <SelectTrigger id="faction">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alliance">Alliance</SelectItem>
                        <SelectItem value="Horde">Horde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expansion">Expansion</Label>
                  <Select value={formData.expansion} onValueChange={(value) => setFormData({ ...formData, expansion: value as WoWExpansion })}>
                    <SelectTrigger id="expansion">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic Era</SelectItem>
                      <SelectItem value="tbc">The Burning Crusade</SelectItem>
                      <SelectItem value="wotlk">Wrath of the Lich King</SelectItem>
                      <SelectItem value="cata">Cataclysm</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Colors</CardTitle>
                <CardDescription>
                  Customize your guild&apos;s color scheme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color (HSL)</Label>
                  <Input
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="41 40% 60%"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: hue saturation% lightness% (e.g., &quot;41 40% 60%&quot;)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color (HSL)</Label>
                  <Input
                    id="accentColor"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    placeholder="41 40% 60%"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: hue saturation% lightness% (e.g., &quot;41 40% 60%&quot;)
                  </p>
                </div>

                <div className="p-4 border rounded-md space-y-2">
                  <p className="text-sm font-medium">Preview</p>
                  <div className="flex gap-4">
                    <div
                      className="h-20 w-20 rounded-md border"
                      style={{ backgroundColor: `hsl(${formData.primaryColor})` }}
                    />
                    <div
                      className="h-20 w-20 rounded-md border"
                      style={{ backgroundColor: `hsl(${formData.accentColor})` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Branding</CardTitle>
                <CardDescription>
                  Customize your guild&apos;s visual identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Current Logo</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your guild is currently using the {config?.theme.logoType === 'theme-icon' ? 'theme icon' : 'custom logo'}
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="w-16 h-16 flex items-center justify-center bg-background rounded-lg border">
                        <GuildLogo size="md" className="w-16 h-16" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {config?.theme.logoType === 'theme-icon'
                            ? `${config?.theme.logo?.charAt(0).toUpperCase()}${config?.theme.logo?.slice(1)} Theme Icon`
                            : 'Custom Logo'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {config?.theme.logoType === 'theme-icon'
                            ? 'Default theme icon from your selected color scheme'
                            : 'Custom uploaded image'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="mt-0.5">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Custom Logo Upload - Coming Soon
                        </p>
                        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                          <p>The custom logo upload feature is planned for a future release. When implemented, you will be able to:</p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Upload custom images (PNG, JPG, SVG, WebP)</li>
                            <li>Preview your logo before saving</li>
                            <li>Toggle frame borders for images without transparency</li>
                            <li>Automatically detect image transparency</li>
                            <li>Store logos securely in Firebase Storage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TODO: Implement custom logo upload
                      - File input accepting PNG, JPG, SVG, WebP
                      - Image preview with frame toggle
                      - Upload to Firebase Storage
                      - Update guild config with logo URL
                      - Automatic transparency detection
                      - Image optimization and resizing
                      - Validation (file size, dimensions, format)
                  */}

                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <Label htmlFor="logoUpload" className="text-base font-semibold">
                      Upload Custom Logo (Coming Soon)
                    </Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, SVG or WebP (max. 2MB)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Switch id="logoFrame" disabled />
                      <Label htmlFor="logoFrame" className="text-sm">
                        Add frame border (for images without transparency)
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>
                  Enable or disable specific features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Raid Planning</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable raid calendar and planning tools
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableRaidPlanning}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableRaidPlanning: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attunement Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track member raid attunements
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableAttunementTracking}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableAttunementTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profession Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track member professions and recipes
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableProfessionTracking}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableProfessionTracking: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public Roster</Label>
                    <p className="text-sm text-muted-foreground">
                      Make guild roster visible to non-members
                    </p>
                  </div>
                  <Switch
                    checked={formData.enablePublicRoster}
                    onCheckedChange={(checked) => setFormData({ ...formData, enablePublicRoster: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={loading} size="lg">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

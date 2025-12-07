'use client';

import { useAuth } from '@/lib/contexts/AdminContext';
import { useGuild } from '@/lib/contexts/GuildContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Shield, Users } from 'lucide-react';

interface DiscordGateProps {
  children: React.ReactNode;
}

/**
 * DiscordGate component
 *
 * Checks if Discord membership is required and if the user meets the requirement.
 * If requireDiscordMembership is enabled:
 * - Not logged in: Shows login prompt
 * - Logged in but not in Discord server: Shows access denied
 * - Logged in and in Discord server: Shows children
 */
export function DiscordGate({ children }: DiscordGateProps) {
  const { user, loading: authLoading, loginWithDiscord } = useAuth();
  const { config } = useGuild();

  // Show nothing while auth is loading
  if (authLoading) {
    return null;
  }

  // Check if Discord membership is required
  const requireDiscordMembership = config?.discord?.requireDiscordMembership ?? false;

  // If not required, show children
  if (!requireDiscordMembership) {
    return <>{children}</>;
  }

  // If required but not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Discord Login Required</CardTitle>
            <CardDescription>
              This guild website requires you to be a member of our Discord server.
              Please log in with Discord to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loginWithDiscord} className="w-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Login with Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If logged in but not in the Discord server (no roles means not in server)
  if (!user.roles || user.roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Discord Membership Required</CardTitle>
            <CardDescription>
              You must be a member of our Discord server to access this website.
              Please join our Discord server and try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Logged in as <span className="font-medium">{user.displayName}</span>
            </p>
            <Button onClick={loginWithDiscord} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in and in the Discord server
  return <>{children}</>;
}

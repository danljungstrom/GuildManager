/**
 * Roster Page
 *
 * Placeholder page for guild roster management.
 * This will be fully implemented in future phases.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Guild Roster - GuildManager',
  description: 'View and manage your guild roster',
};

export default function RosterPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Guild Roster</CardTitle>
              <CardDescription>
                This page will display your guild roster with member details, classes, roles, and
                more.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The roster page is currently under development. It will include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                <li>Complete guild member listing with class and role icons</li>
                <li>Filtering and sorting by class, role, rank</li>
                <li>Attunement tracking for raid content</li>
                <li>Profession tracking for crafters</li>
                <li>Admin controls for member management</li>
              </ul>
              <div className="pt-4">
                <Button asChild>
                  <Link href="/theme-demo">View Theme Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

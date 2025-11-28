import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-primary">
            GuildManager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A fully customizable guild management system for World of Warcraft guilds
          </p>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome to GuildManager</CardTitle>
            <CardDescription>
              Manage your guild with a beautiful, customizable interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              GuildManager provides a complete solution for managing your World of Warcraft guild,
              including roster management, raid planning, attunement tracking, and more.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/theme-demo">View Theme Demo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/roster">View Roster</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customizable Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Edit colors and branding through an admin interface without touching code
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multi-Guild Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support for any WoW expansion with expansion-specific features
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modern UI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with shadcn/ui and Tailwind CSS for a polished experience
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

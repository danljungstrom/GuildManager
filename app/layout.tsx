import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Cinzel_Decorative, Metal_Mania, New_Rocker, Almendra_SC, Uncial_Antiqua, Wendy_One } from 'next/font/google';

// Note: If fonts don't load, check Google Fonts API for exact names
import './globals.css';
import { cn } from '@/lib/utils';
import { GuildProvider } from '@/lib/contexts/GuildContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// Body font - shared across all themes
const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// Theme heading fonts
const spartanHeading = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading-spartan',
  display: 'swap',
});

const hordeHeading = Metal_Mania({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-horde',
  display: 'swap',
});

const allianceHeading = New_Rocker({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-alliance',
  display: 'swap',
});

const shadowHeading = Almendra_SC({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-shadow',
  display: 'swap',
});

const natureHeading = Uncial_Antiqua({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-nature',
  display: 'swap',
});

const frostHeading = Wendy_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading-frost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GuildManager - WoW Guild Management',
  description: 'A customizable guild management system for World of Warcraft guilds',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(
      'dark',
      bodyFont.variable,
      spartanHeading.variable,
      hordeHeading.variable,
      allianceHeading.variable,
      shadowHeading.variable,
      natureHeading.variable,
      frostHeading.variable,
      geist.variable,
      geistMono.variable
    )}>
      <body className={cn('min-h-screen bg-background antialiased')}>
        <GuildProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4 md:hidden">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h1 className="text-lg font-semibold truncate">Guild Manager</h1>
                </div>
              </header>
              <main className="flex-1">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </GuildProvider>
      </body>
    </html>
  );
}

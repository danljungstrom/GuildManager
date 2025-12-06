import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Geist, Geist_Mono, Inter, Cinzel_Decorative, Metal_Mania, New_Rocker, Almendra_SC, Uncial_Antiqua, Wendy_One } from 'next/font/google';

// Note: If fonts don't load, check Google Fonts API for exact names
import './globals.css';
import { cn } from '@/lib/utils';
import { GuildProvider } from '@/lib/contexts/GuildContext';
import { AdminProvider } from '@/lib/contexts/AdminContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { getGuildConfigCached } from '@/lib/services/guild-config.server';
import { THEME_COOKIE_NAME } from '@/lib/utils/theme-cookie';
import { Toaster } from '@/components/ui/toaster';
import { KeyboardShortcutsProvider } from '@/components/layout/KeyboardShortcutsProvider';

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
  title: {
    default: 'GuildManager - WoW Guild Management',
    template: '%s | GuildManager',
  },
  description: 'A customizable guild management system for World of Warcraft guilds. Manage rosters, raids, attendance, and more.',
  keywords: ['World of Warcraft', 'WoW', 'Guild Management', 'Roster', 'Raid Planning', 'Guild Manager'],
  authors: [{ name: 'GuildManager' }],
  creator: 'GuildManager',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://guildmanager.app',
    title: 'GuildManager - WoW Guild Management',
    description: 'A customizable guild management system for World of Warcraft guilds',
    siteName: 'GuildManager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GuildManager - WoW Guild Management',
    description: 'A customizable guild management system for World of Warcraft guilds',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch guild config server-side for instant hydration
  const guildConfig = await getGuildConfigCached();

  // Read theme from cookie server-side to prevent flash
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_NAME);
  const theme = themeCookie?.value === 'light' ? 'light' : 'dark';

  return (
    <html lang="en" className={cn(
      theme, // Dynamic theme from cookie
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
      <body className={cn('min-h-screen antialiased')}>
        <GuildProvider initialConfig={guildConfig}>
          <AdminProvider>
            <AppLayout initialTheme={theme}>
              {children}
            </AppLayout>
          </AdminProvider>
        </GuildProvider>
        <Toaster />
        <KeyboardShortcutsProvider />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { GuildProvider } from '@/lib/contexts/GuildContext';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
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
    <html lang="en" className="dark">
      <body className={cn('min-h-screen bg-background antialiased', geist.variable, geistMono.variable)}>
        <GuildProvider>
          {children}
        </GuildProvider>
      </body>
    </html>
  );
}

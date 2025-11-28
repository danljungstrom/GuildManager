import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';

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
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        {children}
      </body>
    </html>
  );
}

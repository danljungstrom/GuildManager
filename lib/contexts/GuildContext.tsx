'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
import { GuildConfig } from '@/lib/types/guild-config.types';
import { getGuildConfig } from '@/lib/services/guild-config.service';

interface GuildContextType {
  config: GuildConfig | null;
  error: Error | null;
  refreshConfig: () => Promise<void>;
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

interface GuildProviderProps {
  children: React.ReactNode;
  initialConfig: GuildConfig | null;
}

/**
 * Client-side Guild Context Provider
 * Accepts server-fetched initialConfig to avoid loading states
 */
export function GuildProvider({ children, initialConfig }: GuildProviderProps) {
  const [config, setConfig] = useState<GuildConfig | null>(initialConfig);
  const [error, setError] = useState<Error | null>(null);
  const [, startTransition] = useTransition();

  const refreshConfig = async () => {
    try {
      setError(null);
      const guildConfig = await getGuildConfig();
      startTransition(() => {
        setConfig(guildConfig);
      });
    } catch (err) {
      setError(err as Error);
      console.error('Failed to refresh guild config:', err);
    }
  };

  return (
    <GuildContext.Provider value={{ config, error, refreshConfig }}>
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild() {
  const context = useContext(GuildContext);
  if (context === undefined) {
    throw new Error('useGuild must be used within a GuildProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GuildConfig } from '@/lib/types/guild-config.types';
import { getGuildConfig } from '@/lib/services/guild-config.service';

interface GuildContextType {
  config: GuildConfig | null;
  loading: boolean;
  error: Error | null;
  refreshConfig: () => Promise<void>;
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const guildConfig = await getGuildConfig();
      setConfig(guildConfig);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load guild config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const refreshConfig = async () => {
    await loadConfig();
  };

  return (
    <GuildContext.Provider value={{ config, loading, error, refreshConfig }}>
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

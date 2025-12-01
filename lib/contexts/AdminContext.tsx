'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthUser, PermissionLevel } from '@/lib/types/auth.types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  // Permission checks
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissionLevel: PermissionLevel;
  hasPermission: (required: PermissionLevel) => boolean;
  // Auth actions
  loginWithDiscord: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user on mount
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Redirect to Discord OAuth
  const loginWithDiscord = useCallback(() => {
    window.location.href = '/api/auth/discord';
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }, []);

  // Permission check helper
  const hasPermission = useCallback((required: PermissionLevel): boolean => {
    if (!user) return false;
    return user.permissionLevel >= required;
  }, [user]);

  // Computed values
  const isAuthenticated = user !== null;
  const permissionLevel = user?.permissionLevel ?? PermissionLevel.VIEWER;
  const isAdmin = hasPermission(PermissionLevel.ADMIN);
  const isSuperAdmin = hasPermission(PermissionLevel.SUPERADMIN);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      permissionLevel,
      hasPermission,
      loginWithDiscord, 
      logout,
      refreshUser: fetchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AdminProvider');
  }
  return context;
}

// Backward compatibility alias
export const useAdmin = useAuth;

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGuild } from '@/lib/contexts/GuildContext';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { cn } from '@/lib/utils';
import { LogoPreview } from '@/components/logo/LogoPreview';

interface GuildLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

// Map GuildLogo sizes to LogoPreview sizes (GuildLogo sm = sidebar size, needs xs)
const logoPreviewSizeMap = {
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
};

/**
 * GuildLogo Component
 *
 * Displays the guild's logo using the new LogoConfig system.
 * Falls back to legacy format for backwards compatibility.
 */
export function GuildLogo({ size = 'md', className }: GuildLogoProps) {
  const { config } = useGuild();
  const { activePresetId } = useThemeStore();
  const [imageError, setImageError] = useState(false);

  // Use new logoConfig if available
  const logoConfig = config?.theme.logoConfig;

  if (logoConfig && logoConfig.type !== 'none' && logoConfig.path) {
    // For theme-icon type, dynamically use the current theme's icon
    // This ensures the logo updates when switching themes
    const effectiveConfig = logoConfig.type === 'theme-icon'
      ? { ...logoConfig, path: activePresetId }
      : logoConfig;

    // Use the new LogoPreview component for full logo config support
    return (
      <LogoPreview
        config={effectiveConfig}
        size={logoPreviewSizeMap[size]}
        className={className}
      />
    );
  }

  // Legacy fallback for old config format
  const sizeClass = sizeClasses[size];
  const logoType = config?.theme.logoType || 'theme-icon';
  const logoUrl = config?.theme.logo;

  // If using theme icon or custom image failed, display SVG icon
  if (logoType === 'theme-icon' || imageError || !logoUrl) {
    const themeIconId = (logoType === 'theme-icon' && activePresetId)
      ? activePresetId
      : (logoUrl || 'spartan');
    const themeIcon = getThemeIcon(themeIconId);

    if (!themeIcon) {
      return (
        <div
          className={cn(
            sizeClass,
            'flex items-center justify-center bg-muted rounded-md',
            className
          )}
        >
          <span className="text-xs text-muted-foreground">No Logo</span>
        </div>
      );
    }

    return (
      <div
        className={cn(sizeClass, 'flex items-center justify-center', className)}
        style={{
          backgroundColor: 'hsl(var(--primary))',
          maskImage: `url(${themeIcon.svg})`,
          WebkitMaskImage: `url(${themeIcon.svg})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    );
  }

  // Legacy custom image
  return (
    <div className={cn(sizeClass, 'flex items-center justify-center relative', className)}>
      <Image
        src={logoUrl}
        alt="Guild Logo"
        fill
        className="object-contain"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  );
}

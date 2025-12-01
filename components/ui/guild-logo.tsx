'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGuild } from '@/lib/contexts/GuildContext';
import { useThemeStore } from '@/lib/stores/theme-store';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { getLogoFrameStyles, cn } from '@/lib/utils';

interface GuildLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showFrame?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

/**
 * GuildLogo Component
 *
 * Displays the guild's logo, which can be either:
 * - A theme-specific SVG icon (default)
 * - A custom uploaded image
 *
 * Features:
 * - Responsive sizing (sm, md, lg)
 * - Optional frame for images without transparency
 * - Fallback to theme icon if custom image fails
 * - Automatically updates when theme preset changes (for theme icons)
 */
export function GuildLogo({ size = 'md', showFrame, className }: GuildLogoProps) {
  const { config } = useGuild();
  const { activePresetId } = useThemeStore();
  const [imageError, setImageError] = useState(false);

  // Determine size class
  const sizeClass = sizeClasses[size];

  // Get logo configuration
  const logoType = config?.theme.logoType || 'theme-icon';
  const logoUrl = config?.theme.logo;
  const logoFrame = showFrame !== undefined ? showFrame : (config?.theme.logoFrame ?? false);

  // If using theme icon or custom image failed, display SVG icon
  if (logoType === 'theme-icon' || imageError || !logoUrl) {
    // For theme icons, prefer the active preset ID from Zustand store
    // This ensures the logo updates immediately when theme changes
    const themeIconId = (logoType === 'theme-icon' && activePresetId) 
      ? activePresetId 
      : (logoUrl || 'spartan');
    const themeIcon = getThemeIcon(themeIconId);

    if (!themeIcon) {
      // Fallback if icon not found
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

    // Render theme SVG icon with primary color
    // Use hsl(var(--primary)) so it updates reactively when theme changes
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

  // If using custom image
  const frameStyles = logoFrame ? getLogoFrameStyles(false, 'var(--primary)') : {};

  return (
    <div className={cn(sizeClass, 'flex items-center justify-center relative', className)} style={frameStyles}>
      <Image
        src={logoUrl}
        alt="Guild Logo"
        fill
        className={cn('object-contain', logoFrame && 'rounded')}
        onError={() => setImageError(true)}
        unoptimized // Custom URLs may not be optimizable
      />
    </div>
  );
}

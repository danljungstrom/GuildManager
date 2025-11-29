'use client';

import { useState } from 'react';
import { useGuild } from '@/lib/contexts/GuildContext';
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
 */
export function GuildLogo({ size = 'md', showFrame, className }: GuildLogoProps) {
  const { config } = useGuild();
  const [imageError, setImageError] = useState(false);

  // Determine size class
  const sizeClass = sizeClasses[size];

  // Get logo configuration
  const logoType = config?.theme.logoType || 'theme-icon';
  const logoUrl = config?.theme.logo;
  const logoFrame = showFrame !== undefined ? showFrame : (config?.theme.logoFrame ?? false);
  const themeColor = config?.theme.colors.primary || '41 40% 60%';

  // If using theme icon or custom image failed, display SVG icon
  if (logoType === 'theme-icon' || imageError || !logoUrl) {
    // Determine which theme icon to use
    const themeIconId = logoUrl || 'gold'; // Use logo as icon ID if set, otherwise default to gold
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

    // Render theme SVG icon
    return (
      <div
        className={cn(sizeClass, 'flex items-center justify-center', className)}
        dangerouslySetInnerHTML={{ __html: themeIcon.svg }}
        aria-label={`${themeIcon.name} theme icon`}
      />
    );
  }

  // If using custom image
  const frameStyles = logoFrame ? getLogoFrameStyles(false, themeColor) : {};

  return (
    <div className={cn(sizeClass, 'flex items-center justify-center', className)} style={frameStyles}>
      <img
        src={logoUrl}
        alt="Guild Logo"
        className={cn('w-full h-full object-contain', logoFrame && 'rounded')}
        onError={() => setImageError(true)}
      />
    </div>
  );
}

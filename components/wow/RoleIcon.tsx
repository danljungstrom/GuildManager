/**
 * RoleIcon Component
 *
 * Displays a WoW role icon (Tank, DPS, Healer) with optional text.
 * Supports both image-based icons and text-only fallback.
 */

import { cn } from '@/lib/utils';
import type { RoleType } from '@/lib/types/roles.types';
import { getRoleColor, getRoleIcon, getRoleDisplayName } from '@/lib/consts/roles';
import Image from 'next/image';

export interface RoleIconProps {
  role: RoleType;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'both';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function RoleIcon({
  role,
  showText = false,
  size = 'md',
  variant = 'both',
}: RoleIconProps) {
  const color = getRoleColor(role);
  const icon = getRoleIcon(role);
  const displayName = getRoleDisplayName(role);
  const showIcon = variant === 'icon' || variant === 'both';
  const showTextLabel = variant === 'text' || (variant === 'both' && showText);

  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div
          className={cn(
            'relative rounded-full overflow-hidden flex-shrink-0',
            sizeClasses[size]
          )}
        >
          {icon ? (
            <Image
              src={icon}
              alt={role}
              fill
              className="object-cover"
              sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {role[0]}
            </div>
          )}
        </div>
      )}
      {showTextLabel && (
        <span className={cn('font-medium', textSizeClasses[size])} style={{ color }}>
          {displayName}
        </span>
      )}
    </div>
  );
}

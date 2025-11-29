/**
 * ClassIcon Component
 *
 * Displays a WoW class icon with optional text and color coding.
 * Supports both image-based icons and text-only fallback.
 */

import { cn } from '@/lib/utils';
import type { ClassType } from '@/lib/types/classes.types';
import { getClassColor, getClassIcon } from '@/lib/consts/classes';
import Image from 'next/image';

export interface ClassIconProps {
  className: ClassType;
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

export function ClassIcon({
  className,
  showText = false,
  size = 'md',
  variant = 'both',
}: ClassIconProps) {
  const color = getClassColor(className);
  const icon = getClassIcon(className);
  const showIcon = variant === 'icon' || variant === 'both';
  const showTextLabel = variant === 'text' || (variant === 'both' && showText);

  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <div
          className={cn(
            'relative rounded-full overflow-hidden border-2 flex-shrink-0',
            sizeClasses[size]
          )}
          style={{ borderColor: color }}
        >
          {icon ? (
            <Image
              src={icon}
              alt={className}
              fill
              className="object-cover"
              sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {className[0]}
            </div>
          )}
        </div>
      )}
      {showTextLabel && (
        <span className={cn('font-medium', textSizeClasses[size])} style={{ color }}>
          {className}
        </span>
      )}
    </div>
  );
}

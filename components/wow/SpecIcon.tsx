/**
 * SpecIcon Component
 *
 * Displays a WoW specialization icon with optional text.
 * Combines class color with spec icon.
 */

import { cn } from '@/lib/utils';
import type { ClassType } from '@/lib/types/classes.types';
import { getClassColor, getSpecIcon } from '@/lib/consts/classes';
import Image from 'next/image';

export interface SpecIconProps {
  className: ClassType;
  spec: string;
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

export function SpecIcon({
  className,
  spec,
  showText = false,
  size = 'md',
  variant = 'both',
}: SpecIconProps) {
  const color = getClassColor(className);
  const icon = getSpecIcon(className, spec);
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
              alt={`${className} ${spec}`}
              fill
              className="object-cover"
              sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {spec[0]}
            </div>
          )}
        </div>
      )}
      {showTextLabel && (
        <span className={cn('font-medium', textSizeClasses[size])} style={{ color }}>
          {spec}
        </span>
      )}
    </div>
  );
}

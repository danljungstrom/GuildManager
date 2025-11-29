/**
 * ProfessionIcon Component
 *
 * Displays a WoW profession icon with optional skill level and text.
 */

import { cn } from '@/lib/utils';
import type { Profession } from '@/lib/types/professions.types';
import { getProfessionIcon, getProfessionSkillTier } from '@/lib/consts/professions';
import Image from 'next/image';

export interface ProfessionIconProps {
  profession: Profession;
  skill?: number;
  showText?: boolean;
  showSkill?: boolean;
  size?: 'sm' | 'md' | 'lg';
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

export function ProfessionIcon({
  profession,
  skill,
  showText = false,
  showSkill = true,
  size = 'md',
}: ProfessionIconProps) {
  const icon = getProfessionIcon(profession);
  const skillTier = skill !== undefined ? getProfessionSkillTier(skill) : null;

  return (
    <div className="flex items-center gap-2">
      <div className={cn('relative rounded-lg overflow-hidden border-2 border-border flex-shrink-0', sizeClasses[size])}>
        {icon ? (
          <Image
            src={icon}
            alt={profession}
            fill
            className="object-cover"
            sizes={size === 'sm' ? '24px' : size === 'md' ? '32px' : '48px'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-muted">
            {profession[0]}
          </div>
        )}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-medium', textSizeClasses[size])}>{profession}</span>
          {showSkill && skill !== undefined && skillTier && (
            <span
              className="text-xs font-medium"
              style={{ color: skillTier.color }}
            >
              {skill} ({skillTier.label})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

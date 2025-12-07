'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';
import type { LogoShape, LogoFrame, LogoGlow, LogoConfig } from '@/lib/types/guild-config.types';
import { getThemeIcon } from '@/lib/constants/theme-icons';

// Glow options for the UI
export const GLOW_OPTIONS: { value: LogoGlow; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'soft', label: 'Soft' },
  { value: 'medium', label: 'Medium' },
  { value: 'intense', label: 'Intense' },
  { value: 'pulse', label: 'Pulse' },
];

interface LogoPreviewProps {
  config: LogoConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

const FRAME_SIZE_MAP = {
  xs: 'w-8 h-8',
  sm: 'w-14 h-14',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
};

const SHAPE_CLASSES: Record<Exclude<LogoShape, 'none'>, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
};

// Size-scaled shape classes for inner content (smaller radius at smaller sizes)
const SHAPE_CLASSES_SCALED: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', Record<Exclude<LogoShape, 'none'>, string>> = {
  xs: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-sm' },
  sm: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-md' },
  md: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-lg' },
  lg: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-xl' },
  xl: { circle: 'rounded-full', square: 'rounded-none', rounded: 'rounded-2xl' },
};

// Size-scaled padding for icon types (custom images use no padding)
const PADDING_CLASSES: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'p-0.5',
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
  xl: 'p-3',
};

// Glow intensity mapping
const GLOW_STYLES: Record<Exclude<LogoGlow, 'none'>, { blur: number; spread: number; opacity: number }> = {
  soft: { blur: 12, spread: 2, opacity: 0.4 },
  medium: { blur: 18, spread: 4, opacity: 0.55 },
  intense: { blur: 28, spread: 8, opacity: 0.7 },
  pulse: { blur: 20, spread: 5, opacity: 0.5 },
};

// Map frame types to their natural shape (for auto-clipping custom images)
const FRAME_NATURAL_SHAPE: Record<LogoFrame, Exclude<LogoShape, 'none'>> = {
  none: 'circle',
  simple: 'circle',
  ornate: 'circle',
  celtic: 'circle',
  chain: 'circle',
  runic: 'circle',
  thorns: 'circle',
  dragon: 'circle',
};

export function LogoPreview({ config, size = 'lg', className }: LogoPreviewProps) {
  const { type, path, shape = 'none', frame = 'none', iconColor, frameColor, glow = 'none', glowColor, cropSettings } = config;

  if (type === 'none' || !path) {
    return (
      <div
        className={cn(
          FRAME_SIZE_MAP[size],
          'flex items-center justify-center',
          className
        )}
      >
        <div className={cn(SIZE_MAP[size], 'rounded-lg bg-muted flex items-center justify-center text-muted-foreground')}>
          <span className="text-xs">No Logo</span>
        </div>
      </div>
    );
  }

  // Determine icon background color
  const iconBgStyle = iconColor
    ? { backgroundColor: `hsl(${iconColor})` }
    : undefined;
  const iconBgClass = iconColor ? '' : 'bg-primary';

  // Get the correct logo content based on type
  let logoContent: React.ReactNode;

  // Calculate crop transform style (used for both images and icons)
  const getCropTransform = (): React.CSSProperties => {
    if (!cropSettings) return {};
    const translateX = (50 - cropSettings.x) * (cropSettings.zoom - 1) / cropSettings.zoom;
    const translateY = (50 - cropSettings.y) * (cropSettings.zoom - 1) / cropSettings.zoom;
    return {
      transform: `scale(${cropSettings.zoom}) translate(${translateX}%, ${translateY}%)`,
      transformOrigin: `${cropSettings.x}% ${cropSettings.y}%`,
    };
  };

  const cropTransform = getCropTransform();

  if (type === 'theme-icon') {
    // Theme icons from /icons/theme-icons/
    const themeIcon = getThemeIcon(path);
    const iconPath = themeIcon?.svg || `/icons/theme-icons/${path}.svg`;
    logoContent = (
      <div
        className={cn('w-full h-full', iconBgClass)}
        style={{
          ...iconBgStyle,
          ...cropTransform,
          WebkitMask: `url(${iconPath}) center/contain no-repeat`,
          mask: `url(${iconPath}) center/contain no-repeat`,
        }}
      />
    );
  } else if (type === 'library-icon') {
    // Icons from game-icons.net library
    logoContent = (
      <div
        className={cn('w-full h-full', iconBgClass)}
        style={{
          ...iconBgStyle,
          ...cropTransform,
          WebkitMask: `url(/icons/game-icons.net/${path}.svg) center/contain no-repeat`,
          mask: `url(/icons/game-icons.net/${path}.svg) center/contain no-repeat`,
        }}
      />
    );
  } else {
    // Custom uploaded image
    logoContent = (
      <img
        src={path}
        alt="Guild logo"
        className="w-full h-full object-cover"
        style={cropTransform}
      />
    );
  }

  // Use the shape directly - respect user's explicit choice
  // (Previously auto-clipped custom images to frame shape, but this was confusing UX)
  const renderShape = shape;

  // Calculate glow style
  const getGlowStyle = (): React.CSSProperties => {
    if (glow === 'none') return {};

    const glowSettings = GLOW_STYLES[glow];

    // Determine effective glow color:
    // 1. If glowColor is '__theme__' (theme mode): use CSS variable for primary
    // 2. If glowColor is a custom HSL value: use it directly
    // 3. If glowColor is undefined (auto mode): use frameColor if available, else primary
    let effectiveGlowColor: string;

    if (glowColor === THEME_COLOR_MARKER) {
      // Theme mode: use primary color via CSS variable
      effectiveGlowColor = 'hsl(var(--primary))';
    } else if (glowColor) {
      // Custom color mode: use the specified HSL value
      effectiveGlowColor = `hsl(${glowColor})`;
    } else if (frameColor && frameColor !== THEME_COLOR_MARKER) {
      // Auto mode with custom frame color: match the frame
      effectiveGlowColor = `hsl(${frameColor})`;
    } else {
      // Auto mode with no frame or theme frame: use primary
      effectiveGlowColor = 'hsl(var(--primary))';
    }

    // Use modern HSL syntax with opacity - replace the LAST ) to handle CSS variables correctly
    // hsl(41 40% 60%) → hsl(41 40% 60% / 0.5)
    // hsl(var(--primary)) → hsl(var(--primary) / 0.5)
    const shadowColor = effectiveGlowColor.replace(/\)$/, ` / ${glowSettings.opacity})`);

    if (glow === 'pulse') {
      // For pulse, set CSS variable for animation and use lower base blur
      return {
        '--glow-color': effectiveGlowColor,
        filter: `drop-shadow(0 0 ${glowSettings.blur}px ${shadowColor})`,
        animation: 'glow-pulse 2.5s ease-in-out infinite',
      } as React.CSSProperties;
    }

    return {
      filter: `drop-shadow(0 0 ${glowSettings.blur}px ${shadowColor})`,
    };
  };

  const glowStyle = getGlowStyle();
  const glowClass = '';

  // No shape - just the raw icon without container
  if (renderShape === 'none') {
    if (frame === 'none') {
      // Use FRAME_SIZE_MAP for consistent sizing, center the logo inside
      // Glow on outer, clip-path on inner (so glow isn't clipped)
      return (
        <div className={cn(FRAME_SIZE_MAP[size], 'flex items-center justify-center', className)}>
          <div className={cn(SIZE_MAP[size], glowClass)} style={glowStyle}>
            <div className="w-full h-full" style={{ clipPath: 'inset(0)' }}>
              {logoContent}
            </div>
          </div>
        </div>
      );
    }
    // With frame but no shape - clip to frame's natural shape
    // Content can overlap frame decorations but stays within frame bounds
    const frameClipShape = FRAME_NATURAL_SHAPE[frame];
    return (
      <div className={cn(FRAME_SIZE_MAP[size], 'relative', glowClass, className)} style={glowStyle}>
        <LogoFrameComponent frameType={frame} shape="none" frameColor={frameColor}>
          <div
            className={cn(SIZE_MAP[size])}
            style={{ clipPath: getShapeClipPath(frameClipShape) }}
          >
            {logoContent}
          </div>
        </LogoFrameComponent>
      </div>
    );
  }

  // Custom images don't need padding - they should fill to the frame edge
  // Icons need padding because the background color shows through the mask
  const needsPadding = type !== 'custom-image';
  const paddingClass = needsPadding ? PADDING_CLASSES[size] : '';
  const scaledShapeClass = SHAPE_CLASSES_SCALED[size][renderShape];

  // With shape but no frame - just clip to shape, no background
  if (frame === 'none') {
    return (
      <div className={cn(FRAME_SIZE_MAP[size], 'flex items-center justify-center', className)}>
        <div className={cn(SIZE_MAP[size], glowClass)} style={glowStyle}>
          {/* Clip to shape without adding background */}
          <div
            className={cn('w-full h-full', paddingClass)}
            style={{ clipPath: getShapeClipPath(renderShape) }}
          >
            {logoContent}
          </div>
        </div>
      </div>
    );
  }

  // Simple frame - outline on content
  if (frame === 'simple') {
    const isThemeColor = frameColor === THEME_COLOR_MARKER;
    const outlineColorStyle = isThemeColor
      ? 'hsl(var(--primary))'
      : frameColor
        ? `hsl(${frameColor})`
        : 'hsl(var(--foreground) / 0.2)';

    return (
      <div className={cn(FRAME_SIZE_MAP[size], 'flex items-center justify-center', className)}>
        <div
          className={cn(SIZE_MAP[size], glowClass)}
          style={{
            ...glowStyle,
            outline: `4px solid ${outlineColorStyle}`,
            outlineOffset: '-4px',
            borderRadius: renderShape === 'circle' ? '50%' : renderShape === 'rounded' ? '0.75rem' : '0',
          }}
        >
          <div
            className={cn('w-full h-full', paddingClass)}
            style={{ clipPath: getShapeClipPath(renderShape) }}
          >
            {logoContent}
          </div>
        </div>
      </div>
    );
  }

  // Decorative frames (ornate, celtic, etc.) - wrap in decorative container
  return (
    <div className={cn(FRAME_SIZE_MAP[size], 'relative', glowClass, className)} style={glowStyle}>
      <LogoFrameComponent frameType={frame} shape={renderShape} frameColor={frameColor}>
        <div
          className={cn(SIZE_MAP[size], paddingClass)}
          style={{ clipPath: getShapeClipPath(renderShape) }}
        >
          {logoContent}
        </div>
      </LogoFrameComponent>
    </div>
  );
}

// Helper to get clip-path for each shape
function getShapeClipPath(shape: LogoShape): string {
  switch (shape) {
    case 'circle':
      return 'circle(50% at 50% 50%)';
    case 'rounded':
      return 'inset(0 round 12px)';
    case 'square':
      return 'inset(0)';
    case 'none':
    default:
      return 'inset(0)';
  }
}

// Frame wrapper component
interface LogoFrameComponentProps {
  frameType: LogoFrame;
  shape: LogoShape;
  frameColor?: string;
  children: React.ReactNode;
}

// Special marker for theme color
export const THEME_COLOR_MARKER = '__theme__';

function LogoFrameComponent({ frameType, shape, frameColor, children }: LogoFrameComponentProps) {
  // Generate unique IDs for SVG patterns
  const patternId = useId();

  // For frames with solid backgrounds (ornate, runic, dragon), use circle shape when shape is 'none'
  // to properly display the frame without filling the entire area
  const effectiveShape = shape === 'none' ? 'circle' : shape;
  const hasNoBackground = shape === 'none';

  const frameClasses = cn(
    'absolute inset-0 flex items-center justify-center',
    effectiveShape === 'circle' && 'rounded-full',
    effectiveShape === 'rounded' && 'rounded-2xl',
  );

  // Use custom color, theme color, or default (undefined)
  // __theme__ means use the theme's primary color
  const isThemeColor = frameColor === THEME_COLOR_MARKER;
  const colorStyle = isThemeColor
    ? 'hsl(var(--primary))'
    : frameColor
      ? `hsl(${frameColor})`
      : undefined;

  switch (frameType) {
    case 'simple':
      return (
        <div
          className={cn(frameClasses, 'border-4')}
          style={{ borderColor: colorStyle || 'hsl(var(--foreground) / 0.2)' }}
        >
          {children}
        </div>
      );

    case 'ornate':
      return (
        <div className={cn(frameClasses, 'p-1')}>
          {/* Decorative gradient ring */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`ornate-ring-${patternId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorStyle || '#fcd34d'} />
                <stop offset="50%" stopColor={colorStyle || '#eab308'} />
                <stop offset="100%" stopColor={colorStyle || '#d97706'} />
              </linearGradient>
            </defs>
            {/* Outer ring - shape-aware */}
            {effectiveShape === 'circle' ? (
              <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#ornate-ring-${patternId})`} strokeWidth="6" />
            ) : (
              <rect x="4" y="4" width="92" height="92" rx={effectiveShape === 'rounded' ? 12 : 0} fill="none" stroke={`url(#ornate-ring-${patternId})`} strokeWidth="6" />
            )}
            {/* Corner flourishes - only for circle shape */}
            {effectiveShape === 'circle' && (
              <g fill="none" stroke={colorStyle || '#eab308'} strokeWidth="1.5" opacity="0.8">
                <path d="M20,8 Q14,14 8,20" />
                <path d="M80,8 Q86,14 92,20" />
                <path d="M20,92 Q14,86 8,80" />
                <path d="M80,92 Q86,86 92,80" />
              </g>
            )}
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    case 'celtic':
      return (
        <div className={cn(frameClasses, 'p-1')}>
          {/* Celtic knot border using CSS */}
          <div
            className={cn(
              'absolute inset-0',
              effectiveShape === 'circle' && 'rounded-full',
              effectiveShape === 'rounded' && 'rounded-2xl',
            )}
            style={{
              border: `4px double ${colorStyle || '#059669'}`,
              boxShadow: `inset 0 0 0 2px ${colorStyle || '#059669'}40`,
            }}
          />
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 100 100">
            <defs>
              <pattern id={`celtic-${patternId}`} patternUnits="userSpaceOnUse" width="12" height="12">
                <path
                  d="M0,6 Q3,3 6,6 T12,6"
                  fill="none"
                  stroke={colorStyle || '#059669'}
                  strokeWidth="1.5"
                />
                <path
                  d="M6,0 Q9,3 6,6 T6,12"
                  fill="none"
                  stroke={colorStyle || '#059669'}
                  strokeWidth="1.5"
                />
              </pattern>
            </defs>
            {effectiveShape === 'circle' ? (
              <circle cx="50" cy="50" r="44" fill="none" stroke={`url(#celtic-${patternId})`} strokeWidth="8" />
            ) : (
              <rect x="6" y="6" width="88" height="88" rx={effectiveShape === 'rounded' ? 10 : 0} fill="none" stroke={`url(#celtic-${patternId})`} strokeWidth="8" />
            )}
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    case 'chain':
      return (
        <div className={cn(frameClasses, 'p-2')}>
          {/* Chain border */}
          <div
            className={cn(
              'absolute inset-1',
              effectiveShape === 'circle' && 'rounded-full',
              effectiveShape === 'rounded' && 'rounded-xl',
            )}
            style={{
              border: `3px solid ${colorStyle || '#71717a'}`,
            }}
          />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              {/* Ellipse links for circle, rectangular links for square/rounded */}
              {effectiveShape === 'circle' ? (
                <pattern id={`chain-${patternId}`} patternUnits="userSpaceOnUse" width="10" height="10">
                  <ellipse cx="5" cy="5" rx="4" ry="2.5" fill="none" stroke={colorStyle || '#a1a1aa'} strokeWidth="2" />
                </pattern>
              ) : (
                <pattern id={`chain-${patternId}`} patternUnits="userSpaceOnUse" width="12" height="12">
                  <rect x="2" y="4" width="8" height="4" rx="1" fill="none" stroke={colorStyle || '#a1a1aa'} strokeWidth="1.5" />
                </pattern>
              )}
            </defs>
            {effectiveShape === 'circle' ? (
              <circle cx="50" cy="50" r="45" fill="none" stroke={`url(#chain-${patternId})`} strokeWidth="10" />
            ) : (
              <rect x="5" y="5" width="90" height="90" rx={effectiveShape === 'rounded' ? 8 : 0} fill="none" stroke={`url(#chain-${patternId})`} strokeWidth="10" />
            )}
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    case 'runic':
      return (
        <div className={cn(frameClasses, 'p-1')}>
          {/* Decorative gradient ring with runes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`runic-ring-${patternId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorStyle || '#1e3a8a'} />
                <stop offset="50%" stopColor={colorStyle || '#4338ca'} />
                <stop offset="100%" stopColor={colorStyle || '#6b21a8'} />
              </linearGradient>
            </defs>
            {/* Outer gradient ring - shape-aware */}
            {effectiveShape === 'circle' ? (
              <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#runic-ring-${patternId})`} strokeWidth="6" />
            ) : (
              <rect x="4" y="4" width="92" height="92" rx={effectiveShape === 'rounded' ? 12 : 0} fill="none" stroke={`url(#runic-ring-${patternId})`} strokeWidth="6" />
            )}
            {/* Runes around the frame - use white when custom color for contrast */}
            <text x="50" y="9" textAnchor="middle" fill={colorStyle ? 'white' : '#93c5fd'} fontSize="7" fontWeight="bold">ᚠᚢᚦᚨᚱᚲ</text>
            <text x="50" y="97" textAnchor="middle" fill={colorStyle ? 'white' : '#93c5fd'} fontSize="7" fontWeight="bold">ᚷᚹᚺᚾᛁᛃ</text>
            <text x="6" y="54" textAnchor="middle" fill={colorStyle ? 'white' : '#93c5fd'} fontSize="7" fontWeight="bold" transform="rotate(-90 6 50)">ᛇᛈᛉᛊ</text>
            <text x="94" y="54" textAnchor="middle" fill={colorStyle ? 'white' : '#93c5fd'} fontSize="7" fontWeight="bold" transform="rotate(90 94 50)">ᛏᛒᛖᛗ</text>
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    case 'thorns':
      return (
        <div className={cn(frameClasses, 'p-2')}>
          {/* Thorny vine border */}
          <div
            className={cn(
              'absolute inset-2',
              effectiveShape === 'circle' && 'rounded-full',
              effectiveShape === 'rounded' && 'rounded-lg',
            )}
            style={{
              border: `2px solid ${colorStyle || '#9f1239'}`,
              boxShadow: `0 0 10px ${colorStyle || '#881337'}40`,
            }}
          />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id={`thorns-${patternId}`} patternUnits="userSpaceOnUse" width="14" height="14">
                <path
                  d="M7,0 L9,5 L14,7 L9,9 L7,14 L5,9 L0,7 L5,5 Z"
                  fill={colorStyle || '#881337'}
                />
                <path
                  d="M7,3 Q9,7 7,11"
                  fill="none"
                  stroke={colorStyle || '#9f1239'}
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            {effectiveShape === 'circle' ? (
              <circle cx="50" cy="50" r="44" fill="none" stroke={`url(#thorns-${patternId})`} strokeWidth="12" />
            ) : (
              <rect x="6" y="6" width="88" height="88" rx={effectiveShape === 'rounded' ? 8 : 0} fill="none" stroke={`url(#thorns-${patternId})`} strokeWidth="12" />
            )}
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    case 'dragon':
      return (
        <div className={cn(frameClasses, 'p-1')}>
          {/* Decorative dragon ring with scales and motifs */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`dragon-ring-grad-${patternId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorStyle || '#7f1d1d'} />
                <stop offset="50%" stopColor={colorStyle || '#991b1b'} />
                <stop offset="100%" stopColor={colorStyle || '#b91c1c'} />
              </linearGradient>
              <pattern id={`dragon-scales-ring-${patternId}`} patternUnits="userSpaceOnUse" width="10" height="8">
                <path
                  d="M0,8 Q5,4 10,8"
                  fill="none"
                  stroke={colorStyle ? 'rgba(255,255,255,0.4)' : '#fca5a5'}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            {/* Outer gradient ring - shape-aware */}
            {effectiveShape === 'circle' ? (
              <>
                <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#dragon-ring-grad-${patternId})`} strokeWidth="6" />
                <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#dragon-scales-ring-${patternId})`} strokeWidth="6" />
              </>
            ) : (
              <>
                <rect x="4" y="4" width="92" height="92" rx={effectiveShape === 'rounded' ? 12 : 0} fill="none" stroke={`url(#dragon-ring-grad-${patternId})`} strokeWidth="6" />
                <rect x="4" y="4" width="92" height="92" rx={effectiveShape === 'rounded' ? 12 : 0} fill="none" stroke={`url(#dragon-scales-ring-${patternId})`} strokeWidth="6" />
              </>
            )}
            {/* Corner dragon motifs - only for circle shape */}
            {effectiveShape === 'circle' && (
              <g fill={colorStyle ? 'rgba(255,255,255,0.6)' : '#fca5a5'}>
                <path d="M15,10 Q20,15 15,20 Q10,15 15,10" />
                <path d="M85,10 Q90,15 85,20 Q80,15 85,10" />
                <path d="M15,80 Q20,85 15,90 Q10,85 15,80" />
                <path d="M85,80 Q90,85 85,90 Q80,85 85,80" />
              </g>
            )}
          </svg>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      );

    default:
      return <>{children}</>;
  }
}

// Export frame options for selection UI
export const FRAME_OPTIONS: { value: LogoFrame; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No decorative frame' },
  { value: 'simple', label: 'Simple', description: 'Clean border' },
  { value: 'ornate', label: 'Ornate', description: 'Layered gradient' },
  { value: 'celtic', label: 'Celtic', description: 'Woven knot pattern' },
  { value: 'chain', label: 'Chain', description: 'Metal chain links' },
  { value: 'runic', label: 'Runic', description: 'Ancient rune symbols' },
  { value: 'thorns', label: 'Thorns', description: 'Dark vine thorns' },
  { value: 'dragon', label: 'Dragon', description: 'Dragon scale pattern' },
];

export const SHAPE_OPTIONS: { value: LogoShape; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No background' },
  { value: 'circle', label: 'Circle', description: 'Circular background' },
  { value: 'square', label: 'Square', description: 'Square background' },
  { value: 'rounded', label: 'Rounded', description: 'Rounded corners' },
];

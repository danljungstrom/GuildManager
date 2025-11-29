/**
 * Theme Icons
 *
 * SVG icons for each theme preset used in guild branding and theme selection.
 * Each icon is designed to represent the theme's identity and uses the theme's primary color.
 */

export interface ThemeIcon {
  id: string;
  name: string;
  svg: string; // Inline SVG markup
}

/**
 * Theme icon definitions
 * All icons are 64x64px viewBox, scalable SVG
 */
export const THEME_ICONS: Record<string, ThemeIcon> = {
  gold: {
    id: 'gold',
    name: 'Gold',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 40L16 16L24 24L32 8L40 24L48 16L56 40H8Z" fill="hsl(41 40% 60%)" stroke="hsl(41 50% 50%)" stroke-width="2"/>
      <rect x="8" y="40" width="48" height="12" rx="2" fill="hsl(41 50% 50%)" stroke="hsl(41 60% 40%)" stroke-width="2"/>
      <circle cx="16" cy="46" r="2.5" fill="hsl(41 70% 70%)"/>
      <circle cx="32" cy="46" r="2.5" fill="hsl(41 70% 70%)"/>
      <circle cx="48" cy="46" r="2.5" fill="hsl(41 70% 70%)"/>
      <path d="M18 40L20 32L22 40" stroke="hsl(41 60% 40%)" stroke-width="1.5" fill="none"/>
      <path d="M30 40L32 32L34 40" stroke="hsl(41 60% 40%)" stroke-width="1.5" fill="none"/>
      <path d="M42 40L44 32L46 40" stroke="hsl(41 60% 40%)" stroke-width="1.5" fill="none"/>
    </svg>`,
  },

  horde: {
    id: 'horde',
    name: 'Horde',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L28 20H20L16 32L20 44H28L32 56L36 44H44L48 32L44 20H36L32 8Z" fill="hsl(0 72% 51%)" stroke="hsl(0 85% 40%)" stroke-width="2"/>
      <circle cx="32" cy="32" r="8" fill="hsl(0 85% 40%)" stroke="hsl(0 95% 30%)" stroke-width="2"/>
      <path d="M32 24V40M24 32H40" stroke="hsl(0 0% 100%)" stroke-width="2" stroke-linecap="round"/>
      <path d="M20 20L16 16M44 20L48 16M20 44L16 48M44 44L48 48" stroke="hsl(0 85% 40%)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  },

  alliance: {
    id: 'alliance',
    name: 'Alliance',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L12 28V48L32 56L52 48V28L32 8Z" fill="hsl(213 94% 46%)" stroke="hsl(213 94% 35%)" stroke-width="2"/>
      <path d="M32 16L20 28V44L32 50L44 44V28L32 16Z" fill="hsl(217 91% 60%)" stroke="hsl(213 94% 35%)" stroke-width="1.5"/>
      <circle cx="32" cy="32" r="6" fill="hsl(41 70% 70%)" stroke="hsl(41 80% 60%)" stroke-width="1.5"/>
      <path d="M32 8V16M32 48V56M12 28L20 28M52 28L44 28M12 48L20 44M52 48L44 44" stroke="hsl(213 94% 35%)" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },

  shadow: {
    id: 'shadow',
    name: 'Shadow',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 10C32 10 20 16 20 28C20 34 24 38 24 44C24 50 20 54 20 54C20 54 28 52 32 52C36 52 44 54 44 54C44 54 40 50 40 44C40 38 44 34 44 28C44 16 32 10 32 10Z" fill="hsl(271 81% 56%)" stroke="hsl(271 91% 45%)" stroke-width="2"/>
      <ellipse cx="26" cy="24" rx="3" ry="4" fill="hsl(271 91% 75%)"/>
      <ellipse cx="38" cy="24" rx="3" ry="4" fill="hsl(271 91% 75%)"/>
      <path d="M32 32C32 32 28 36 24 36M32 32C32 32 36 36 40 36" stroke="hsl(271 91% 45%)" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 20C14 22 12 26 12 26M48 20C50 22 52 26 52 26M16 36C14 38 12 42 12 42M48 36C50 38 52 42 52 42" stroke="hsl(271 81% 56%)" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    </svg>`,
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="20" rx="14" ry="12" fill="hsl(142 71% 45%)" stroke="hsl(142 76% 36%)" stroke-width="2"/>
      <ellipse cx="20" cy="32" rx="12" ry="10" fill="hsl(142 71% 45%)" stroke="hsl(142 76% 36%)" stroke-width="2"/>
      <ellipse cx="44" cy="32" rx="12" ry="10" fill="hsl(142 71% 45%)" stroke="hsl(142 76% 36%)" stroke-width="2"/>
      <ellipse cx="32" cy="42" rx="10" ry="8" fill="hsl(142 71% 45%)" stroke="hsl(142 76% 36%)" stroke-width="2"/>
      <rect x="30" y="42" width="4" height="14" rx="1" fill="hsl(30 40% 35%)" stroke="hsl(30 50% 25%)" stroke-width="1.5"/>
      <path d="M32 48L28 52M32 48L36 52" stroke="hsl(30 40% 35%)" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="25" cy="22" r="1.5" fill="hsl(142 90% 65%)" opacity="0.8"/>
      <circle cx="32" cy="18" r="1.5" fill="hsl(142 90% 65%)" opacity="0.8"/>
      <circle cx="39" cy="24" r="1.5" fill="hsl(142 90% 65%)" opacity="0.8"/>
    </svg>`,
  },

  frost: {
    id: 'frost',
    name: 'Frost',
    svg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8V56M8 32H56" stroke="hsl(199 89% 48%)" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 16L48 48M48 16L16 48" stroke="hsl(199 89% 48%)" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="6" fill="hsl(199 89% 60%)" stroke="hsl(199 89% 48%)" stroke-width="2"/>
      <circle cx="32" cy="12" r="4" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="32" cy="52" r="4" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="12" cy="32" r="4" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="52" cy="32" r="4" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="3" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="44" cy="20" r="3" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="20" cy="44" r="3" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
      <circle cx="44" cy="44" r="3" fill="hsl(199 89% 70%)" stroke="hsl(199 89% 60%)" stroke-width="1.5"/>
    </svg>`,
  },
};

/**
 * Get a theme icon by ID
 */
export function getThemeIcon(id: string): ThemeIcon | undefined {
  return THEME_ICONS[id];
}

/**
 * Get all theme icons as an array
 */
export function getAllThemeIcons(): ThemeIcon[] {
  return Object.values(THEME_ICONS);
}

/**
 * Check if a theme has an icon
 */
export function hasThemeIcon(id: string): boolean {
  return id in THEME_ICONS;
}

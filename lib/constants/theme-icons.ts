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
  spartan: {
    id: 'spartan',
    name: 'Spartan',
    svg: '/icons/theme-icons/spartan.svg',
  },

  horde: {
    id: 'horde',
    name: 'Horde',
    svg: '/icons/theme-icons/horde.svg',
  },

  alliance: {
    id: 'alliance',
    name: 'Alliance',
    svg: '/icons/theme-icons/alliance.svg',
  },

  shadow: {
    id: 'shadow',
    name: 'Shadow',
    svg: '/icons/theme-icons/shadow.svg',
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    svg: '/icons/theme-icons/hops.svg',
  },

  frost: {
    id: 'frost',
    name: 'Frost',
    svg: '/icons/theme-icons/frostfire.svg',
  },

  holy: {
    id: 'holy',
    name: 'Holy',
    svg: '/icons/game-icons.net/lorc/spiked-halo.svg',
  },

  ember: {
    id: 'ember',
    name: 'Ember',
    svg: '/icons/game-icons.net/lorc/burning-embers.svg',
  },

  custom: {
    id: 'custom',
    name: 'Bland',
    svg: '/icons/game-icons.net/lorc/crystal-shine.svg',
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

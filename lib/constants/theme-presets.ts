import { ThemeColors, ThemeTypography } from '@/lib/types/guild-config.types';

/**
 * Theme Preset Definition
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography;
}

/**
 * Predefined Theme Presets
 *
 * These presets provide quick setup options for guilds.
 * All colors are in HSL format: "hue saturation% lightness%"
 */
export const THEME_PRESETS: Record<string, ThemePreset> = {
  spartan: {
    id: 'spartan',
    name: 'Spartan',
    description: 'Warm gold and bronze tones reminiscent of legendary loot',
    colors: {
      light: {
        primary: '41 40% 60%',
        primaryForeground: '20 14.3% 4.1%',
        secondary: '24 9.8% 10%',
        secondaryForeground: '60 9.1% 97.8%',
        accent: '41 40% 60%',
        accentForeground: '20 14.3% 4.1%',
        background: '0 0% 100%',
        foreground: '20 14.3% 4.1%',
        card: '0 0% 100%',
        cardForeground: '20 14.3% 4.1%',
        muted: '60 4.8% 95.9%',
        mutedForeground: '25 5.3% 44.7%',
        border: '20 5.9% 90%',
        input: '20 5.9% 90%',
        ring: '41 40% 60%',
      },
      dark: {
        primary: '41 40% 60%',
        primaryForeground: '20 14.3% 4.1%',
        secondary: '12 6.5% 15.1%',
        secondaryForeground: '60 9.1% 97.8%',
        accent: '12 6.5% 15.1%',
        accentForeground: '60 9.1% 97.8%',
        background: '20 14.3% 4.1%',
        foreground: '60 9.1% 97.8%',
        card: '20 14.3% 4.1%',
        cardForeground: '60 9.1% 97.8%',
        muted: '12 6.5% 15.1%',
        mutedForeground: '24 5.4% 63.9%',
        border: '12 6.5% 15.1%',
        input: '12 6.5% 15.1%',
        ring: '41 40% 60%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-spartan)',
      bodyFont: 'var(--font-body)',
    },
  },

  shadow: {
    id: 'shadow',
    name: 'Shadow',
    description: 'Dark mystical purple for warlocks and shadow priests',
    colors: {
      light: {
        primary: '271 81% 56%',
        primaryForeground: '0 0% 100%',
        secondary: '270 8% 94%',
        secondaryForeground: '270 10% 11%',
        accent: '271 91% 65%',
        accentForeground: '0 0% 100%',
        background: '270 10% 98%',
        foreground: '270 10% 11%',
        card: '0 0% 100%',
        cardForeground: '270 10% 11%',
        muted: '270 8% 93%',
        mutedForeground: '270 5% 45%',
        border: '270 10% 87%',
        input: '270 10% 87%',
        ring: '271 81% 56%',
      },
      dark: {
        primary: '271 81% 56%',
        primaryForeground: '0 0% 100%',
        secondary: '270 15% 19%',
        secondaryForeground: '270 5% 98%',
        accent: '271 91% 65%',
        accentForeground: '0 0% 100%',
        background: '270 15% 4.1%',
        foreground: '270 9.1% 97.8%',
        card: '270 15% 4.1%',
        cardForeground: '270 5% 98%',
        muted: '270 15% 19%',
        mutedForeground: '270 5% 64%',
        border: '270 15% 23%',
        input: '270 15% 23%',
        ring: '271 81% 56%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-shadow)',
      bodyFont: 'var(--font-body)',
    },
  },

  horde: {
    id: 'horde',
    name: 'Horde',
    description: 'Bold crimson for the glory of the Horde',
    colors: {
      light: {
        primary: '0 72% 51%',
        primaryForeground: '0 0% 100%',
        secondary: '0 5% 94%',
        secondaryForeground: '0 0% 9%',
        accent: '0 84% 60%',
        accentForeground: '0 0% 100%',
        background: '0 0% 98%',
        foreground: '0 0% 9%',
        card: '0 0% 100%',
        cardForeground: '0 0% 9%',
        muted: '0 5% 93%',
        mutedForeground: '0 0% 45%',
        border: '0 12% 88%',
        input: '0 12% 88%',
        ring: '0 72% 51%',
      },
      dark: {
        primary: '0 72% 51%',
        primaryForeground: '0 0% 100%',
        secondary: '0 8% 18%',
        secondaryForeground: '0 0% 98%',
        accent: '0 84% 60%',
        accentForeground: '0 0% 100%',
        background: '0 5% 8%',
        foreground: '0 0% 98%',
        card: '0 5% 8%',
        cardForeground: '0 0% 98%',
        muted: '0 8% 18%',
        mutedForeground: '0 0% 64%',
        border: '0 8% 22%',
        input: '0 8% 22%',
        ring: '0 72% 51%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-horde)',
      bodyFont: 'var(--font-body)',
    },
  },

  alliance: {
    id: 'alliance',
    name: 'Alliance',
    description: 'Noble blue and gold for the Alliance',
    colors: {
      light: {
        primary: '213 94% 46%',
        primaryForeground: '0 0% 100%',
        secondary: '210 40% 94%',
        secondaryForeground: '222 47% 11%',
        accent: '217 91% 60%',
        accentForeground: '0 0% 100%',
        background: '210 40% 98%',
        foreground: '222 47% 11%',
        card: '0 0% 100%',
        cardForeground: '222 47% 11%',
        muted: '210 40% 93%',
        mutedForeground: '215 16% 47%',
        border: '214 32% 87%',
        input: '214 32% 87%',
        ring: '213 94% 46%',
      },
      dark: {
        primary: '217 91% 60%',
        primaryForeground: '222 47% 11%',
        secondary: '217 33% 20%',
        secondaryForeground: '210 40% 98%',
        accent: '217 91% 60%',
        accentForeground: '222 47% 11%',
        background: '222 47% 8%',
        foreground: '210 40% 98%',
        card: '222 47% 8%',
        cardForeground: '210 40% 98%',
        muted: '217 33% 20%',
        mutedForeground: '215 20% 65%',
        border: '217 30% 24%',
        input: '217 30% 24%',
        ring: '217 91% 60%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-alliance)',
      bodyFont: 'var(--font-body)',
    },
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy green tones for druids and nature lovers',
    colors: {
      light: {
        primary: '142 71% 45%',
        primaryForeground: '0 0% 100%',
        secondary: '138 15% 94%',
        secondaryForeground: '140 10% 11%',
        accent: '142 76% 36%',
        accentForeground: '0 0% 100%',
        background: '138 20% 98%',
        foreground: '140 10% 11%',
        card: '0 0% 100%',
        cardForeground: '140 10% 11%',
        muted: '138 15% 93%',
        mutedForeground: '140 5% 45%',
        border: '140 10% 87%',
        input: '140 10% 87%',
        ring: '142 71% 45%',
      },
      dark: {
        primary: '142 71% 45%',
        primaryForeground: '0 0% 100%',
        secondary: '140 15% 19%',
        secondaryForeground: '138 13% 98%',
        accent: '142 76% 36%',
        accentForeground: '0 0% 100%',
        background: '140 15% 8%',
        foreground: '138 13% 98%',
        card: '140 15% 8%',
        cardForeground: '138 13% 98%',
        muted: '140 15% 19%',
        mutedForeground: '140 5% 64%',
        border: '140 15% 23%',
        input: '140 15% 23%',
        ring: '142 71% 45%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-nature)',
      bodyFont: 'var(--font-body)',
    },
  },

  frost: {
    id: 'frost',
    name: 'Frost',
    description: 'Cool icy blue for mages and death knights',
    colors: {
      light: {
        primary: '199 89% 48%',
        primaryForeground: '0 0% 100%',
        secondary: '200 20% 94%',
        secondaryForeground: '200 15% 11%',
        accent: '199 89% 60%',
        accentForeground: '0 0% 100%',
        background: '200 25% 98%',
        foreground: '200 15% 11%',
        card: '0 0% 100%',
        cardForeground: '200 15% 11%',
        muted: '200 20% 93%',
        mutedForeground: '200 8% 45%',
        border: '200 18% 87%',
        input: '200 18% 87%',
        ring: '199 89% 48%',
      },
      dark: {
        primary: '199 89% 48%',
        primaryForeground: '0 0% 100%',
        secondary: '200 20% 19%',
        secondaryForeground: '200 18% 98%',
        accent: '199 89% 60%',
        accentForeground: '0 0% 100%',
        background: '200 20% 8%',
        foreground: '200 18% 98%',
        card: '200 20% 8%',
        cardForeground: '200 18% 98%',
        muted: '200 20% 19%',
        mutedForeground: '200 8% 64%',
        border: '200 20% 23%',
        input: '200 20% 23%',
        ring: '199 89% 48%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-frost)',
      bodyFont: 'var(--font-body)',
    },
  },

  holy: {
    id: 'holy',
    name: 'Holy',
    description: 'Radiant light for paladins and priests',
    colors: {
      light: {
        primary: '45 93% 58%',
        primaryForeground: '30 15% 12%',
        secondary: '40 20% 94%',
        secondaryForeground: '35 12% 11%',
        accent: '45 100% 65%',
        accentForeground: '30 15% 12%',
        background: '40 30% 98%',
        foreground: '35 12% 11%',
        card: '40 40% 99%',
        cardForeground: '35 12% 11%',
        muted: '40 20% 93%',
        mutedForeground: '35 8% 45%',
        border: '40 18% 87%',
        input: '40 18% 87%',
        ring: '45 93% 58%',
      },
      dark: {
        primary: '45 93% 58%',
        primaryForeground: '30 15% 12%',
        secondary: '35 15% 16%',
        secondaryForeground: '40 15% 98%',
        accent: '45 100% 65%',
        accentForeground: '30 15% 12%',
        background: '35 15% 7%',
        foreground: '40 15% 98%',
        card: '35 15% 7%',
        cardForeground: '40 15% 98%',
        muted: '35 15% 16%',
        mutedForeground: '40 8% 64%',
        border: '35 15% 20%',
        input: '35 15% 20%',
        ring: '45 93% 58%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-holy)',
      bodyFont: 'var(--font-body)',
    },
  },

  ember: {
    id: 'ember',
    name: 'Ember',
    description: 'Warm orange glow for fire mages and destruction',
    colors: {
      light: {
        primary: '25 95% 53%',
        primaryForeground: '0 0% 100%',
        secondary: '20 15% 94%',
        secondaryForeground: '15 12% 11%',
        accent: '30 100% 60%',
        accentForeground: '0 0% 100%',
        background: '20 20% 98%',
        foreground: '15 12% 11%',
        card: '0 0% 100%',
        cardForeground: '15 12% 11%',
        muted: '20 15% 93%',
        mutedForeground: '15 8% 45%',
        border: '20 12% 87%',
        input: '20 12% 87%',
        ring: '25 95% 53%',
      },
      dark: {
        primary: '25 95% 53%',
        primaryForeground: '0 0% 100%',
        secondary: '15 18% 16%',
        secondaryForeground: '20 15% 98%',
        accent: '30 100% 60%',
        accentForeground: '0 0% 100%',
        background: '15 18% 7%',
        foreground: '20 15% 98%',
        card: '15 18% 7%',
        cardForeground: '20 15% 98%',
        muted: '15 18% 16%',
        mutedForeground: '20 8% 64%',
        border: '15 18% 20%',
        input: '15 18% 20%',
        ring: '25 95% 53%',
      },
    },
    typography: {
      headingFont: 'var(--font-heading-ember)',
      bodyFont: 'var(--font-body)',
    },
  },
};

/**
 * Get a theme preset by ID
 */
export function getThemePreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS[id];
}

/**
 * Get all theme presets as an array
 */
export function getAllThemePresets(): ThemePreset[] {
  return Object.values(THEME_PRESETS);
}

/**
 * Get the default theme preset (Spartan/Gold)
 */
export function getDefaultThemePreset(): ThemePreset {
  return THEME_PRESETS.spartan;
}

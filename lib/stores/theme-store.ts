import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemePreset } from '@/lib/constants/theme-presets';
import { getThemePreset } from '@/lib/constants/theme-presets';

/**
 * Darken an HSL color by reducing its lightness
 * @param hsl - HSL string like "220 9% 8%"
 * @param amount - Amount to reduce lightness (0-1, e.g., 0.3 = 30% darker)
 */
function darkenHsl(hsl: string, amount: number = 0.3): string {
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return hsl;

  const h = parts[0];
  const s = parts[1];
  const lValue = parseFloat(parts[2].replace('%', ''));

  // Reduce lightness, but don't go below 2%
  const newL = Math.max(2, lValue * (1 - amount));

  return `${h} ${s} ${newL.toFixed(1)}%`;
}

interface ThemeStore {
  activePresetId: string;
  sidebarColor: string | null;
  setActivePreset: (presetId: string) => void;
  setSidebarColor: (color: string) => void;
  applyPreset: (preset: ThemePreset) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      activePresetId: 'spartan',
      sidebarColor: null,

      setActivePreset: (presetId: string) => {
        set({ activePresetId: presetId });
      },

      setSidebarColor: (color: string) => {
        set({ sidebarColor: color });
        document.documentElement.style.setProperty('--sidebar-background', color);
      },

      applyPreset: (preset: ThemePreset) => {
        // Determine if we're in dark mode
        const isDark = document.documentElement.classList.contains('dark');
        const colors = isDark ? preset.colors.dark : preset.colors.light;

        // Apply color variables
        Object.entries(colors).forEach(([key, value]) => {
          const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          document.documentElement.style.setProperty(cssVarName, value);
        });

        // Apply typography (font) variables
        if (preset.typography) {
          document.documentElement.style.setProperty('--font-heading', preset.typography.headingFont);
        }

        // Calculate and apply a darker sidebar color (30% darker than background)
        const sidebarColor = darkenHsl(colors.background, 0.3);
        document.documentElement.style.setProperty('--sidebar-background', sidebarColor);
        set({ activePresetId: preset.id, sidebarColor });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

/**
 * Apply the currently stored theme on page load
 * Call this in a useEffect on app initialization
 */
export function applyStoredTheme() {
  const { activePresetId, sidebarColor, applyPreset } = useThemeStore.getState();
  const preset = getThemePreset(activePresetId);

  if (preset) {
    applyPreset(preset);
  }

  // If there's a custom sidebar color stored, apply it (overrides preset default)
  if (sidebarColor) {
    document.documentElement.style.setProperty('--sidebar-background', sidebarColor);
  }
}

/**
 * Export the darken function for use in other components
 */
export { darkenHsl };

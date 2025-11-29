import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemePreset } from '@/lib/constants/theme-presets';
import { getThemePreset } from '@/lib/constants/theme-presets';

interface ThemeStore {
  activePresetId: string;
  setActivePreset: (presetId: string) => void;
  applyPreset: (preset: ThemePreset) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      activePresetId: 'spartan',

      setActivePreset: (presetId: string) => {
        set({ activePresetId: presetId });
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

        // Update the active preset ID
        set({ activePresetId: preset.id });
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
  const { activePresetId, applyPreset } = useThemeStore.getState();
  const preset = getThemePreset(activePresetId);

  if (preset) {
    applyPreset(preset);
  }
}

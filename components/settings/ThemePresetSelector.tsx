'use client';

import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoPreview } from '@/components/logo';
import type { ThemePreset } from '@/lib/constants/theme-presets';
import type { SavedCustomTheme } from '@/lib/types/guild-config.types';
import { getThemeIcon } from '@/lib/constants/theme-icons';

interface ThemePresetSelectorProps {
  /** Available theme presets */
  presets: ThemePreset[];
  /** Currently active preset ID */
  activePresetId: string;
  /** Currently active custom theme ID (if any) */
  activeCustomThemeId: string | null;
  /** User's saved custom themes */
  savedCustomThemes: SavedCustomTheme[];
  /** Callback when a preset is selected */
  onPresetSelect: (preset: ThemePreset) => void;
  /** Callback when the bland/custom preset is selected */
  onBlandSelect: () => void;
  /** Callback when a saved custom theme is selected */
  onCustomThemeSelect: (theme: SavedCustomTheme) => void;
  /** Callback when delete is requested for a custom theme */
  onCustomThemeDelete: (themeId: string) => void;
  /** Helper to darken HSL colors for sidebar preview */
  darkenHsl: (hsl: string, amount: number) => string;
}

/**
 * Theme preset selection grid with saved custom themes
 * Displays preset buttons and user-saved custom theme buttons
 */
export function ThemePresetSelector({
  presets,
  activePresetId,
  activeCustomThemeId,
  savedCustomThemes,
  onPresetSelect,
  onBlandSelect,
  onCustomThemeSelect,
  onCustomThemeDelete,
  darkenHsl,
}: ThemePresetSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Preset Grid */}
      <div
        className="grid grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Theme presets"
      >
        {presets.map((preset) => {
          const themeIcon = getThemeIcon(preset.id);
          const isActive = activePresetId === preset.id && !activeCustomThemeId;

          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onPresetSelect(preset)}
              className={cn(
                'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50',
                isActive && 'ring-2 ring-primary bg-muted/30'
              )}
            >
              {themeIcon ? (
                <div
                  className="w-8 h-8 flex-shrink-0"
                  style={{
                    backgroundColor: `hsl(${preset.colors.dark.primary})`,
                    WebkitMask: `url(${themeIcon.svg}) center/contain no-repeat`,
                    mask: `url(${themeIcon.svg}) center/contain no-repeat`,
                  }}
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded flex-shrink-0"
                  style={{ backgroundColor: `hsl(${preset.colors.dark.primary})` }}
                  aria-hidden="true"
                />
              )}
              <span className="text-sm font-medium">{preset.name}</span>
              {isActive && (
                <Check
                  className="absolute top-1 right-1 h-4 w-4 text-primary"
                  aria-label="Selected"
                />
              )}
            </button>
          );
        })}

        {/* Bland (Custom) preset button */}
        <button
          type="button"
          role="radio"
          aria-checked={activePresetId === 'custom' && !activeCustomThemeId}
          onClick={onBlandSelect}
          className={cn(
            'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50',
            activePresetId === 'custom' && !activeCustomThemeId && 'ring-2 ring-primary bg-muted/30'
          )}
        >
          <div
            className="w-8 h-8 rounded flex-shrink-0 bg-gradient-to-br from-zinc-600 to-zinc-800"
            aria-hidden="true"
          />
          <span className="text-sm font-medium">Bland</span>
          {activePresetId === 'custom' && !activeCustomThemeId && (
            <Check
              className="absolute top-1 right-1 h-4 w-4 text-primary"
              aria-label="Selected"
            />
          )}
        </button>
      </div>

      {/* Saved Custom Themes */}
      {savedCustomThemes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Saved Themes</h4>
          <div
            className="grid grid-cols-3 gap-3"
            role="radiogroup"
            aria-label="Saved custom themes"
          >
            {savedCustomThemes.map((theme) => {
              const isActive = activeCustomThemeId === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onCustomThemeSelect(theme)}
                  className={cn(
                    'relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:bg-muted/50 group',
                    isActive && 'ring-2 ring-primary bg-muted/30'
                  )}
                >
                  {theme.logoConfig && theme.logoConfig.type !== 'none' ? (
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <LogoPreview config={theme.logoConfig} size="xs" />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded flex-shrink-0"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-sm font-medium truncate">{theme.name}</span>
                  {isActive && (
                    <Check
                      className="absolute top-1 right-1 h-4 w-4 text-primary"
                      aria-label="Selected"
                    />
                  )}
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomThemeDelete(theme.id);
                    }}
                    className="absolute bottom-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-opacity"
                    aria-label={`Delete ${theme.name} theme`}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

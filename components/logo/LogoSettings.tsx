'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Library, Upload, Palette, X, History, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LogoConfig, LogoShape, LogoFrame, LogoGlow, LogoHistoryEntry, CropSettings } from '@/lib/types/guild-config.types';
import { getThemeIcon } from '@/lib/constants/theme-icons';
import { useThemeStore } from '@/lib/stores/theme-store';
import { IconLibraryPicker } from './IconLibraryPicker';
import { LogoUploader } from './LogoUploader';
import { ImageCropEditor } from './ImageCropEditor';
import { LogoPreview, FRAME_OPTIONS, SHAPE_OPTIONS, GLOW_OPTIONS, THEME_COLOR_MARKER } from './LogoPreview';

// Helper functions to convert between HSL and Hex
function hslToHex(hsl: string): string {
  try {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return '#888888';

    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1].replace('%', '')) / 100;
    const l = parseFloat(parts[2].replace('%', '')) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch {
    return '#888888';
  }
}

function hexToHsl(hex: string): string {
  try {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 50%';

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch {
    return '0 0% 50%';
  }
}

// Default colors for each frame type
const FRAME_DEFAULT_COLORS: Record<string, string> = {
  simple: '#666666',
  ornate: '#eab308',
  celtic: '#059669',
  chain: '#a1a1aa',
  runic: '#4338ca',
  thorns: '#9f1239',
  dragon: '#b91c1c',
};

interface LogoSettingsProps {
  config: LogoConfig;
  onChange: (config: LogoConfig) => void;
}

const MAX_HISTORY = 5;

export function LogoSettings({ config, onChange }: LogoSettingsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const { activePresetId } = useThemeStore();

  // Icon color state
  const iconColorMode = config.iconColor ? 'custom' : 'theme';
  const [customIconColor, setCustomIconColor] = useState(config.iconColor || '41 40% 60%');

  // Frame color state
  const frameColorMode = !config.frameColor ? 'default' : config.frameColor === THEME_COLOR_MARKER ? 'theme' : 'custom';
  const [customFrameColor, setCustomFrameColor] = useState(
    config.frameColor && config.frameColor !== THEME_COLOR_MARKER ? config.frameColor : '41 40% 60%'
  );
  const defaultFrameColor = config.frame ? FRAME_DEFAULT_COLORS[config.frame] || '#888888' : '#888888';

  // Glow color state
  const glowColorMode = !config.glowColor ? 'auto' : config.glowColor === THEME_COLOR_MARKER ? 'theme' : 'custom';
  const [customGlowColor, setCustomGlowColor] = useState(
    config.glowColor && config.glowColor !== THEME_COLOR_MARKER ? config.glowColor : '41 40% 60%'
  );

  // Add current logo to history before changing - saves full config
  const addToHistory = useCallback((currentConfig: LogoConfig): LogoHistoryEntry[] => {
    if (currentConfig.type === 'none' || !currentConfig.path) {
      return currentConfig.history || [];
    }

    // Create entry with all required fields having proper defaults
    const newEntry: LogoHistoryEntry = {
      type: currentConfig.type,
      path: currentConfig.path,
      shape: currentConfig.shape || 'none',
      frame: currentConfig.frame || 'none',
      savedAt: new Date().toISOString(),
      // Optional fields - only include if they have meaningful values
      ...(currentConfig.artist && { artist: currentConfig.artist }),
      ...(currentConfig.iconColor && { iconColor: currentConfig.iconColor }),
      ...(currentConfig.frameColor && { frameColor: currentConfig.frameColor }),
      ...(currentConfig.glow && currentConfig.glow !== 'none' && { glow: currentConfig.glow }),
      ...(currentConfig.glowColor && { glowColor: currentConfig.glowColor }),
      ...(currentConfig.cropSettings && { cropSettings: currentConfig.cropSettings }),
    };

    const existingHistory = currentConfig.history || [];
    // Check if this exact config already exists at the top
    if (existingHistory.length > 0 &&
        existingHistory[0].type === newEntry.type &&
        existingHistory[0].path === newEntry.path &&
        existingHistory[0].shape === newEntry.shape &&
        existingHistory[0].frame === newEntry.frame &&
        existingHistory[0].glow === newEntry.glow) {
      return existingHistory;
    }

    return [newEntry, ...existingHistory].slice(0, MAX_HISTORY);
  }, []);

  const handleThemeIconSelect = useCallback(() => {
    const history = addToHistory(config);
    onChange({
      ...config,
      type: 'theme-icon',
      path: activePresetId,
      artist: undefined,
      history,
    });
  }, [config, onChange, activePresetId, addToHistory]);

  const handleIconSelect = useCallback((iconPath: string, artist: string) => {
    const history = addToHistory(config);
    onChange({
      ...config,
      type: 'library-icon',
      path: iconPath,
      artist,
      history,
    });
    setIsPickerOpen(false);
  }, [config, onChange, addToHistory]);

  const handleImageUpload = useCallback((dataUrl: string) => {
    const history = addToHistory(config);
    onChange({
      ...config,
      type: 'custom-image',
      path: dataUrl,
      artist: undefined,
      cropSettings: { x: 50, y: 50, zoom: 1 }, // Reset crop settings for new image
      history,
    });
    setIsUploaderOpen(false);
  }, [config, onChange, addToHistory]);

  const handleCropSettingsChange = useCallback((cropSettings: CropSettings) => {
    onChange({ ...config, cropSettings });
  }, [config, onChange]);

  const handleShapeChange = useCallback((shape: LogoShape) => {
    onChange({ ...config, shape });
  }, [config, onChange]);

  const handleFrameChange = useCallback((frame: LogoFrame) => {
    onChange({ ...config, frame });
  }, [config, onChange]);

  const handleIconColorChange = useCallback((color: string | undefined) => {
    onChange({ ...config, iconColor: color });
  }, [config, onChange]);

  const handleFrameColorChange = useCallback((color: string | undefined) => {
    onChange({ ...config, frameColor: color });
  }, [config, onChange]);

  const handleGlowChange = useCallback((glow: LogoGlow) => {
    onChange({ ...config, glow });
  }, [config, onChange]);

  const handleGlowColorChange = useCallback((color: string | undefined) => {
    onChange({ ...config, glowColor: color });
  }, [config, onChange]);

  const handleClearLogo = useCallback(() => {
    const history = addToHistory(config);
    onChange({
      type: 'none',
      shape: config.shape,
      frame: config.frame,
      history,
    });
  }, [config, onChange, addToHistory]);

  const handleRevertToHistory = useCallback((entry: LogoHistoryEntry) => {
    // Just switch to the selected config - don't modify history
    // History is only updated when uploading/selecting NEW logos, not when reverting
    onChange({
      type: entry.type,
      path: entry.path,
      artist: entry.artist,
      shape: entry.shape,
      frame: entry.frame,
      iconColor: entry.iconColor,
      frameColor: entry.frameColor,
      glow: entry.glow,
      glowColor: entry.glowColor,
      cropSettings: entry.cropSettings,
      history: config.history, // Keep existing history unchanged
    });
    // Update local color states to match
    if (entry.iconColor) setCustomIconColor(entry.iconColor);
    if (entry.frameColor && entry.frameColor !== THEME_COLOR_MARKER) setCustomFrameColor(entry.frameColor);
    if (entry.glowColor && entry.glowColor !== THEME_COLOR_MARKER) setCustomGlowColor(entry.glowColor);
  }, [config, onChange]);

  const themeIcon = getThemeIcon(activePresetId);
  const history = config.history || [];
  const showIconColorPicker = config.type !== 'none' && config.type !== 'custom-image';
  const showFrameColorPicker = config.frame && config.frame !== 'none';

  return (
    <div className="space-y-6">
      {/* Current Logo Preview & Source Selection */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle>Guild Logo</CardTitle>
          <CardDescription>
            Your logo appears in the sidebar and throughout the site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6 pb-5" >
            {/* Preview */}
            <div className="flex flex-col items-center gap-2">
              <LogoPreview config={config} size="xl" />
              {config.type === 'library-icon' && config.artist && (
                <p className="text-xs text-muted-foreground">
                  by <span className="text-foreground">{config.artist}</span>
                </p>
              )}
              {config.type === 'theme-icon' && (
                <p className="text-xs text-muted-foreground">
                  {themeIcon?.name || activePresetId} theme
                </p>
              )}
            </div>

            {/* Source Selection */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={config.type === 'theme-icon' ? 'default' : 'outline'}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={handleThemeIconSelect}
                >
                  <Palette className="h-5 w-5" />
                  <span className="text-xs">Theme Icon</span>
                </Button>

                <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={config.type === 'library-icon' ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <Library className="h-5 w-5" />
                      <span className="text-xs">Icon Library</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle>Choose an Icon</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                      <IconLibraryPicker
                        selectedIcon={config.type === 'library-icon' ? config.path : undefined}
                        onSelect={handleIconSelect}
                        onCancel={() => setIsPickerOpen(false)}
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={config.type === 'custom-image' ? 'default' : 'outline'}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">Upload</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Logo</DialogTitle>
                    </DialogHeader>
                    <LogoUploader
                      currentImage={config.type === 'custom-image' ? config.path : undefined}
                      previousUploads={history.filter(e => e.type === 'custom-image')}
                      onUpload={handleImageUpload}
                      onSelectPrevious={(entry) => {
                        handleRevertToHistory(entry);
                        setIsUploaderOpen(false);
                      }}
                      onCancel={() => setIsUploaderOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Crop Editor with shape selection for all logo types */}
              {config.type !== 'none' && config.path && (
                <ImageCropEditor
                  config={config}
                  onChange={handleCropSettingsChange}
                  onShapeChange={handleShapeChange}
                />
              )}

              {/* Icon Color Options - below source selection */}
              {showIconColorPicker && (
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Icon Color</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleIconColorChange(undefined)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors',
                        iconColorMode === 'theme' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <div className="w-4 h-4 rounded bg-primary" />
                      <span className="text-xs">Theme</span>
                    </button>
                    <label
                      onClick={() => {
                        // Select custom mode when clicking the label
                        if (iconColorMode !== 'custom') {
                          handleIconColorChange(customIconColor);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors relative',
                        iconColorMode === 'custom' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <input
                        type="color"
                        value={hslToHex(customIconColor)}
                        onChange={(e) => {
                          const hsl = hexToHsl(e.target.value);
                          setCustomIconColor(hsl);
                          handleIconColorChange(hsl);
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      />
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: `hsl(${customIconColor})` }}
                      />
                      <span className="text-xs">Custom</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer row - Previous icons and Remove button */}
          {(history.length > 0 || config.type !== 'none') && (
            <div className="flex items-center justify-between pt-4 border-t">
              {history.length > 0 ? (
                <div className="flex items-center gap-3">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm text-muted-foreground">Previous:</Label>
                  <div className="flex gap-2">
                    {history.map((entry, index) => (
                      <button
                        key={`${entry.path}-${entry.frame}-${index}`}
                        onClick={() => handleRevertToHistory(entry)}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                        title={`Revert to this logo${entry.frame && entry.frame !== 'none' ? ` (${entry.frame} frame)` : ''}`}
                      >
                        <LogoPreview
                          config={{
                            type: entry.type,
                            path: entry.path,
                            shape: entry.shape,
                            frame: entry.frame,
                            iconColor: entry.iconColor,
                            frameColor: entry.frameColor,
                            glow: entry.glow,
                            glowColor: entry.glowColor,
                            cropSettings: entry.cropSettings,
                          }}
                          size="sm"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div />
              )}
              {config.type !== 'none' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLogo}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove Logo
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frame & Effects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Frame & Effects</CardTitle>
          <CardDescription>
            Add a decorative frame and glow effects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Preview */}
          {config.type !== 'none' && config.path && (
            <div className="flex justify-center pb-2">
              <LogoPreview config={config} size="xl" />
            </div>
          )}

          {/* Decorative Frame Options */}
          <div>
            {/* Header row with label and color picker - min-h to prevent layout shift */}
            <div className="flex items-center justify-between mb-3 min-h-[28px]">
              <Label className="text-sm font-medium">Decorative Frame</Label>
              {/* Frame Color - in header when frame is selected */}
              {showFrameColorPicker && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Color:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleFrameColorChange(undefined)}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer transition-colors',
                        frameColorMode === 'default' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: defaultFrameColor }} />
                      <span className="text-xs">Default</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFrameColorChange(THEME_COLOR_MARKER)}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer transition-colors',
                        frameColorMode === 'theme' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <div className="w-3 h-3 rounded bg-primary" />
                      <span className="text-xs">Theme</span>
                    </button>
                    <label
                      onClick={() => {
                        if (frameColorMode !== 'custom') {
                          handleFrameColorChange(customFrameColor);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-1.5 px-2 py-1 rounded border cursor-pointer transition-colors relative',
                        frameColorMode === 'custom' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      )}
                    >
                      <input
                        type="color"
                        value={hslToHex(customFrameColor)}
                        onChange={(e) => {
                          const hsl = hexToHsl(e.target.value);
                          setCustomFrameColor(hsl);
                          handleFrameColorChange(hsl);
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      />
                      <div
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: `hsl(${customFrameColor})` }}
                      />
                      <span className="text-xs">Custom</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            <RadioGroup
              value={config.frame || 'none'}
              onValueChange={(value) => handleFrameChange(value as LogoFrame)}
              className="grid grid-cols-4 gap-3"
            >
              {FRAME_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`frame-${option.value}`}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                    (config.frame === option.value || (option.value === 'none' && !config.frame))
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted/30 hover:bg-muted/50'
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`frame-${option.value}`}
                    className="sr-only"
                  />
                  <LogoPreview
                    config={{ ...config, frame: option.value, glow: 'none' }}
                    size="sm"
                  />
                  <span className="text-xs font-medium">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Glow Effects Section */}
          <div className="pt-4 border-t space-y-4">
            {/* Glow Effect Options */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium whitespace-nowrap">Glow Effect</Label>
              <RadioGroup
                value={config.glow || 'none'}
                onValueChange={(value) => handleGlowChange(value as LogoGlow)}
                className="flex gap-2"
              >
                {GLOW_OPTIONS.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`glow-${option.value}`}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors',
                      (config.glow === option.value || (option.value === 'none' && !config.glow))
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`glow-${option.value}`}
                      className="sr-only"
                    />
                    <span className="text-xs">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Glow Color - only visible when glow is not none */}
            <div className={cn((!config.glow || config.glow === 'none') && 'hidden')}>
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium whitespace-nowrap">Glow Color</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleGlowColorChange(undefined)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors',
                      glowColorMode === 'auto' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                    )}
                    title="Matches frame color, or theme if no custom frame"
                  >
                    {/* Show computed frame color: custom frame color if set, otherwise primary */}
                    <div
                      className={cn(
                        'w-4 h-4 rounded',
                        !(config.frameColor && config.frameColor !== THEME_COLOR_MARKER) && 'bg-primary'
                      )}
                      style={
                        config.frameColor && config.frameColor !== THEME_COLOR_MARKER
                          ? { backgroundColor: `hsl(${config.frameColor})` }
                          : undefined
                      }
                    />
                    <span className="text-xs">Frame</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGlowColorChange(THEME_COLOR_MARKER)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors',
                      glowColorMode === 'theme' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                    )}
                  >
                    <div className="w-4 h-4 rounded bg-primary" />
                    <span className="text-xs">Theme</span>
                  </button>
                  <label
                    onClick={() => {
                      if (glowColorMode !== 'custom') {
                        handleGlowColorChange(customGlowColor);
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors relative',
                      glowColorMode === 'custom' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                    )}
                  >
                    <input
                      type="color"
                      value={hslToHex(customGlowColor)}
                      onChange={(e) => {
                        const hsl = hexToHsl(e.target.value);
                        setCustomGlowColor(hsl);
                        handleGlowColorChange(hsl);
                      }}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: `hsl(${customGlowColor})` }}
                    />
                    <span className="text-xs">Custom</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attribution Note */}
      <Alert className="bg-muted/30 border-muted">
        <ExternalLink className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Icon library icons are from{' '}
          <a
            href="https://game-icons.net"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            game-icons.net
          </a>
          {' '}under{' '}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            CC BY 3.0
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}

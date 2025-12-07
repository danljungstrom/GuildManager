'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CropSettings, LogoShape, LogoConfig } from '@/lib/types/guild-config.types';
import { LogoPreview } from './LogoPreview';
import { getThemeIcon } from '@/lib/constants/theme-icons';

interface ImageCropEditorProps {
  config: LogoConfig;
  onChange: (settings: CropSettings) => void;
  onShapeChange?: (shape: LogoShape) => void;
}

const DEFAULT_CROP_SETTINGS: CropSettings = {
  x: 50,
  y: 50,
  zoom: 1,
};

export function ImageCropEditor({
  config,
  onChange,
  onShapeChange,
}: ImageCropEditorProps) {
  const cropSettings = config.cropSettings || DEFAULT_CROP_SETTINGS;
  const [settings, setSettings] = useState<CropSettings>(cropSettings);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external changes
  useEffect(() => {
    setSettings(cropSettings);
  }, [cropSettings]);

  // Debounced onChange to prevent lag from too many parent re-renders
  const debouncedOnChange = useCallback((updated: CropSettings) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      onChange(updated);
    }, 50); // 50ms debounce for smooth feel without too much lag
  }, [onChange]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<CropSettings>) => {
    const updated = { ...settings, ...newSettings };
    // Clamp values
    updated.x = Math.max(0, Math.min(100, updated.x));
    updated.y = Math.max(0, Math.min(100, updated.y));
    updated.zoom = Math.max(1, Math.min(3, updated.zoom));
    setSettings(updated);
    debouncedOnChange(updated);
  }, [settings, debouncedOnChange]);

  const handleZoomChange = useCallback((value: number[]) => {
    updateSettings({ zoom: value[0] });
  }, [updateSettings]);

  const handleReset = useCallback(() => {
    const reset = { ...DEFAULT_CROP_SETTINGS };
    setSettings(reset);
    onChange(reset);
  }, [onChange]);

  // Mouse/touch drag handling for position
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) / 2; // Scale down movement
    const deltaY = (e.clientY - dragStart.y) / 2;

    updateSettings({
      x: settings.x - deltaX / settings.zoom,
      y: settings.y - deltaY / settings.zoom,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, settings, updateSettings]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Get content to display in the main editor area
  const renderEditorContent = () => {
    const translateX = (50 - settings.x) * (settings.zoom - 1) / settings.zoom;
    const translateY = (50 - settings.y) * (settings.zoom - 1) / settings.zoom;
    const transformStyle: React.CSSProperties = {
      transform: `scale(${settings.zoom}) translate(${translateX}%, ${translateY}%)`,
      transformOrigin: `${settings.x}% ${settings.y}%`,
    };

    if (config.type === 'custom-image' && config.path) {
      return (
        <img
          src={config.path}
          alt="Crop preview"
          className="w-full h-full object-cover"
          style={transformStyle}
          draggable={false}
        />
      );
    }

    // For SVG icons, render a colored div with the mask
    // Theme icons need to use getThemeIcon since path (preset ID) doesn't match filename
    let iconPath: string;
    if (config.type === 'theme-icon') {
      iconPath = getThemeIcon(config.path || '')?.svg || `/icons/theme-icons/${config.path}.svg`;
    } else if (config.path?.startsWith('/')) {
      // Full path (e.g., from saved custom theme that was originally a theme-icon)
      iconPath = config.path;
    } else {
      // Relative path for library icons
      iconPath = `/icons/game-icons.net/${config.path}.svg`;
    }

    // Use custom icon color if set, otherwise use primary
    const iconColor = config.iconColor ? `hsl(${config.iconColor})` : undefined;

    return (
      <div
        className={cn('w-full h-full', !iconColor && 'bg-primary')}
        style={{
          ...transformStyle,
          ...(iconColor && { backgroundColor: iconColor }),
          WebkitMask: `url(${iconPath}) center/contain no-repeat`,
          mask: `url(${iconPath}) center/contain no-repeat`,
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Adjust Position & Zoom</Label>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Shape Selection with LogoPreview */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Background Shape</Label>
        <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
          {(['none', 'circle', 'square', 'rounded'] as const).map((previewShape) => {
            const isSelected = config.shape === previewShape || (config.shape === undefined && previewShape === 'none');

            return (
              <button
                key={previewShape}
                type="button"
                onClick={() => onShapeChange?.(previewShape)}
                className={cn(
                  'flex flex-col items-center gap-2 p-2 rounded-lg transition-colors',
                  isSelected ? 'bg-primary/10' : 'hover:bg-muted',
                  onShapeChange ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <div className={cn(
                  'border-2 rounded',
                  isSelected ? 'border-primary' : 'border-muted'
                )}>
                  <LogoPreview
                    config={{
                      ...config,
                      shape: previewShape,
                      frame: 'none',
                      glow: 'none',
                      cropSettings: settings,
                    }}
                    size="sm"
                  />
                </div>
                <span className={cn(
                  'text-xs capitalize',
                  isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {previewShape}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Editor */}
      <div
        ref={editorRef}
        className={cn(
          'relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg bg-muted cursor-move select-none',
          isDragging && 'cursor-grabbing'
        )}
        style={{ clipPath: 'inset(0 round 0.5rem)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Content - clip-path ensures transformed content is clipped */}
        {renderEditorContent()}
        {/* Crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
        </div>
        {/* Drag hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded bg-black/50 text-white text-xs">
          <Move className="h-3 w-3" />
          Drag to position
        </div>
      </div>

      {/* Zoom Control */}
      <div className="flex items-center gap-3 px-2">
        <ZoomOut className="h-4 w-4 text-muted-foreground" />
        <Slider
          value={[settings.zoom]}
          onValueChange={handleZoomChange}
          min={1}
          max={3}
          step={0.05}
          className="flex-1"
        />
        <ZoomIn className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground w-12 text-right">
          {settings.zoom.toFixed(2)}x
        </span>
      </div>
    </div>
  );
}

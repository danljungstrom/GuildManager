'use client';

import { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CropSettings, LogoShape, LogoFrame } from '@/lib/types/guild-config.types';

interface ImageCropEditorProps {
  imageUrl: string;
  cropSettings?: CropSettings;
  shape?: LogoShape;
  frame?: LogoFrame;
  onChange: (settings: CropSettings) => void;
}

const DEFAULT_CROP_SETTINGS: CropSettings = {
  x: 50,
  y: 50,
  zoom: 1,
};

// Shape classes for preview
const SHAPE_PREVIEW_CLASSES: Record<Exclude<LogoShape, 'none'>, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
};

export function ImageCropEditor({
  imageUrl,
  cropSettings = DEFAULT_CROP_SETTINGS,
  shape = 'circle',
  frame = 'none',
  onChange,
}: ImageCropEditorProps) {
  const [settings, setSettings] = useState<CropSettings>(cropSettings);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sync with external changes
  useEffect(() => {
    setSettings(cropSettings);
  }, [cropSettings]);

  const updateSettings = useCallback((newSettings: Partial<CropSettings>) => {
    const updated = { ...settings, ...newSettings };
    // Clamp values
    updated.x = Math.max(0, Math.min(100, updated.x));
    updated.y = Math.max(0, Math.min(100, updated.y));
    updated.zoom = Math.max(1, Math.min(3, updated.zoom));
    setSettings(updated);
    onChange(updated);
  }, [settings, onChange]);

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

  // Calculate image transform style
  const getImageStyle = (): React.CSSProperties => {
    // Convert percentage position to transform
    // At x=50, y=50: image is centered
    // At x=0: image is positioned so left edge is at center
    // At x=100: image is positioned so right edge is at center
    const translateX = (50 - settings.x) * (settings.zoom - 1) / settings.zoom;
    const translateY = (50 - settings.y) * (settings.zoom - 1) / settings.zoom;

    return {
      transform: `scale(${settings.zoom}) translate(${translateX}%, ${translateY}%)`,
      transformOrigin: `${settings.x}% ${settings.y}%`,
    };
  };

  // Determine effective shape for preview
  // If shape is 'none' and there's a frame, derive shape from frame
  const getEffectiveShape = (): Exclude<LogoShape, 'none'> => {
    if (shape && shape !== 'none') return shape;
    // Default to circle when shape is none (matches frame default)
    return 'circle';
  };

  const effectiveShape = getEffectiveShape();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Adjust Position & Zoom</Label>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Shape Previews */}
      <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
        {(['circle', 'square', 'rounded'] as const).map((previewShape) => (
          <div key={previewShape} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'w-20 h-20 overflow-hidden bg-background border-2',
                SHAPE_PREVIEW_CLASSES[previewShape],
                previewShape === effectiveShape ? 'border-primary' : 'border-muted'
              )}
            >
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                style={getImageStyle()}
                draggable={false}
              />
            </div>
            <span className={cn(
              'text-xs capitalize',
              previewShape === effectiveShape ? 'text-primary font-medium' : 'text-muted-foreground'
            )}>
              {previewShape}
            </span>
          </div>
        ))}
      </div>

      {/* Main Editor */}
      <div
        className={cn(
          'relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-lg bg-muted cursor-move select-none',
          isDragging && 'cursor-grabbing'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageUrl}
          alt="Crop preview"
          className="w-full h-full object-cover"
          style={getImageStyle()}
          draggable={false}
        />
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

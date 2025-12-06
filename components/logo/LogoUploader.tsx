'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoUploaderProps {
  currentImage?: string;
  onUpload: (imageUrl: string) => void;
  onCancel?: () => void;
}

export function LogoUploader({ currentImage, onUpload, onCancel }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Upload to Vercel Blob via API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      onUpload(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
          'hover:border-primary hover:bg-primary/5 transition-colors',
          'flex flex-col items-center justify-center gap-3',
          uploading && 'pointer-events-none opacity-50'
        )}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            <div>
              <p className="font-medium">Uploading...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Drop an image here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, or GIF up to 5MB
              </p>
            </div>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
        disabled={uploading}
      />

      {/* Current Image Preview */}
      {currentImage && !uploading && (
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <img
            src={currentImage}
            alt="Current logo"
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Current Logo</p>
            <p className="text-xs text-muted-foreground">
              Upload a new image to replace
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Cancel button */}
      {onCancel && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel} disabled={uploading}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

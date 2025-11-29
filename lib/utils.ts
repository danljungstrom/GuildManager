import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get CSS styles for logo frames
 * Applies a border frame to logos that lack transparency
 *
 * @param hasTransparency - Whether the logo has transparency
 * @param themeColor - HSL color string (e.g., "41 40% 60%")
 * @returns CSS style object for the logo frame
 */
export function getLogoFrameStyles(
  hasTransparency: boolean,
  themeColor: string
): React.CSSProperties {
  if (hasTransparency) {
    return {};
  }

  return {
    border: `3px solid hsl(${themeColor})`,
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'hsl(var(--background))',
  };
}

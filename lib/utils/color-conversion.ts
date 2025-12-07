/**
 * Color Conversion Utilities
 *
 * Shared functions for converting between HSL and Hex color formats.
 * HSL is used for CSS custom properties, Hex for color pickers.
 */

/**
 * Convert HSL string to Hex color
 * @param hsl - HSL string in format "H S% L%" (e.g., "220 14% 10%")
 * @returns Hex color string (e.g., "#1a1d24")
 */
export function hslToHex(hsl: string): string {
  try {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return '#888888';

    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1].replace('%', '')) / 100;
    const l = parseFloat(parts[2].replace('%', '')) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
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

/**
 * Convert Hex color to HSL string
 * @param hex - Hex color string (e.g., "#1a1d24" or "1a1d24")
 * @returns HSL string in format "H S% L%" (e.g., "220 14% 10%")
 */
export function hexToHsl(hex: string): string {
  try {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 50%';

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch {
    return '0 0% 50%';
  }
}

/**
 * Validate if a string is a valid HSL color format
 * @param hsl - String to validate
 * @returns true if valid HSL format
 */
export function isValidHsl(hsl: string): boolean {
  const regex = /^\d{1,3}\s\d{1,3}%\s\d{1,3}%$/;
  return regex.test(hsl.trim());
}

/**
 * Validate if a string is a valid Hex color format
 * @param hex - String to validate
 * @returns true if valid Hex format
 */
export function isValidHex(hex: string): boolean {
  const regex = /^#?([a-f\d]{6}|[a-f\d]{3})$/i;
  return regex.test(hex.trim());
}

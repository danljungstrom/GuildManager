/**
 * Theme Cookie Utilities
 *
 * Server and client utilities for managing theme via cookies.
 * This enables SSR with correct theme (no flash of wrong theme).
 */

export const THEME_COOKIE_NAME = 'theme-preference';
export type ThemeMode = 'light' | 'dark';

/**
 * Server-side: Get theme from cookies
 * Use this in Server Components to render with correct theme immediately
 */
export function getThemeFromCookies(cookieString?: string): ThemeMode {
  if (!cookieString) return 'dark'; // Default theme

  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const theme = cookies[THEME_COOKIE_NAME];
  return theme === 'light' ? 'light' : 'dark';
}

/**
 * Client-side: Set theme cookie
 * Call this when user toggles theme
 */
export function setThemeCookie(theme: ThemeMode): void {
  // Set cookie for 1 year
  const maxAge = 365 * 24 * 60 * 60;
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Client-side: Get current theme from cookie
 */
export function getClientTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'dark';

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[THEME_COOKIE_NAME] === 'light' ? 'light' : 'dark';
}

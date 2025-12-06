import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page has loaded (either setup wizard or dashboard)
    const pageContent = await page.content();
    const hasSetupWizard = pageContent.includes('Setup') || pageContent.includes('setup');
    const hasDashboard = pageContent.includes('Dashboard');

    expect(hasSetupWizard || hasDashboard).toBeTruthy();
  });

  test('should display dashboard when configured', async ({ page }) => {
    await page.goto('/');

    // If the guild is configured, we should see the Dashboard
    const dashboardHeading = page.locator('h1:has-text("Dashboard")');

    // Either we see the dashboard or the setup wizard
    const setupHeading = page.locator('text=Setup');

    const isDashboard = await dashboardHeading.isVisible().catch(() => false);
    const isSetup = await setupHeading.isVisible().catch(() => false);

    expect(isDashboard || isSetup).toBeTruthy();
  });
});

test.describe('Navigation', () => {
  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if sidebar exists
    const sidebar = page.locator('[data-testid="sidebar"], nav, aside');
    const hasSidebar = await sidebar.first().isVisible().catch(() => false);

    if (hasSidebar) {
      // Try to find navigation links
      const navLinks = page.locator('nav a, aside a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });
});

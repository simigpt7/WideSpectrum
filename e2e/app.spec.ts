import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Wide Spectrum Productions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Wide Spectrum Productions/);
  });

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('section#home');
    await expect(hero).toBeVisible();
  });

  test('services section renders', async ({ page }) => {
    await page.click('a[href="#services"]');
    await expect(page.locator('section#services')).toBeInViewport();
  });

  test('about section renders', async ({ page }) => {
    await page.click('a[href="#about"]');
    await expect(page.locator('section#about')).toBeInViewport();
  });

  test('portfolio section renders', async ({ page }) => {
    await page.click('a[href="#portfolio"]');
    await expect(page.locator('section#portfolio')).toBeInViewport();
  });

  test('testimonials section renders', async ({ page }) => {
    await page.click('a[href="#testimonials"]');
    await expect(page.locator('section#testimonials')).toBeInViewport();
  });

  test('contact section renders', async ({ page }) => {
    await page.click('a[href="#contact"]');
    await expect(page.locator('section#contact')).toBeInViewport();
  });

  test('contact form validation', async ({ page }) => {
    await page.click('a[href="#contact"]');
    await page.click('button[type="submit"]');
    // Form should show validation errors
    await expect(page.locator('text=/required/i')).toBeVisible();
  });

  test('accessibility check', async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 1440]) test('shared kit works independently at ' + width + 'px', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ colorScheme: 'dark' }); await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Shared by design.' })).toBeVisible();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['light', 'dark']) {
    const toggle = page.getByRole('switch', { name: 'Dark theme' });
    if ((await toggle.isChecked()) !== (theme === 'dark')) await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => ({ target: node.target, details: node.any.map(check => check.message) })) }))).toEqual([]);
  }
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open dialog', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Toggle RTL' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'Report', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Next comments' }).click();
  await expect(page.locator('.carousel-pagination output')).not.toHaveText(/^1 \/ /);
  const email = page.getByRole('link', { name: /Email hello@example.com/ });
  await expect(email).toHaveAttribute('href', 'mailto:hello@example.com');
  await expect(email).not.toHaveAttribute('target', '_blank');
  await page.screenshot({ path: testInfo.outputPath('showcase-' + width + '.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('effects respect preferences and dispose their particles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/'); await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Preview confetti' }).click();
  await expect(page.locator('.download-confetti')).toHaveCount(18);
  await expect(page.locator('.download-confetti')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Preview confetti' }).click();
  await expect(page.locator('.download-confetti')).toHaveCount(0);
  await expect(page.locator('[data-background-toggle]')).toBeHidden();
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.locator('.page-background')).toBeHidden();
});

test('system theme follows preferences until a visitor makes a choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' }); await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await page.emulateMedia({ colorScheme: 'light' }); await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

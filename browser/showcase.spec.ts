import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 1440]) test('shared kit works independently at ' + width + 'px', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ colorScheme: 'dark' }); await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Shared by design.' })).toBeVisible();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
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

test('keyboard focus retains a visible outline in both themes', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  for (const checked of [false, true]) {
    const theme = page.getByRole('switch', { name: 'Dark theme' });
    if (await theme.isChecked() !== checked) await theme.click();
    await page.getByRole('link', { name: 'Want Desyst', exact: true }).focus();
    await page.keyboard.press('Tab');
    const button = page.getByRole('button', { name: 'Toggle RTL' });
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');
    await expect(button).toHaveCSS('outline-width', '2px');
    await expect(button).toHaveCSS('outline-offset', '3px');
    await page.keyboard.press('Tab');
    await expect(theme).toBeFocused();
    await expect(theme).toHaveCSS('outline-width', '2px');
  }
});

test('background disposal pauses retained markup and removes its control', async ({ page }) => {
  const { readFile } = await import('node:fs/promises');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setContent('<div class="page-background" style="height:1000px"><div></div></div><button data-pause-label="Pause" data-play-label="Resume">Pause</button>');
  await page.addStyleTag({ path: new URL('../packages/foundation/dist/index.css', import.meta.url).pathname });
  const source = await readFile(new URL('../packages/foundation/dist/index.js', import.meta.url), 'utf8');
  const state = await page.evaluate(async source => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
    try {
      const { initBackgroundMotion } = await import(url);
      const background = document.querySelector<HTMLElement>('.page-background')!;
      const control = document.querySelector<HTMLButtonElement>('button')!;
      const dispose = initBackgroundMotion({ background, control });
      const before = document.documentElement.dataset.backgroundMotion;
      background.dataset.backgroundShimmer = '';
      dispose(); dispose();
      return { before, after: document.documentElement.dataset.backgroundMotion, hidden: control.hidden,
        shimmer: background.hasAttribute('data-background-shimmer'), animation: getComputedStyle(background.firstElementChild!).animationPlayState };
    } finally { URL.revokeObjectURL(url); }
  }, source);
  expect(state).toEqual({ before: 'running', after: 'paused', hidden: true, shimmer: false, animation: 'paused' });
});

for (const width of [320, 1440]) test('date, URL and window controls work at ' + width + 'px', async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ colorScheme: width === 320 ? 'dark' : 'light', reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
  const window = page.getByRole('region', { name: 'Project planning' });
  await expect(window.getByRole('heading', { name: 'Project planning' })).toBeVisible();
  await window.getByRole('button', { name: 'Due date' }).click();
  const calendar = page.getByRole('dialog', { name: 'Calendar' });
  await expect(calendar).toBeVisible();
  const previousYear = calendar.getByRole('button', { name: 'Previous year' });
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[data-slot="date-popover"]')))).toBe(true);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(axe.violations.map(item => item.id)).toEqual([]);
  await previousYear.focus();
  for (let index = 0; index < 4; index++) await page.keyboard.press('Tab');
  await expect(calendar.getByRole('button', { name: /28 October 2026/ })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(calendar.getByRole('button', { name: /29 October 2026/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(window.getByRole('button', { name: 'Due date' })).toContainText('29 Oct 2026');
  await window.getByRole('button', { name: 'Meeting' }).click();
  await calendar.getByRole('spinbutton', { name: 'Hours' }).fill('12');
  await calendar.getByRole('button', { name: 'Apply' }).click();
  await expect(window.getByRole('button', { name: 'Meeting' })).toContainText('12:30');
  const url = window.getByRole('textbox', { name: 'Reference URL' });
  await url.fill('javascript:alert(1)');
  await expect(window.getByRole('link', { name: 'Open reference URL' })).toHaveCount(0);
  await url.fill('https://example.com');
  await expect(window.getByRole('link', { name: 'Open reference URL' })).toHaveAttribute('rel', 'noopener noreferrer');
  await window.getByRole('button', { name: 'Save example' }).click();
  await expect(window.getByRole('status')).toHaveText('Example saved locally.');
  if (width === 1440) {
    await page.getByRole('button', { name: 'Toggle RTL' }).click();
    await window.getByRole('button', { name: 'Due date' }).click();
    await calendar.getByRole('button', { name: /29 October 2026/ }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(calendar.getByRole('button', { name: /28 October 2026/ })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(window.getByRole('button', { name: 'Due date' })).toBeFocused();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('common-' + width + '.png'), fullPage: true });
  expect(errors).toEqual([]);
});

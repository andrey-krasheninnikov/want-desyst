import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import tokens from '../packages/foundation/tokens.json' with { type: 'json' };

const rgb = (hex: string) => 'rgb(' + [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(', ') + ')';

for (const width of [320, 768, 1024, 1440]) test('visual system works at ' + width + 'px', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const dark = width === 320 || width === 1024;
  const reduced = width === 320;
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light', reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const media = await page.context().newCDPSession(page);
  const features = [{ name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }, { name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }];
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  if (dark) await page.getByRole('button', { name: 'Toggle RTL' }).click();

  for (const selector of ['[data-slot="navigation-menu-link"]', '[data-slot="breadcrumb-link"]', '[data-slot="breadcrumb-page"]']) {
    const controls = page.locator(selector);
    for (const control of await controls.all()) {
      await expect(control).toHaveCSS('justify-content', 'center');
      await expect(control).toHaveCSS('align-items', 'center');
      await expect(control).toHaveCSS('text-align', 'center');
      expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  }
  const typeRows = page.locator('.demo-type-row [data-slot="typography"]');
  await expect(typeRows).toHaveCount(17);
  for (const [name, style] of Object.entries(tokens.typography.styles)) {
    const sample = typeRows.and(page.locator('[data-variant="' + name + '"]'));
    const size = await sample.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
    expect(size).toBeGreaterThanOrEqual(style.minPx - .1);
    expect(size).toBeLessThanOrEqual(style.maxPx + .1);
  }
  await expect(page.locator('.demo-type-locales [lang="ja"]')).toHaveCSS('font-family', /Noto Sans JP/);
  await expect(page.locator('.demo-type-locales [lang="ar"]')).toHaveCSS('font-family', /Noto Sans Arabic/);
  await expect(typeRows.and(page.locator('[data-variant="code-block"]'))).toHaveCSS('direction', 'ltr');

  for (const [variant, animation] of [['spinner', 'want-loader-rotate'], ['dots', 'want-loader-dot'], ['bars', 'want-loader-bar'], ['orbit', 'want-loader-rotate']]) {
    const loader = page.getByRole('status', { name: 'Loading with ' + variant, exact: true });
    await expect(loader).toBeVisible();
    const art = variant === 'dots' || variant === 'bars' ? loader.locator('.ui-loader-art > span').first() : loader.locator('.ui-loader-art');
    await expect(art).toHaveCSS('animation-name', reduced ? 'none' : animation);
  }
  await page.getByRole('button', { name: 'Pause loaders', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Loading with spinner', exact: true }).locator('.ui-loader-art')).toHaveCSS(reduced ? 'animation-name' : 'animation-play-state', reduced ? 'none' : 'paused');

  const shimmer = page.getByRole('status', { name: 'Loading card preview', exact: true });
  const motion = await shimmer.locator('.ui-shimmer-piece').first().evaluate(element => getComputedStyle(element, '::after').animationName);
  expect(motion).toBe(reduced ? 'none' : 'want-shimmer');
  expect(await page.getByRole('status', { name: 'Loading avatar preview', exact: true }).locator('.ui-shimmer-block').evaluate(element => {
    const radius = getComputedStyle(element).borderRadius;
    const pixels = radius.endsWith('%') ? parseFloat(radius) / 100 * element.clientWidth : parseFloat(radius);
    return element.clientWidth === element.clientHeight && pixels >= element.clientWidth / 2;
  })).toBe(true);
  await page.getByRole('button', { name: 'Pause shimmer', exact: true }).click();
  expect(await shimmer.locator('.ui-shimmer-piece').first().evaluate((element, reduced) => getComputedStyle(element, '::after')[reduced ? 'animationName' : 'animationPlayState'], reduced)).toBe(reduced ? 'none' : 'paused');

  const text = page.locator('[data-slot="animated-text"]');
  await page.getByRole('button', { name: 'Change example text', exact: true }).click();
  await page.getByRole('button', { name: 'Change example text', exact: true }).click();
  for (const item of await text.all()) {
    await expect(item).toHaveText('Everything is up to date');
    await expect(item.locator('.ui-animated-text-value')).toHaveCount(1);
  }
  await expect(text.and(page.locator('[data-effect="slide"]')).locator('.ui-animated-text-value')).toHaveCSS('animation-name', reduced ? 'none' : 'want-content-in');

  const glow = page.locator('.demo-glow-surface [data-slot="glow"]');
  await expect(glow).toBeVisible();
  await expect(glow).toHaveAttribute('aria-hidden', 'true');
  await expect(glow).toHaveCSS('pointer-events', 'none');
  expect(await glow.evaluate(element => getComputedStyle(element, '::before').animationName)).toBe(reduced ? 'none' : 'want-glow-wave');
  if (!reduced) expect(await glow.evaluate(element => getComputedStyle(element, '::before').animationDuration)).toBe('3.6s');
  await page.getByRole('button', { name: 'Pause glow', exact: true }).click();
  expect(await glow.evaluate((element, reduced) => getComputedStyle(element, '::before')[reduced ? 'animationName' : 'animationPlayState'], reduced)).toBe(reduced ? 'none' : 'paused');
  await page.getByRole('button', { name: 'Glowing CTA', exact: true }).click();
  await expect(page.getByText('CTA activated locally.', { exact: true })).toBeVisible();
  if (width === 1440) await page.locator('section').filter({ has: page.getByRole('heading', { name: 'Reusable background glow', exact: true }) }).screenshot({ path: testInfo.outputPath('glow.png') });

  await page.clock.install();
  const palette = tokens.themes.wallpapers[dark ? 'dark' : 'light'];
  for (const variant of ['error', 'warning', 'info', 'success'] as const) {
    const trigger = page.getByRole('button', { name: 'Show ' + variant + ' snackbar', exact: true });
    await trigger.focus(); await trigger.press('Enter');
    const snackbar = page.locator('[data-slot="snackbar"]');
    await expect(snackbar).toHaveAttribute('data-variant', variant);
    await expect(snackbar).toHaveCSS('opacity', '1');
    await expect(snackbar).toHaveCSS('background-color', rgb(palette.popover));
    await expect(snackbar.locator('.ui-snackbar-icon')).toHaveCSS('background-color', rgb(palette[variant]));
    await expect(snackbar.locator('.ui-snackbar-icon')).toHaveCSS('color', rgb(palette[variant + '-foreground' as keyof typeof palette]));
    await expect(trigger).toBeFocused();
    const box = await snackbar.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    expect(box!.y + box!.height).toBeLessThanOrEqual(1000);
    if (variant === 'error') {
      await page.mouse.move(1, 1);
      await page.clock.fastForward(6000);
      await expect(snackbar).toBeVisible();
    }
    if (variant === 'success') {
      if (width === 320 || width === 1440) {
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(axe.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
        await page.locator('.ui-snackbar-viewport').screenshot({ path: testInfo.outputPath('snackbar.png') });
      }
      await snackbar.getByRole('button', { name: 'Undo', exact: true }).click();
      await expect(page.getByText('Undo selected locally.', { exact: true })).toBeVisible();
    } else await snackbar.getByRole('button', { name: 'Dismiss status message', exact: true }).click();
    await expect(snackbar).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Show info snackbar', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-slot="snackbar"]')).toHaveAttribute('data-variant', 'info');
  await expect(page.locator('[data-slot="snackbar"]')).toHaveCSS('opacity', '1');
  await page.locator('[data-slot="snackbar"]').hover();
  await page.clock.runFor(100);
  await page.clock.fastForward(6000);
  await expect(page.locator('[data-slot="snackbar"]')).toBeVisible();
  await page.mouse.move(1, 1);
  await page.clock.fastForward(6000);
  await expect(page.locator('[data-slot="snackbar"]')).toHaveCount(0);

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(glow).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ forcedColors: 'none' });
  await media.send('Emulation.setEmulatedMedia', { features: [...features, { name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await expect(glow).toBeVisible();
  expect(await glow.evaluate(element => getComputedStyle(element, '::before').animationName)).toBe(reduced ? 'none' : 'want-glow-wave');
  if (width === 320) {
    const zoomStyle = await page.addStyleTag({ content: 'html { font-size:200%; }' });
    await expect(typeRows.and(page.locator('[data-variant="body"]'))).toHaveCSS('font-size', '32px');
    for (const title of ['Typography', 'Navigation menu and breadcrumbs', 'Custom loaders', 'Shimmer placeholders', 'Animated text', 'Reusable background glow', 'Semantic snackbars']) {
      const section = page.locator('.kit-section').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
      const layout = await section.evaluate(element => ({ scroll: element.scrollWidth, width: element.clientWidth }));
      expect(layout.scroll, title + ' fits at 200% text').toBeLessThanOrEqual(layout.width + 1);
    }
    await page.getByRole('button', { name: 'Show error snackbar', exact: true }).click();
    const box = await page.locator('[data-slot="snackbar"]').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'Dismiss status message', exact: true }).click();
    await zoomStyle.evaluate(element => element.remove());
  }
  expect(errors).toEqual([]);
});

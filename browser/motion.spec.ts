import { test, expect } from '@playwright/test';

for (const width of [320, 1440]) for (const reduced of [false, true]) {
  test(`component motion at ${width}px with reduced motion ${reduced}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference', colorScheme: width === 320 ? 'dark' : 'light' });
    await page.goto('/');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
    if (width === 320) await page.getByRole('button', { name: 'Toggle RTL' }).click();

    const openDialog = page.getByRole('button', { name: 'Open dialog', exact: true });
    await openDialog.click();
    const dialog = page.getByRole('dialog', { name: 'Wallpaper details' });
    await expect(dialog).toHaveCSS('animation-name', reduced ? 'none' : 'want-scale-in');
    await expect(dialog).toHaveCSS('opacity', '1');
    if (!reduced) await page.screenshot({ path: testInfo.outputPath('dialog-' + width + '.png') });
    const centered = await dialog.boundingBox();
    expect(Math.abs(centered!.x + centered!.width / 2 - width / 2)).toBeLessThan(2);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('[data-slot="dialog-overlay"]')).toHaveCount(0);
    await expect(openDialog).toBeFocused();

    const openSheet = page.getByRole('button', { name: 'Open sheet', exact: true });
    await openSheet.click();
    const sheet = page.getByRole('dialog', { name: 'Collection navigation' });
    await expect(sheet).toHaveAttribute('data-side', 'right');
    await expect(sheet).toHaveCSS('animation-name', reduced ? 'none' : 'want-sheet-in');
    await page.keyboard.press('Escape');
    await expect(sheet).toHaveCount(0);
    await expect(page.locator('[data-slot="sheet-overlay"]')).toHaveCount(0);
    await expect(openSheet).toBeFocused();

    const collection = page.getByRole('combobox', { name: 'Collection', exact: true });
    await collection.click();
    await expect(page.getByRole('listbox')).toHaveCSS('animation-name', reduced ? 'none' : 'want-scale-in');
    await page.getByRole('option', { name: 'Woven Spectrum' }).click();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(collection).toContainText('Woven Spectrum');
    await expect(collection).toBeFocused();

    const date = page.getByRole('button', { name: /^Due date:/ });
    await date.click();
    const calendar = page.getByRole('dialog', { name: 'Calendar' });
    await expect(calendar).toHaveCSS('animation-name', reduced ? 'none' : 'want-scale-in');
    await expect(calendar).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(calendar).toHaveCount(0);
    await expect(date).toBeFocused();

    await page.getByRole('tab', { name: 'Mobile', exact: true }).click();
    const panel = page.getByRole('tabpanel', { name: 'Mobile', exact: true });
    await expect(panel).toHaveText('Portrait wallpaper preview.');
    await expect(panel).toHaveCSS('animation-name', reduced ? 'none' : 'want-content-in');

    const accordion = page.getByRole('button', { name: 'How do downloads work?' });
    await accordion.click();
    const content = page.locator('[data-slot="accordion-content"]');
    await expect(content).toHaveCSS('animation-name', reduced ? 'none' : 'want-accordion-in');
    await expect(content).toHaveCSS('height', await content.evaluate(element => getComputedStyle(element).getPropertyValue('--radix-accordion-content-height')));
    await accordion.click();
    await expect(content).toBeHidden();
    await expect(accordion).toHaveAttribute('aria-expanded', 'false');

    const radio = page.getByRole('radio', { name: 'Mobile', exact: true });
    await radio.click();
    await expect(radio).toBeChecked();
    await expect(radio.locator('[data-slot="radio-group-indicator"]')).toHaveCSS('animation-name', reduced ? 'none' : 'want-indicator-in');
    const setting = page.getByRole('switch', { name: 'Enable example setting', exact: true });
    await setting.click();
    await expect(setting).toBeChecked();
    if (reduced) await expect(setting.locator('[data-slot="switch-thumb"]')).toHaveCSS('transition-duration', '1e-05s');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

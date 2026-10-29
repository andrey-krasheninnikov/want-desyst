import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 1440]) {
  test('additional controls support keyboard and RTL at ' + width + 'px', async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme: width === 320 ? 'dark' : 'light', reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
    await page.goto('/');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
    if (width === 320) await page.getByRole('button', { name: 'Toggle RTL' }).click();

    const checkbox = page.getByRole('checkbox', { name: 'Select all examples' });
    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await checkbox.focus(); await checkbox.press('Space');
    await expect(checkbox).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Example 1', exact: true })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Disabled checkbox' })).toBeDisabled();

    const actions = page.getByRole('button', { name: 'Example actions' });
    await actions.focus(); await actions.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Edit example' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Copy example' })).toBeFocused();
    await expect(page.getByRole('menuitem', { name: 'Archive unavailable' })).toHaveAttribute('data-disabled', '');
    await page.keyboard.press('Enter');
    await expect(page.getByText('Copy selected.', { exact: true })).toBeVisible();
    await expect(actions).toBeFocused();

    const help = page.getByRole('button', { name: 'About these examples' });
    await help.focus();
    await expect(page.getByRole('tooltip')).toHaveText('These examples use local state.');
    await help.press('Escape');
    await expect(page.getByRole('tooltip')).toHaveCount(0);

    const settings = page.getByRole('button', { name: 'Example settings', exact: true });
    await settings.click();
    const popover = page.getByRole('dialog', { name: 'Example settings' });
    await expect(popover).toBeVisible();
    await expect(popover).toHaveCSS('animation-name', width === 320 ? 'none' : 'want-scale-in');
    const box = await popover.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    await popover.getByRole('textbox', { name: 'Note' }).fill('Changed locally');
    await popover.getByRole('button', { name: 'Close settings' }).click();
    await expect(popover).toHaveCount(0);
    await expect(settings).toBeFocused();

    const project = page.getByRole('combobox', { name: 'Project', exact: true });
    await project.fill('WEB');
    await expect(page.getByRole('option', { name: 'Website', exact: true })).toBeVisible();
    await expect(project).toBeFocused();
    const comboAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(comboAxe.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
    await project.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
    await expect(project).toHaveAttribute('aria-expanded', 'true');
    await expect(project).toHaveValue('WEB');
    await project.press('Enter');
    await expect(project).toHaveValue('Website');
    await expect(page.locator('input[type="hidden"][name="project"]')).toHaveValue('website');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await project.fill('no-match');
    await expect(page.getByText('No projects found.', { exact: true })).toBeVisible();
    await project.press('Escape');
    await expect(project).toHaveValue('Website');
    await project.fill('');
    await project.press('ArrowUp');
    await project.press('Enter');
    await expect(project).toHaveValue('Mobile app');

    const show = page.getByRole('button', { name: 'Show notification' });
    await show.focus(); await show.press('Enter');
    await expect(page.getByText('Example saved', { exact: true })).toBeVisible();
    await expect(show).toBeFocused();
    await page.getByRole('button', { name: 'Undo example', exact: true }).click();
    await expect(page.getByText('Example change undone.', { exact: true })).toBeVisible();
    await expect(page.locator('[data-slot="toast"]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Advance progress' }).click();
    await expect(page.getByRole('progressbar', { name: 'Example progress' })).toHaveAttribute('aria-valuenow', '75');
    await expect(page.getByRole('progressbar', { name: 'Indeterminate example' })).not.toHaveAttribute('aria-valuenow');
    await expect(page.getByRole('progressbar', { name: 'Indeterminate example' }).locator('[data-slot="progress-indicator"]')).toHaveCSS('animation-name', width === 320 ? 'none' : 'want-progress');

    const table = page.getByRole('table', { name: 'Local project examples' });
    await page.getByRole('button', { name: 'Next page', exact: true }).click();
    await expect(table.getByRole('rowheader', { name: 'Example 6', exact: true })).toBeVisible();
    await page.getByRole('combobox', { name: 'Rows per page', exact: true }).click();
    await page.getByRole('option', { name: '10', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Page 1', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(table.getByRole('row')).toHaveCount(11);
    await page.getByRole('button', { name: 'Toggle table loading' }).click();
    await expect(table).toHaveAttribute('aria-busy', 'true');
    await page.getByRole('button', { name: 'Toggle table loading' }).click();
    await expect(table).toHaveAttribute('aria-busy', 'false');
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }))).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.ui-pagination-results')).toHaveCSS('direction', 'ltr');
    const section = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Table and pagination', exact: true }) });
    await section.screenshot({ path: testInfo.outputPath('table-' + width + '.png') });
    expect(errors).toEqual([]);
  });

  test('file selection validates batches and releases previews at ' + width + 'px', async ({ page }) => {
    await page.addInitScript(() => {
      const original = URL.revokeObjectURL.bind(URL);
      (window as unknown as { revoked: string[] }).revoked = [];
      URL.revokeObjectURL = url => { (window as unknown as { revoked: string[] }).revoked.push(url); original(url); };
    });
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 15000 });
    if (width === 320) await page.getByRole('button', { name: 'Toggle RTL' }).click();
    const input = page.getByLabel('Attachments', { exact: true });
    await input.setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('Example') });
    await expect(page.getByText('notes.txt', { exact: true })).toBeVisible();
    await input.setInputFiles({ name: 'unsupported.pdf', mimeType: 'application/pdf', buffer: Buffer.from('Example') });
    await expect(page.locator('[data-slot="file-upload"]').getByRole('alert')).toContainText('unsupported.pdf: choose an image or text file.');
    await expect(page.getByRole('button', { name: 'Remove notes.txt' })).toBeVisible();
    await input.setInputFiles({ name: 'large.txt', mimeType: 'text/plain', buffer: Buffer.alloc(1024 * 1024 + 1) });
    await expect(page.locator('[data-slot="file-upload"]').getByRole('alert')).toContainText('maximum size is 1 MB');
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7WQAAAAASUVORK5CYII=', 'base64');
    await input.setInputFiles({ name: 'preview.png', mimeType: 'image/png', buffer: png });
    const preview = page.locator('.ui-file-preview[src^="blob:"]');
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
    await page.getByRole('button', { name: 'Remove preview.png' }).click();
    await expect(preview).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (window as unknown as { revoked: string[] }).revoked.length)).toBe(1);
    const drop = page.locator('.ui-file-drop');
    await drop.evaluate(element => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(['Dropped'], 'dropped.txt', { type: 'text/plain', lastModified: 123 }));
      element.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }));
    });
    await expect(page.getByText('dropped.txt', { exact: true })).toBeVisible();
    await input.setInputFiles(['one', 'two'].map(name => ({ name: name + '.txt', mimeType: 'text/plain', buffer: Buffer.from(name) })));
    await expect(page.locator('[data-slot="file-upload"]').getByRole('alert')).toContainText('Choose at most 3 files.');
    await expect(page.locator('.ui-file-list li')).toHaveCount(2);
    await page.getByRole('button', { name: 'Remove notes.txt' }).click();
    await expect(page.getByRole('button', { name: 'Remove notes.txt' })).toHaveCount(0);
    await drop.evaluate(element => {
      const transfer = new DataTransfer();
      for (const text of ['A', 'B']) transfer.items.add(new File([text], 'same.txt', { type: 'text/plain', lastModified: 456 }));
      element.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }));
    });
    await expect(page.locator('.ui-file-list li')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Remove same.txt', exact: true })).toHaveCount(2);
  });
}

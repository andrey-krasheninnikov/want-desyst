import { expect, test } from '@playwright/test';

for (const timezoneId of ['Pacific/Honolulu', 'Asia/Tokyo', 'Europe/Berlin']) {
  test(`calendar preserves dates and focus in ${timezoneId}`, async ({ browser }) => {
    const context = await browser.newContext({ timezoneId });
    const page = await context.newPage();
    try {
      await page.goto('/calendar-boundaries');
      await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
      const input = page.getByLabel('Calendar value');
      const trigger = page.getByRole('button', { name: /^Test date:/ });
      for (const [value, key, disabled] of [
        ['0001-01-01', 'ArrowLeft', 'Previous month'],
        ['0099-12-31', 'ArrowRight', ''],
        ['2024-02-29', 'PageDown', ''],
        ['9999-12-31', 'ArrowRight', 'Next month'],
      ]) {
        await input.fill(value!);
        await trigger.click();
        const selected = page.locator(`[data-day="${value}"]`);
        await expect(selected).toBeFocused();
        await expect(selected).toHaveAttribute('aria-pressed', 'true');
        if (disabled) await expect(page.getByRole('button', { name: disabled, exact: true })).toBeDisabled();
        await page.keyboard.press(key!);
        const expected = value === '0099-12-31' ? '0100-01-01' : value === '2024-02-29' ? '2024-03-29' : value!;
        await expect(page.locator(`[data-day="${expected}"]`)).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('status', { name: 'Selected date' })).toHaveText(expected);
        await expect(trigger).toBeFocused();
      }
      await input.fill('0000-01-01');
      await expect(page.getByRole('button', { name: 'Test date', exact: true })).toBeVisible();
    } finally {
      await context.close();
    }
  });
}

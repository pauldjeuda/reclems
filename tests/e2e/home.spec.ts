import { test, expect } from '@playwright/test';
test('petition home page is available in both locales', async ({ page }) => {
  await page.goto('/fr');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Orange Cameroun');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Orange Cameroon');
});

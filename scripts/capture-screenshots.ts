import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const baseURL = process.env.SITE_URL || 'http://127.0.0.1:3000';
  const output = path.join(process.cwd(), 'docs', 'screenshots');
  const routes = [
    { name: 'home', path: '/fr' },
    { name: 'contact', path: '/fr/contact' },
    { name: 'merci', path: '/fr/merci' },
    { name: 'verify', path: '/fr/verify' },
    { name: 'admin', path: '/admin/login' }
  ];
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [360, 768, 1280]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1
      });
      for (const route of routes) {
        await page.goto(`${baseURL}${route.path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 120000
        });
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(output, `${route.name}-${width}.png`),
          fullPage: true,
          animations: 'disabled'
        });
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`Saved ${routes.length * 3} screenshots to ${output}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

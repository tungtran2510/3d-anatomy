import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('[Console]:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[PageError]:', err.message));
  await page.goto('http://localhost:4181', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  console.log('--- Clicking muscular checkbox ---');
  const res = await page.evaluate(async () => {
    const cb = document.querySelector('[data-system-checkbox="muscular"]');
    console.log('Found cb:', !!cb, 'checked before:', cb?.checked);
    if (cb) {
      cb.click();
      console.log('checked after:', cb.checked);
    }
  });
  await page.waitForTimeout(8000);
  console.log('--- Check complete ---');
  await browser.close();
}

run();

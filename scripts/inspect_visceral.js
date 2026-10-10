import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  await page.goto('http://localhost:4181', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Toggle Digestive and Respiratory
  await page.evaluate(async () => {
    const cbDigestive = document.querySelector('[data-system-checkbox="digestive"]');
    if (cbDigestive) cbDigestive.click();
    const cbRespiratory = document.querySelector('[data-system-checkbox="respiratory"]');
    if (cbRespiratory) cbRespiratory.click();
  });

  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d/inspect_visceral_live.png' });
  await browser.close();
  console.log('Visceral screenshot saved!');
}

run();

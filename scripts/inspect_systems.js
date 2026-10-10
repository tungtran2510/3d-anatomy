import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--use-gl=angle', '--use-angle=d3d11', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 });
  await page.goto('http://localhost:4181', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // 1. Cardiovascular inspection (focus on heart)
  console.log('Focusing on heart & cardiovascular...');
  await page.evaluate(async () => {
    if (typeof window.selectStructureAnywhere === 'function') {
      await window.selectStructureAnywhere('tim');
    }
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'inspect_cardiovascular_heart.png') });
  console.log('Saved heart screenshot');

  // 2. Nervous inspection (focus on brain / não)
  console.log('Focusing on brain...');
  await page.evaluate(async () => {
    if (typeof window.selectStructureAnywhere === 'function') {
      await window.selectStructureAnywhere('não');
    }
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'inspect_nervous_brain.png') });
  console.log('Saved brain screenshot');

  // 3. Digestive & Urinary (focus on dạ dày & thận)
  console.log('Focusing on stomach & kidney...');
  await page.evaluate(async () => {
    if (typeof window.selectStructureAnywhere === 'function') {
      await window.selectStructureAnywhere('dạ dày');
    }
  });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'inspect_digestive_stomach.png') });
  console.log('Saved stomach screenshot');

  await browser.close();
  console.log('All inspections completed!');
}

run();

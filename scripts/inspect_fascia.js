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
  await page.goto('http://localhost:4181', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(async () => {
    const cb = document.querySelector('[data-system-checkbox="muscular"]');
    if (cb) cb.click();
    await new Promise(r => setTimeout(r, 4000));
    const fasciaMeshes = [];
    const allMaterials = new Map();

    window.viewer?.scene?.traverse(c => {
      if (c.isMesh && (c.name || c.userData?.partId)) {
        const name = (c.name || c.userData?.partId || '').toLowerCase();
        const mat = c.material;
        const matName = mat?.name || 'unknown';
        allMaterials.set(matName, (allMaterials.get(matName) || 0) + 1);

        if (name.includes('fascia') || name.includes('retinaculum') || name.includes('sheath') || name.includes('aponeur')) {
          fasciaMeshes.push({ name: c.name, mat: matName, opacity: mat?.opacity, color: mat?.color?.getHexString(), visible: c.visible });
        }
      }
    });
    return {
      materialCounts: Object.fromEntries(allMaterials),
      fasciaCount: fasciaMeshes.length,
      sample: fasciaMeshes.slice(0, 15)
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

run();

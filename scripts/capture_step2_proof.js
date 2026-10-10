import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function run() {
  console.log('Starting Chromium for Step 2 visual verification...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--use-gl=angle',
      '--use-angle=d3d11',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  try {
    // ====================================================
    // 1. MÁY TÍNH (Desktop 1280x800)
    // ====================================================
    console.log('--- 1. "Máy tính" (1280x800) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1.5
    });
    const desktopPage = await desktopContext.newPage();
    desktopPage.on('console', msg => console.log('[Máy tính]:', msg.type(), msg.text()));
    await desktopPage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await desktopPage.waitForSelector('#threeCanvas', { timeout: 15000 });
    await desktopPage.waitForTimeout(5000);

    // Case 1A: "đĩa đệm" (Intervertebral disc L4-L5)
    console.log('Pinpoint "đĩa đệm"...');
    await desktopPage.evaluate(async () => {
      await window.selectStructureAnywhere('đĩa đệm', false);
    });
    await desktopPage.waitForTimeout(3000);
    const desktopDiscPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc2_dia_dem_chuan_xac.png');
    await desktopPage.screenshot({ path: desktopDiscPath, fullPage: false });
    console.log('Saved:', desktopDiscPath);

    // Case 1B: "ruột thừa" (Vermiform appendix)
    console.log('Pinpoint "ruột thừa"...');
    await desktopPage.evaluate(async () => {
      await window.selectStructureAnywhere('ruột thừa', false);
    });
    await desktopPage.waitForTimeout(3000);
    const desktopAppendixPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc2_ruot_thua_chuan_xac.png');
    await desktopPage.screenshot({ path: desktopAppendixPath, fullPage: false });
    console.log('Saved:', desktopAppendixPath);

    await desktopContext.close();

    // ====================================================
    // 2. ĐIỆN THOẠI (Mobile 390x844)
    // ====================================================
    console.log('--- 2. "Điện thoại" (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    mobilePage.on('console', msg => console.log('[Điện thoại]:', msg.type(), msg.text()));
    await mobilePage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mobilePage.waitForSelector('#threeCanvas', { timeout: 15000 });
    await mobilePage.waitForTimeout(5000);

    // Case 2A: "dây chằng chéo trước" (ACL)
    console.log('Pinpoint "dây chằng chéo trước"...');
    await mobilePage.evaluate(async () => {
      await window.selectStructureAnywhere('dây chằng chéo trước', false);
    });
    await mobilePage.waitForTimeout(3000);
    const mobileAclPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc2_acl_chuan_xac.png');
    await mobilePage.screenshot({ path: mobileAclPath, fullPage: false });
    console.log('Saved:', mobileAclPath);

    // Case 2B: "thần kinh tọa" (Sciatic nerve)
    console.log('Pinpoint "thần kinh tọa"...');
    await mobilePage.evaluate(async () => {
      await window.selectStructureAnywhere('thần kinh tọa', false);
    });
    await mobilePage.waitForTimeout(3000);
    const mobileSciaticPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc2_than_kinh_toa_chuan_xac.png');
    await mobilePage.screenshot({ path: mobileSciaticPath, fullPage: false });
    console.log('Saved:', mobileSciaticPath);

    // Case 2C: "cơ delta" (Deltoid muscle)
    console.log('Pinpoint "cơ delta"...');
    await mobilePage.evaluate(async () => {
      await window.selectStructureAnywhere('cơ delta', false);
    });
    await mobilePage.waitForTimeout(3000);
    const mobileDeltoidPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc2_co_delta_chuan_xac.png');
    await mobilePage.screenshot({ path: mobileDeltoidPath, fullPage: false });
    console.log('Saved:', mobileDeltoidPath);

    await mobileContext.close();

    console.log('Visual proof capture completed successfully for all 5 structures!');
  } catch (err) {
    console.error('Capture error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();

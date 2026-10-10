import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function capture() {
  console.log('Starting Playwright Chromium capture for Gut-Brain and Spinal Cord...');
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

  // ==========================================
  // 1. "Máy tính" (1280x800, DPR 1.5)
  // ==========================================
  console.log('--- 1. "Máy tính" Viewport (1280x800) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5
  });
  await desktopContext.addInitScript(() => {
    localStorage.setItem('pwa_installed', '1');
    localStorage.setItem('offline_prompt_dismissed', '1');
    localStorage.setItem('offline_all_cached', '1');
  });

  // Scene 1: Intelligent Search Dropdown with "trực não ruột"
  console.log('Capturing Search Dropdown for "trực não ruột" on "Máy tính"...');
  const page1 = await desktopContext.newPage();
  await page1.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page1.waitForTimeout(4500);
  await page1.evaluate(async () => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
    const input = document.getElementById('searchInput');
    if (input) {
      input.value = 'trực não ruột';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  });
  await page1.waitForTimeout(1500);
  const searchDropdownPath = path.join(ARTIFACT_DIR, 'minh_chung_may_tinh_tim_kiem_thong_minh.png');
  await page1.screenshot({ path: searchDropdownPath });
  console.log('Saved:', searchDropdownPath);
  await page1.close();

  // Scene 2: Trục Não – Ruột (Gut-Brain Axis) 3D Multi-Organ Isolation on "Máy tính"
  console.log('Capturing Trục Não – Ruột 3D Multi-Organ on "Máy tính"...');
  const page2 = await desktopContext.newPage();
  await page2.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page2.waitForTimeout(4500);
  await page2.evaluate(async () => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
    if (window.openClinicalAxesModal) {
      await window.openClinicalAxesModal('axis_gut_brain', window.viewer);
    }
  });
  await page2.waitForTimeout(4000);
  await page2.evaluate(() => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
  });
  const desktopGutBrainPath = path.join(ARTIFACT_DIR, 'minh_chung_may_tinh_buoc2_truc_nao_ruot.png');
  await page2.screenshot({ path: desktopGutBrainPath });
  console.log('Saved:', desktopGutBrainPath);
  await page2.close();

  // Scene 3: Trục Tủy Sống & Thần Kinh Gai Sống (Spinal Cord) on "Máy tính"
  console.log('Capturing Trục Tủy Sống Showcase on "Máy tính"...');
  const page3 = await desktopContext.newPage();
  await page3.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page3.waitForTimeout(4500);
  await page3.evaluate(async () => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('spinal_cord', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
  });
  await page3.waitForTimeout(4500);
  await page3.evaluate(() => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
  });
  const desktopSpinalCordPath = path.join(ARTIFACT_DIR, 'minh_chung_may_tinh_buoc2_tuy_song.png');
  await page3.screenshot({ path: desktopSpinalCordPath });
  console.log('Saved:', desktopSpinalCordPath);
  await page3.close();

  await desktopContext.close();

  // ==========================================
  // 2. "Điện thoại" (390x844, DPR 2.0, Touch)
  // ==========================================
  console.log('--- 2. "Điện thoại" Viewport (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  await mobileContext.addInitScript(() => {
    localStorage.setItem('pwa_installed', '1');
    localStorage.setItem('offline_prompt_dismissed', '1');
    localStorage.setItem('offline_all_cached', '1');
  });

  // Scene 4: Trục Não – Ruột on "Điện thoại"
  console.log('Capturing Trục Não – Ruột on "Điện thoại"...');
  const mPage1 = await mobileContext.newPage();
  await mPage1.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage1.waitForTimeout(4500);
  await mPage1.evaluate(async () => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
    if (window.openClinicalAxesModal) {
      await window.openClinicalAxesModal('axis_gut_brain', window.viewer);
    }
  });
  await mPage1.waitForTimeout(4000);
  await mPage1.evaluate(() => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
  });
  const mobileGutBrainPath = path.join(ARTIFACT_DIR, 'minh_chung_dien_thoai_buoc2_truc_nao_ruot.png');
  await mPage1.screenshot({ path: mobileGutBrainPath });
  console.log('Saved:', mobileGutBrainPath);
  await mPage1.close();

  // Scene 5: Trục Tủy Sống on "Điện thoại"
  console.log('Capturing Trục Tủy Sống on "Điện thoại"...');
  const mPage2 = await mobileContext.newPage();
  await mPage2.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage2.waitForTimeout(4500);
  await mPage2.evaluate(async () => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('spinal_cord', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('half');
    }
  });
  await mPage2.waitForTimeout(4500);
  await mPage2.evaluate(() => {
    document.getElementById('offlinePromptBanner')?.remove();
    document.getElementById('pwaInstallPromptBanner')?.remove();
  });
  const mobileSpinalCordPath = path.join(ARTIFACT_DIR, 'minh_chung_dien_thoai_buoc2_tuy_song.png');
  await mPage2.screenshot({ path: mobileSpinalCordPath });
  console.log('Saved:', mobileSpinalCordPath);
  await mPage2.close();

  await mobileContext.close();
  await browser.close();
  console.log('Capture finished successfully!');
}

capture().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});

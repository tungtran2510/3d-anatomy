import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function capture() {
  console.log('Starting Chromium for Whole System Showcase visual verification...');
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

  // --- 1. "Máy tính" (1280x800) ---
  console.log('--- 1. "Máy tính" (1280x800) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5
  });
  const desktopPage = await desktopContext.newPage();
  desktopPage.on('console', msg => console.log('[Máy tính]:', msg.type(), msg.text()));

  await desktopPage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await desktopPage.waitForTimeout(4500);

  // Showcase 1: Hệ Tiêu hóa (Whole Digestive System)
  console.log('Showcase Hệ Tiêu hóa on "Máy tính"...');
  await desktopPage.evaluate(async () => {
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('digestive', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
  });
  await desktopPage.waitForTimeout(3000);

  const desktopDigestivePath = path.join(ARTIFACT_DIR, 'minh_chung_may_tinh_he_tieu_hoa_toan_the.png');
  await desktopPage.screenshot({ path: desktopDigestivePath });
  console.log('Saved:', desktopDigestivePath);

  // Showcase 2: Trục Cột sống Toàn Thể (Spine)
  console.log('Showcase Trục Cột sống on "Máy tính"...');
  await desktopPage.evaluate(async () => {
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('spine', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
  });
  await desktopPage.waitForTimeout(3000);

  const desktopSpinePath = path.join(ARTIFACT_DIR, 'minh_chung_may_tinh_truc_cot_song_toan_the.png');
  await desktopPage.screenshot({ path: desktopSpinePath });
  console.log('Saved:', desktopSpinePath);

  await desktopContext.close();

  // --- 2. "Điện thoại" (390x844) ---
  console.log('--- 2. "Điện thoại" (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('console', msg => console.log('[Điện thoại]:', msg.type(), msg.text()));

  await mobilePage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForTimeout(4500);

  // Showcase 3: Hệ Tim mạch & Tuần hoàn on "Điện thoại"
  console.log('Showcase Hệ Tim mạch on "Điện thoại"...');
  await mobilePage.evaluate(async () => {
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('cardiovascular', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
  });
  await mobilePage.waitForTimeout(3000);

  const mobileCardioPath = path.join(ARTIFACT_DIR, 'minh_chung_dien_thoai_he_tuan_hoan_toan_the.png');
  await mobilePage.screenshot({ path: mobileCardioPath });
  console.log('Saved:', mobileCardioPath);

  // Showcase 4: Hệ Thần kinh on "Điện thoại"
  console.log('Showcase Hệ Thần kinh on "Điện thoại"...');
  await mobilePage.evaluate(async () => {
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('nervous', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('compact');
    }
  });
  await mobilePage.waitForTimeout(3000);

  const mobileNervousPath = path.join(ARTIFACT_DIR, 'minh_chung_dien_thoai_he_than_kinh_toan_the.png');
  await mobilePage.screenshot({ path: mobileNervousPath });
  console.log('Saved:', mobileNervousPath);

  // Showcase 5: Hệ Tiêu hóa with Expanded Sheet (Key Organs Chips) on "Điện thoại"
  console.log('Showcase Hệ Tiêu hóa with Key Organ Chips on "Điện thoại"...');
  await mobilePage.evaluate(async () => {
    if (window.showcaseWholeSystem) {
      await window.showcaseWholeSystem('digestive', window.viewer, { autoSpeak: false });
    }
    const card = document.getElementById('selectionCard');
    if (card) {
      card.classList.remove('hidden');
      if (window.setSheetSnapTier) window.setSheetSnapTier('half');
    }
  });
  await mobilePage.waitForTimeout(3000);

  const mobileDigestiveExpandedPath = path.join(ARTIFACT_DIR, 'minh_chung_dien_thoai_he_tieu_hoa_co_quan_chinh.png');
  await mobilePage.screenshot({ path: mobileDigestiveExpandedPath });
  console.log('Saved:', mobileDigestiveExpandedPath);

  await mobileContext.close();
  await browser.close();
  console.log('Visual proof capture completed successfully for all Whole System showcases!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});

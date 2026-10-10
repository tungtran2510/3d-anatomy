import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function run() {
  console.log('Starting Playwright Chromium...');
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
    // ----------------------------------------------------
    // 1. MÁY TÍNH (Desktop 1280x800)
    // ----------------------------------------------------
    console.log('Opening "Máy tính" (1280x800)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1.5
    });
    const desktopPage = await desktopContext.newPage();
    desktopPage.on('console', msg => console.log('[Browser Desktop]:', msg.type(), msg.text()));
    desktopPage.on('pageerror', err => console.error('[Page Desktop Error]:', err));
    await desktopPage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for canvas and initial model load
    await desktopPage.waitForSelector('#threeCanvas', { timeout: 15000 });
    console.log('Canvas found (#threeCanvas), waiting for initial 3D scene stabilization...');
    await desktopPage.waitForTimeout(6000);

    // Call smart pinpoint for "thần kinh tọa" (Sciatic nerve)
    console.log('Triggering selectStructureAnywhere for "thần kinh tọa"...');
    await desktopPage.evaluate(async () => {
      if (typeof window.selectStructureAnywhere === 'function') {
        await window.selectStructureAnywhere('thần kinh tọa');
      }
    });

    // Wait for camera animation, ghosting shader, and card update
    await desktopPage.waitForTimeout(3500);

    const desktopImgPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc1_pbr_buoc2_dinh_vi.png');
    await desktopPage.screenshot({ path: desktopImgPath, fullPage: false });
    console.log('Saved "Máy tính" compact screenshot to:', desktopImgPath);

    // Expand the card to show clinical 3-bullet points & smart chips
    console.log('Expanding card on "Máy tính"...');
    await desktopPage.evaluate(() => {
      document.getElementById('miniBarExpandTrigger')?.click();
    });
    await desktopPage.waitForTimeout(1000);
    const desktopExpandedPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_chi_tiet_lam_sang.png');
    await desktopPage.screenshot({ path: desktopExpandedPath, fullPage: false });
    console.log('Saved "Máy tính" expanded screenshot to:', desktopExpandedPath);

    await desktopContext.close();

    // ----------------------------------------------------
    // 2. ĐIỆN THOẠI (Mobile 390x844)
    // ----------------------------------------------------
    console.log('Opening "Điện thoại" (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    mobilePage.on('console', msg => console.log('[Browser Mobile]:', msg.type(), msg.text()));
    mobilePage.on('pageerror', err => console.error('[Page Mobile Error]:', err));
    await mobilePage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });

    await mobilePage.waitForSelector('#threeCanvas', { timeout: 15000 });
    console.log('Canvas found on "Điện thoại" (#threeCanvas), waiting for 3D scene stabilization...');
    await mobilePage.waitForTimeout(6000);

    // Call smart pinpoint for "dây chằng chéo trước" (ACL)
    console.log('Triggering selectStructureAnywhere for "dây chằng chéo trước"...');
    await mobilePage.evaluate(async () => {
      if (typeof window.selectStructureAnywhere === 'function') {
        await window.selectStructureAnywhere('dây chằng chéo trước');
      }
    });

    // Wait for camera focus, ghosting, and bottom sheet
    await mobilePage.waitForTimeout(3500);

    const mobileImgPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc1_pbr_buoc2_dinh_vi.png');
    await mobilePage.screenshot({ path: mobileImgPath, fullPage: false });
    console.log('Saved "Điện thoại" compact screenshot to:', mobileImgPath);

    // Expand the card to show clinical 3-bullet points & smart chips
    console.log('Expanding card on "Điện thoại"...');
    await mobilePage.evaluate(() => {
      document.getElementById('miniBarExpandTrigger')?.click();
    });
    await mobilePage.waitForTimeout(1000);
    const mobileExpandedPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_chi_tiet_lam_sang.png');
    await mobilePage.screenshot({ path: mobileExpandedPath, fullPage: false });
    console.log('Saved "Điện thoại" expanded screenshot to:', mobileExpandedPath);

    await mobileContext.close();

    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();

import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function run() {
  console.log('Khởi chạy Chromium chụp ảnh minh chứng thực tế Bước 4...');
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
    // 1. ĐIỆN THOẠI (Mobile Viewport: 390x844)
    // ====================================================
    console.log('--- 1. "Điện thoại" (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.addInitScript(() => {
      localStorage.setItem('pwa_installed', '1');
      localStorage.setItem('pwa_install_dismissed', '1');
    });
    mobilePage.on('console', msg => console.log('[Điện thoại]:', msg.type(), msg.text()));

    await mobilePage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mobilePage.addStyleTag({ content: '#pwaInstallPrompt, .pwa-install-prompt { display: none !important; }' });
    await mobilePage.waitForSelector('#threeCanvas', { timeout: 15000 });
    await mobilePage.waitForTimeout(4000);

    // 1A. Thao tác 1-chạm: Cô lập (Isolate) Quả tim & Mạch vành
    console.log('Thao tác 1A: Cô lập (Isolate) Quả tim & Mạch vành trên Điện thoại...');
    await mobilePage.evaluate(async () => {
      await window.showcasePathology('coronary_artery_disease', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(2000);

    // Bấm nút "Cô lập" (#btnMiniIsolate) 1-chạm
    await mobilePage.evaluate(() => {
      document.getElementById('btnMiniIsolate')?.click();
    });
    await mobilePage.waitForTimeout(3000);

    const mobileHeartPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc4_co_lap_tim.png');
    await mobilePage.screenshot({ path: mobileHeartPath, fullPage: false });
    console.log('Đã lưu minh chứng 1A:', mobileHeartPath);

    // 1B. Thao tác 1-chạm: Cô lập (Isolate) Khớp gối & Dây chằng
    console.log('Thao tác 1B: Cô lập (Isolate) Khớp gối trên Điện thoại...');
    await mobilePage.evaluate(async () => {
      const { restoreAllParts } = await import('./src/viewer/visibility.js');
      restoreAllParts();
      await window.showcasePathology('knee_acl', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(2000);

    await mobilePage.evaluate(() => {
      document.getElementById('btnMiniIsolate')?.click();
    });
    await mobilePage.waitForTimeout(3000);

    const mobileKneePath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc4_co_lap_khop_goi.png');
    await mobilePage.screenshot({ path: mobileKneePath, fullPage: false });
    console.log('Đã lưu minh chứng 1B:', mobileKneePath);

    // 1C. Thao tác 1-chạm: Ẩn vật cản (Hide Anterior Obstacles) Xương sườn che ngực
    console.log('Thao tác 1C: Ẩn vật cản (Hide) Xương sườn che chắn phía trước...');
    await mobilePage.evaluate(async () => {
      const { restoreAllParts } = await import('./src/viewer/visibility.js');
      restoreAllParts();
      await window.showcasePathology('coronary_artery_disease', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(2000);

    // Bấm nút "Ẩn đi" (#btnMiniHide) để bóc tách vật cản phía trước
    await mobilePage.evaluate(() => {
      document.getElementById('btnMiniHide')?.click();
    });
    await mobilePage.waitForTimeout(3000);

    const mobileHidePath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc4_an_vat_can_nguc.png');
    await mobilePage.screenshot({ path: mobileHidePath, fullPage: false });
    console.log('Đã lưu minh chứng 1C:', mobileHidePath);

    // 1D. Bóc tách tầng (Dissection HUD 4 tầng: Nông ➔ Giữa ➔ Sâu ➔ Xương)
    console.log('Thao tác 1D: Bóc tách tầng (Dissection HUD) trên Điện thoại...');
    await mobilePage.evaluate(async () => {
      const { restoreAllParts } = await import('./src/viewer/visibility.js');
      const { deselectPart } = await import('./src/viewer/selection.js');
      restoreAllParts();
      deselectPart();
      // Bật chế độ bóc tách
      document.getElementById('btnNavDissect')?.click();
    });
    await mobilePage.waitForTimeout(1500);

    // Chọn tầng "Sâu" (data-stage="3") trên HUD
    await mobilePage.evaluate(() => {
      const btn = document.querySelector('#dissectionLayerHud button[data-stage="3"]');
      btn?.click();
    });
    await mobilePage.waitForTimeout(3000);

    const mobileDissectPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc4_boc_tach_tang.png');
    await mobilePage.screenshot({ path: mobileDissectPath, fullPage: false });
    console.log('Đã lưu minh chứng 1D:', mobileDissectPath);

    await mobileContext.close();

    // ====================================================
    // 2. MÁY TÍNH (Desktop Viewport: 1280x800)
    // ====================================================
    console.log('--- 2. "Máy tính" (1280x800) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1.5
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.addInitScript(() => {
      localStorage.setItem('pwa_installed', '1');
      localStorage.setItem('pwa_install_dismissed', '1');
    });
    desktopPage.on('console', msg => console.log('[Máy tính]:', msg.type(), msg.text()));

    await desktopPage.goto('http://localhost:4181', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await desktopPage.addStyleTag({ content: '#pwaInstallPrompt, .pwa-install-prompt { display: none !important; }' });
    await desktopPage.waitForSelector('#threeCanvas', { timeout: 15000 });
    await desktopPage.waitForTimeout(4000);

    // 2A. Cô lập Đốt sống L4 (FSU Functional Spinal Unit) kèm Đĩa đệm L4-L5
    console.log('Thao tác 2A: Cô lập FSU Đốt sống L4 & Đĩa đệm trên Máy tính...');
    await desktopPage.evaluate(async () => {
      await window.showcasePathology('disc_herniation', window.viewer, { autoSpeak: false });
    });
    await desktopPage.waitForTimeout(2000);

    await desktopPage.evaluate(() => {
      document.getElementById('btnMiniIsolate')?.click();
    });
    await desktopPage.waitForTimeout(3000);

    const desktopFsuPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc4_co_lap_dot_song_fsu.png');
    await desktopPage.screenshot({ path: desktopFsuPath, fullPage: false });
    console.log('Đã lưu minh chứng 2A:', desktopFsuPath);

    // 2B. Bóc tách tầng sâu (Lớp 3: Bóc cơ, lộ tạng, mạch & thần kinh)
    console.log('Thao tác 2B: Bóc tách tầng sâu trên Máy tính...');
    await desktopPage.evaluate(async () => {
      const { restoreAllParts } = await import('./src/viewer/visibility.js');
      const { deselectPart } = await import('./src/viewer/selection.js');
      const { applyDepth } = await import('./src/ui/depthSlider.js');
      restoreAllParts();
      deselectPart();
      applyDepth(3, true);
    });
    await desktopPage.waitForTimeout(3500);

    const desktopDeepPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc4_boc_tach_tang_sau.png');
    await desktopPage.screenshot({ path: desktopDeepPath, fullPage: false });
    console.log('Đã lưu minh chứng 2B:', desktopDeepPath);

    await desktopContext.close();
    console.log('=== TOÀN BỘ 6 ẢNH MINH CHỨNG BƯỚC 4 ĐÃ ĐƯỢC CHỤP THÀNH CÔNG ===');
  } catch (err) {
    console.error('Lỗi khi chụp ảnh minh chứng:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();

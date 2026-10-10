import { pathToFileURL } from 'url';
const playwrightPath = 'C:/Users/Admin/.agent-reach/tools/npm-global/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(playwrightPath).href);
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d';

async function run() {
  console.log('Starting Chromium for Step 3 High-Yield Clinical Pathology verification...');
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
    await desktopPage.waitForTimeout(4000);

    // Case 1A: Rách gân chóp xoay vai (Rotator Cuff Tear)
    console.log('Showcasing 1A: "rotator_cuff_tear"...');
    await desktopPage.evaluate(async () => {
      await window.showcasePathology('rotator_cuff_tear', window.viewer, { autoSpeak: false });
    });
    await desktopPage.waitForTimeout(3500);
    const desktopRotatorPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc3_rach_chop_xoay.png');
    await desktopPage.screenshot({ path: desktopRotatorPath, fullPage: false });
    console.log('Saved:', desktopRotatorPath);

    // Case 1B: Viêm ruột thừa cấp & Biến chứng vỡ mủ (Acute Appendicitis)
    console.log('Showcasing 1B: "acute_appendicitis"...');
    await desktopPage.evaluate(async () => {
      await window.showcasePathology('acute_appendicitis', window.viewer, { autoSpeak: false });
    });
    await desktopPage.waitForTimeout(3500);
    const desktopAppendixPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc3_viem_ruot_thua.png');
    await desktopPage.screenshot({ path: desktopAppendixPath, fullPage: false });
    console.log('Saved:', desktopAppendixPath);

    // Case 1C: Thoát vị đĩa đệm L4-L5 chèn ép rễ thần kinh (Disc Herniation)
    console.log('Showcasing 1C: "disc_herniation"...');
    await desktopPage.evaluate(async () => {
      await window.showcasePathology('disc_herniation', window.viewer, { autoSpeak: false });
    });
    await desktopPage.waitForTimeout(3500);
    const desktopDiscPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc3_thoat_vi_dia_dem.png');
    await desktopPage.screenshot({ path: desktopDiscPath, fullPage: false });
    console.log('Saved:', desktopDiscPath);

    // Case 1D: Trào ngược dạ dày thực quản (GERD)
    console.log('Showcasing 1D: "gerd_reflux"...');
    await desktopPage.evaluate(async () => {
      await window.showcasePathology('gerd_reflux', window.viewer, { autoSpeak: false });
    });
    await desktopPage.waitForTimeout(3500);
    const desktopGerdPath = path.join(ARTIFACTS_DIR, 'minh_chung_may_tinh_buoc3_gerd_trao_nguoc.png');
    await desktopPage.screenshot({ path: desktopGerdPath, fullPage: false });
    console.log('Saved:', desktopGerdPath);

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
    await mobilePage.waitForTimeout(4000);

    // Case 2A: Rách sụn chêm & Đứt dây chằng chéo trước (Meniscus Tear & ACL)
    console.log('Showcasing 2A: "knee_meniscus_tear"...');
    await mobilePage.evaluate(async () => {
      await window.showcasePathology('knee_meniscus_tear', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(3500);
    const mobileMeniscusPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc3_rach_sun_chem.png');
    await mobilePage.screenshot({ path: mobileMeniscusPath, fullPage: false });
    console.log('Saved:', mobileMeniscusPath);

    // Case 2B: Chèn ép dây thần kinh tọa (Sciatica)
    console.log('Showcasing 2B: "sciatica_nerve"...');
    await mobilePage.evaluate(async () => {
      await window.showcasePathology('sciatica_nerve', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(3500);
    const mobileSciaticaPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc3_than_kinh_toa.png');
    await mobilePage.screenshot({ path: mobileSciaticaPath, fullPage: false });
    console.log('Saved:', mobileSciaticaPath);

    // Case 2C: Hẹp xơ vữa động mạch vành (Coronary Artery Disease)
    console.log('Showcasing 2C: "coronary_artery_disease"...');
    await mobilePage.evaluate(async () => {
      await window.showcasePathology('coronary_artery_disease', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(3500);
    const mobileCoronaryPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc3_mach_vanh.png');
    await mobilePage.screenshot({ path: mobileCoronaryPath, fullPage: false });
    console.log('Saved:', mobileCoronaryPath);

    // Case 2D: Sỏi thận - niệu quản & Cơn đau quặn thận (Kidney Stones)
    console.log('Showcasing 2D: "kidney_stones"...');
    await mobilePage.evaluate(async () => {
      await window.showcasePathology('kidney_stones', window.viewer, { autoSpeak: false });
    });
    await mobilePage.waitForTimeout(3500);
    const mobileKidneyPath = path.join(ARTIFACTS_DIR, 'minh_chung_dien_thoai_buoc3_soi_than.png');
    await mobilePage.screenshot({ path: mobileKidneyPath, fullPage: false });
    console.log('Saved:', mobileKidneyPath);

    await mobileContext.close();

    console.log('✅ All Step 3 clinical pathology visual proofs captured successfully!');
  } catch (err) {
    console.error('Error during Step 3 screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();

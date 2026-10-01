import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await page.goto("http://localhost:8088/3d/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.click("#btnNavSystems");
  await page.waitForTimeout(500);

  // Scroll down to see more categories in Views tab
  const modalBody = page.locator("#atlasHubBody");
  await modalBody.evaluate(el => el.scrollTo({ top: 700, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d/verify_atlas_views_scroll_mid.png" });

  await modalBody.evaluate(el => el.scrollTo({ top: 1600, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d/verify_atlas_views_scroll_bottom.png" });

  // Click on "Phân vùng" filter chip
  await page.click('[data-filter="regions"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: "C:/Users/Admin/.gemini/antigravity/brain/599c16c7-5563-4eb6-af15-4443741e4c8d/verify_atlas_views_regions_chip.png" });

  await browser.close();
  console.log("Screenshots captured successfully");
}

run().catch(console.error);

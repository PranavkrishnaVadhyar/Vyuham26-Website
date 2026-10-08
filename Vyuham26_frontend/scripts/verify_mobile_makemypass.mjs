import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // iPhone 14 dimensions
  await page.setViewportSize({ width: 390, height: 844 });

  await page.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham:intro_done", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await page.goto("http://localhost:5174#events");
  await page.waitForTimeout(2000);

  // Switch to MATRIX view
  const matrixBtn = await page.$("button:has-text('MATRIX')");
  if (matrixBtn) {
    await matrixBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click on Hackathon card
  const hackTitle = await page.$("h3:has-text('Hackathon')");
  if (hackTitle) {
    await hackTitle.click({ force: true });
    await page.waitForTimeout(1200);
  }

  await page.screenshot({ path: "makemypass_mobile_dossier.png" });
  console.log("Saved mobile screenshot: makemypass_mobile_dossier.png");

  await browser.close();
}

run().catch(console.error);

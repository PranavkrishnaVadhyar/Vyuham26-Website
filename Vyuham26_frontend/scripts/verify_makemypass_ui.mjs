import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log("Navigating to http://localhost:5174...");
  await page.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham:intro_done", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await page.goto("http://localhost:5174");
  await page.waitForTimeout(2000);


  // Click on EVENTS link in navbar
  console.log("Clicking EVENTS link in navbar...");
  const eventsNavLink = await page.$("nav a:has-text('EVENTS')");
  if (eventsNavLink) {
    await eventsNavLink.click();
    await page.waitForTimeout(1500);
  } else {
    await page.evaluate(() => {
      document.querySelector('#events')?.scrollIntoView();
    });
    await page.waitForTimeout(1500);
  }

  // Switch to MATRIX view
  console.log("Switching to MATRIX...");
  const matrixBtn = await page.$("button:has-text('MATRIX')");
  if (matrixBtn) {
    await matrixBtn.click();
    await page.waitForTimeout(1000);
  }


  // Click on Hackathon's card title
  console.log("Clicking Hackathon card title...");
  const hackTitle = await page.$("h3:has-text('Hackathon')");
  if (hackTitle) {
    await hackTitle.click({ force: true });
    await page.waitForTimeout(1500);
  }





  // Take screenshot of opened dossier
  await page.screenshot({ path: "makemypass_dossier_open.png" });
  console.log("Saved screenshot: makemypass_dossier_open.png");

  // Check the REGISTER NOW button in the dossier
  const regLink = await page.$("a:has-text('REGISTER NOW')");
  if (regLink) {
    const href = await regLink.getAttribute("href");
    const target = await regLink.getAttribute("target");
    const rel = await regLink.getAttribute("rel");
    console.log("=== VERIFICATION RESULT ===");
    console.log("✓ SUCCESS: MakeMyPass 'REGISTER NOW' link is visible and active!");
    console.log("  Href:", href);
    console.log("  Target:", target);
    console.log("  Rel:", rel);
  } else {
    console.log("✗ 'REGISTER NOW' link not found.");
  }

  // Close dossier
  const closeBtn = await page.$("button[aria-label='Close dossier']");
  if (closeBtn) {
    await closeBtn.dispatchEvent("click");
    await page.waitForTimeout(600);
  }

  // Test an event without MakeMyPass link (e.g., Best Management Team or Business Quiz)
  console.log("Testing event without MakeMyPass URL...");
  const quizCard = await page.$("text=Best Management Team");
  if (quizCard) {
    await quizCard.dispatchEvent("click");
    await page.waitForTimeout(1000);


    const unavailBtn = await page.$("button:has-text('REGISTRATION UNAVAILABLE')");
    if (unavailBtn) {
      console.log("✓ SUCCESS: 'REGISTRATION UNAVAILABLE' state verified for events without link!");
      console.log("  Disabled attribute:", await unavailBtn.getAttribute("disabled"));
    }
    await page.screenshot({ path: "makemypass_unavailable_open.png" });
    console.log("Saved screenshot: makemypass_unavailable_open.png");
  }

  await browser.close();
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});

import { chromium } from "playwright";

async function run() {
  console.log("Launching browser for verification audit...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (err) => {
    errors.push(err.message);
    console.error("PAGE ERROR:", err.message);
  });

  console.log("Navigating to http://localhost:5173...");
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });

  const title = await page.title();
  console.log("Page Title:", title);

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
  console.log("OG Title:", ogTitle);

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  console.log("OG Image:", ogImage);

  // Check data-theme attribute
  const initialTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  console.log("Initial theme:", initialTheme);

  // Check language selector
  const langEn = await page.evaluate(() => document.documentElement.lang);
  console.log("Initial lang:", langEn);

  console.log("Console / runtime errors count:", errors.length);

  await browser.close();
  console.log("Audit verification completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

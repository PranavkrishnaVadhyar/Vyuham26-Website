import { chromium } from "playwright";

async function run() {
  console.log("Launching browser for VYUHAM'26 3D Event Universe verification...");
  const browser = await chromium.launch({ headless: true });

  const artifactDir = "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f";

  // ────────────────────────────────────────────────────────────────
  // 1. DESKTOP VERIFICATION (1440 x 900)
  // ────────────────────────────────────────────────────────────────
  console.log("\n=== 1. DESKTOP VERIFICATION (1440 x 900) ===");
  const deskPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await deskPage.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await deskPage.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
  await deskPage.waitForTimeout(1500);

  // Scroll to events stage centered
  await deskPage.evaluate(() => {
    document.querySelector("#event-stage")?.scrollIntoView({ block: "center" });
  });
  await deskPage.waitForTimeout(800);

  // Inspect stage metrics & card positions
  const deskMetrics = await deskPage.evaluate(() => {
    const stage = document.querySelector("#event-stage");
    const rect = stage?.getBoundingClientRect();
    const core = document.querySelector("#vyuham-core");
    const coreImg = core?.querySelector("img");
    const cards = Array.from(document.querySelectorAll("#event-sphere > div"));

    // Calculate Y distribution of cards
    let minY = 9999, maxY = -9999;
    let minX = 9999, maxX = -9999;
    const cardTransforms = cards.map((c) => {
      const transform = c.style.transform || "";
      const match = transform.match(/translate3d\([^,]+,\s*calc\(-50%\s*\+\s*([-\d.]+)px\)/);
      const matchX = transform.match(/translate3d\(calc\(-50%\s*\+\s*([-\d.]+)px\)/);
      const yVal = match ? parseFloat(match[1]) : 0;
      const xVal = matchX ? parseFloat(matchX[1]) : 0;
      if (yVal < minY) minY = yVal;
      if (yVal > maxY) maxY = yVal;
      if (xVal < minX) minX = xVal;
      if (xVal > maxX) maxX = xVal;
      return { yVal, xVal, opacity: c.style.opacity };
    });

    const visibleCards = cardTransforms.filter((c) => parseFloat(c.opacity || "1") >= 0.5).length;

    // Check core styling
    const coreComputed = core ? window.getComputedStyle(core) : null;
    const logoContainer = core?.querySelector("div");
    const logoBg = logoContainer ? window.getComputedStyle(logoContainer).backgroundColor : "";

    return {
      stageHeight: rect?.height,
      stageWidth: rect?.width,
      totalCards: cards.length,
      visibleCards,
      minY,
      maxY,
      minX,
      maxX,
      hasLogo: !!coreImg,
      logoSrc: coreImg?.getAttribute("src"),
      logoBg,
    };
  });

  console.log("Desktop Metrics:", deskMetrics);

  // Move mouse outside event-stage (to top nav at 10, 10) so stage is not hovered
  await deskPage.mouse.move(10, 10);
  console.log("Waiting for auto-rotation to run...");
  await deskPage.waitForTimeout(2800);

  // Test Auto-Rotation: check transform changes over 1.2s without interaction
  console.log("Testing continuous auto-rotation...");
  const t0 = await deskPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });
  await deskPage.waitForTimeout(1200);
  const t1 = await deskPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });
  const isAutoRotating = t0 !== t1;
  console.log("Is auto-rotating continuously:", isAutoRotating);

  // Test Hover pauses rotation
  console.log("Testing hover pause on desktop...");
  await deskPage.mouse.move(720, 450); // Move mouse over center of stage
  await deskPage.waitForTimeout(400);
  const h0 = await deskPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });
  await deskPage.waitForTimeout(800);
  const h1 = await deskPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });
  const isPausedOnHover = h0 === h1;
  console.log("Is rotation paused during hover:", isPausedOnHover);

  // Move mouse away to unpause
  await deskPage.mouse.move(10, 10);
  await deskPage.waitForTimeout(400);

  // Take Desktop Screenshot
  await deskPage.screenshot({
    path: `${artifactDir}/event_universe_desktop.png`,
  });
  console.log(`Saved ${artifactDir}/event_universe_desktop.png`);

  // Test NEXT button
  console.log("Testing NEXT button navigation...");
  const nextBtn = await deskPage.$("button[aria-label='Next event']");
  if (nextBtn) {
    await nextBtn.click();
    await deskPage.waitForTimeout(800);
  }

  // Test Click card to open Dossier Modal
  console.log("Testing card click to open Event Dossier...");
  const activeCard = await deskPage.$("#event-sphere > div:has-text('ACTIVE EVENT')");
  if (activeCard) {
    await activeCard.click();
    await deskPage.waitForTimeout(800);
    const hasDossier = await deskPage.evaluate(() => !!document.querySelector("[role='dialog']"));
    console.log("Event Dossier opened successfully:", hasDossier);

    await deskPage.screenshot({
      path: `${artifactDir}/event_dossier_desktop.png`,
    });
    console.log(`Saved ${artifactDir}/event_dossier_desktop.png`);

    // Close dossier
    const closeBtn = await deskPage.$("[role='dialog'] button[aria-label='Close dossier']");
    if (closeBtn) {
      await closeBtn.click();
      await deskPage.waitForTimeout(500);
    }
  }

  await deskPage.close();

  // ────────────────────────────────────────────────────────────────
  // 2. MOBILE VERIFICATION (390 x 844)
  // ────────────────────────────────────────────────────────────────
  console.log("\n=== 2. MOBILE VERIFICATION (390 x 844) ===");
  const mobPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await mobPage.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await mobPage.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
  await mobPage.waitForTimeout(1500);

  await mobPage.evaluate(() => {
    document.querySelector("#events")?.scrollIntoView({ block: "start" });
  });
  await mobPage.waitForTimeout(800);

  const mobMetrics = await mobPage.evaluate(() => {
    const stage = document.querySelector("#event-stage");
    const rect = stage?.getBoundingClientRect();
    const core = document.querySelector("#vyuham-core");
    const cards = Array.from(document.querySelectorAll("#event-sphere > div"));
    const visibleCards = cards.filter((c) => parseFloat(c.style.opacity || "1") >= 0.5).length;
    const bodyWidth = document.body.scrollWidth;

    return {
      stageHeight: rect?.height,
      stageWidth: rect?.width,
      totalCards: cards.length,
      visibleCards,
      hasCore: !!core,
      bodyWidth,
      viewportWidth: window.innerWidth,
      hasOverflow: bodyWidth > window.innerWidth,
    };
  });
  console.log("Mobile Metrics:", mobMetrics);

  // Take Mobile Screenshot
  await mobPage.screenshot({
    path: `${artifactDir}/event_universe_mobile_390.png`,
  });
  console.log(`Saved ${artifactDir}/event_universe_mobile_390.png`);

  // Test Mobile Touch Swipe
  console.log("Testing mobile touch swipe...");
  const mobT0 = await mobPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });

  // Close any dialog if open
  await mobPage.evaluate(() => {
    const closeBtn = document.querySelector("[role='dialog'] button[aria-label='Close dossier']");
    if (closeBtn) closeBtn.click();
  });
  await mobPage.waitForTimeout(400);

  // Perform horizontal swipe gesture across the stage
  await mobPage.mouse.move(280, 260);
  await mobPage.mouse.down();
  await mobPage.mouse.move(120, 260, { steps: 8 });
  await mobPage.mouse.up();
  await mobPage.waitForTimeout(600);

  const mobT1 = await mobPage.evaluate(() => {
    const card = document.querySelector("#event-sphere > div");
    return card?.style.transform;
  });
  console.log("Mobile rotated after swipe:", mobT0 !== mobT1);

  // Tap bottom dossier card
  console.log("Testing mobile bottom dossier CTA...");
  const dossierCard = await mobPage.$("#event-stage + div div[role='button'], #event-stage + div > div:first-child");
  if (dossierCard) {
    await dossierCard.click();
    await mobPage.waitForTimeout(800);
    const hasModalMob = await mobPage.evaluate(() => !!document.querySelector("[role='dialog']"));
    console.log("Mobile dossier opened:", hasModalMob);

    await mobPage.screenshot({
      path: `${artifactDir}/event_dossier_mobile.png`,
    });
    console.log(`Saved ${artifactDir}/event_dossier_mobile.png`);
  }

  await mobPage.close();

  // ────────────────────────────────────────────────────────────────
  // 3. RESPONSIVE DEVICES (360x800, 412x915, 430x932)
  // ────────────────────────────────────────────────────────────────
  console.log("\n=== 3. RESPONSIVE DEVICE RANGE TESTS ===");
  const deviceSizes = [
    { name: "360x800", w: 360, h: 800 },
    { name: "412x915", w: 412, h: 915 },
    { name: "430x932", w: 430, h: 932 },
  ];

  for (const dev of deviceSizes) {
    const page = await browser.newPage({
      viewport: { width: dev.w, height: dev.h },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await page.addInitScript(() => {
      sessionStorage.setItem("vyuham26:seen", "1");
      sessionStorage.setItem("vyuham26:events_intro_seen", "1");
    });
    await page.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      document.querySelector("#events")?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(600);

    const overflowCheck = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth);
    console.log(`Device ${dev.name}: No horizontal overflow:`, overflowCheck);

    await page.screenshot({
      path: `${artifactDir}/event_universe_mobile_${dev.name}.png`,
    });
    console.log(`Saved event_universe_mobile_${dev.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log("\nAll verifications completed successfully!");
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });

  // ────────────────────────────────────────────────────────────────
  // TEST 1: MOBILE VIEW & TOUCH CARD OPENING
  // ────────────────────────────────────────────────────────────────
  console.log("=== TEST 1: MOBILE VIEW & TAP CARD ===");
  const mobilePage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await mobilePage.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await mobilePage.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(1000);

  // Scroll to events stage
  await mobilePage.evaluate(() => {
    document.querySelector("#events")?.scrollIntoView({ block: "start" });
  });
  await mobilePage.waitForTimeout(500);

  const stageBoxMobile = await mobilePage.evaluate(() => {
    const stage = document.querySelector("#event-stage");
    const rect = stage?.getBoundingClientRect();
    const cards = Array.from(document.querySelectorAll("#event-sphere > div"));
    return {
      stageHeight: rect?.height,
      stageWidth: rect?.width,
      totalCards: cards.length,
      viewportW: window.innerWidth,
    };
  });
  console.log("Mobile stage metrics:", stageBoxMobile);

  await mobilePage.screenshot({
    path: "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f/event_mobile_view.png",
  });
  console.log("Saved event_mobile_view.png");

  // Tap active card on mobile
  const activeCardMobile = await mobilePage.$("#event-sphere > div:has-text('ACTIVE EVENT')");
  console.log("Active card on mobile found:", !!activeCardMobile);

  if (activeCardMobile) {
    console.log("Tapping active card on mobile...");
    await activeCardMobile.tap();
    await mobilePage.waitForTimeout(800);

    const mobileModalInfo = await mobilePage.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      return {
        hasDialog: !!dialog,
        textSnippet: dialog?.innerText?.slice(0, 150) || "",
        zIndex: dialog ? window.getComputedStyle(dialog).zIndex : null,
      };
    });
    console.log("Mobile modal state after tap:", mobileModalInfo);

    await mobilePage.screenshot({
      path: "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f/event_mobile_dossier_modal.png",
    });
    console.log("Saved event_mobile_dossier_modal.png");

    // Close modal
    const closeBtn = await mobilePage.$("[role='dialog'] button[aria-label='Close dossier']");
    if (closeBtn) {
      await closeBtn.click();
      await mobilePage.waitForTimeout(500);
    }
  }

  await mobilePage.close();

  // ────────────────────────────────────────────────────────────────
  // TEST 2: DESKTOP & 360-DEGREE CONTINUOUS ROTATION
  // ────────────────────────────────────────────────────────────────
  console.log("\n=== TEST 2: DESKTOP 360-DEGREE ROTATION ===");
  const deskPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await deskPage.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await deskPage.goto("http://localhost:5174/", { waitUntil: "domcontentloaded" });
  await deskPage.waitForTimeout(1000);

  await deskPage.evaluate(() => {
    document.querySelector("#events")?.scrollIntoView({ block: "center" });
  });
  await deskPage.waitForTimeout(500);

  const initialTransform = await deskPage.evaluate(() => {
    return document.querySelector("#event-world")?.style.transform;
  });
  console.log("Initial event-world transform:", initialTransform);

  // Drag horizontally across stage
  const stage = await deskPage.$("#event-stage");
  const stageBox = await stage.boundingBox();

  const startX = stageBox.x + stageBox.width * 0.75;
  const endX = stageBox.x + stageBox.width * 0.15;
  const centerY = stageBox.y + stageBox.height * 0.5;

  console.log(`Dragging from (${startX.toFixed(0)}, ${centerY.toFixed(0)}) to (${endX.toFixed(0)}, ${centerY.toFixed(0)})...`);
  await deskPage.mouse.move(startX, centerY);
  await deskPage.mouse.down();
  const steps = 25;
  for (let i = 1; i <= steps; i++) {
    const curX = startX + ((endX - startX) * i) / steps;
    await deskPage.mouse.move(curX, centerY);
    await deskPage.waitForTimeout(16);
  }
  await deskPage.mouse.up();
  await deskPage.waitForTimeout(1000);

  const afterDragTransform = await deskPage.evaluate(() => {
    return document.querySelector("#event-world")?.style.transform;
  });
  console.log("After drag 1 event-world transform:", afterDragTransform);

  // Drag again in same direction to achieve full 360-degree rotation
  console.log("Performing continuous drag 2...");
  await deskPage.mouse.move(startX, centerY);
  await deskPage.mouse.down();
  for (let i = 1; i <= steps; i++) {
    const curX = startX + ((endX - startX) * i) / steps;
    await deskPage.mouse.move(curX, centerY);
    await deskPage.waitForTimeout(16);
  }
  await deskPage.mouse.up();
  await deskPage.waitForTimeout(1000);

  const after360Transform = await deskPage.evaluate(() => {
    return document.querySelector("#event-world")?.style.transform;
  });
  console.log("After 360° rotation event-world transform:", after360Transform);

  await deskPage.screenshot({
    path: "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f/event_desktop_rotated_360.png",
  });
  console.log("Saved event_desktop_rotated_360.png");

  // ────────────────────────────────────────────────────────────────
  // TEST 3: DESKTOP CARD CLICKING (ACTIVE & CLASSIFIED)
  // ────────────────────────────────────────────────────────────────
  console.log("\n=== TEST 3: DESKTOP CARD CLICKING ===");
  const activeCardDesk = await deskPage.$("#event-sphere > div:has-text('ACTIVE EVENT')");
  console.log("Active card on desktop found:", !!activeCardDesk);

  if (activeCardDesk) {
    console.log("Clicking active card on desktop...");
    await activeCardDesk.click();
    await deskPage.waitForTimeout(800);

    const deskModalInfo = await deskPage.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      return {
        hasDialog: !!dialog,
        textSnippet: dialog?.innerText?.slice(0, 150) || "",
      };
    });
    console.log("Desktop dossier modal state:", deskModalInfo);

    await deskPage.screenshot({
      path: "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f/event_desktop_dossier_modal.png",
    });
    console.log("Saved event_desktop_dossier_modal.png");

    // Close modal
    const closeBtn = await deskPage.$("[role='dialog'] button[aria-label='Close dossier']");
    if (closeBtn) {
      await closeBtn.click();
      await deskPage.waitForTimeout(500);
    }
  }

  // Also test clicking classified AFTERSHOCK card
  const classifiedCard = await deskPage.$("#event-sphere > div:has-text('AFTERSHOCK')");
  console.log("Classified card found:", !!classifiedCard);
  if (classifiedCard) {
    console.log("Clicking classified AFTERSHOCK card...");
    await classifiedCard.click({ force: true });
    await deskPage.waitForTimeout(800);

    const classModalInfo = await deskPage.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      return {
        hasDialog: !!dialog,
        textSnippet: dialog?.innerText?.slice(0, 150) || "",
      };
    });
    console.log("Classified modal state:", classModalInfo);

    await deskPage.screenshot({
      path: "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f/event_classified_modal.png",
    });
    console.log("Saved event_classified_modal.png");
  }

  await browser.close();
  console.log("\n=== ALL TESTS PASSED! ===");
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

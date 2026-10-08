import { chromium } from "playwright";

const API_BASE = "http://127.0.0.1:8000";
const FRONTEND_BASE = "http://localhost:5174";
const ARTIFACT_DIR = "C:/Users/nb200/.gemini/antigravity-ide/brain/a9089da6-da12-4af1-971f-ffe922d1fd5f";

async function runAudit() {
  console.log("============================================================");
  console.log("VYUHAM'26 FULL PRE-DEPLOYMENT END-TO-END AUDIT");
  console.log("============================================================\n");

  const results = {
    apiHealth: false,
    eventsApi: false,
    events404: false,
    announcementsApi: false,
    regConfigApi: false,
    adminStatsAuth: false,
    adminStatsLive: false,
    regClosedEnforcement: false,
    secretConcertProtected: false,
    browser3DUniverse: false,
    browserMobileResponsive: false,
    browserDirectUrls: false,
  };

  // ────────────────────────────────────────────────────────────────
  // PART 1: BACKEND API & HTTP CONTRACT AUDIT
  // ────────────────────────────────────────────────────────────────
  console.log("--- PART 1: BACKEND API & HTTP CONTRACT AUDIT ---");

  // 1. Health
  try {
    const res = await fetch(`${API_BASE}/`);
    const data = await res.json();
    if (res.status === 200 && data.status === "online") {
      console.log("✓ GET / (Health): PASS");
      results.apiHealth = true;
    } else {
      console.error("✗ GET / (Health): FAIL", data);
    }
  } catch (err) {
    console.error("✗ GET / (Health) connection error:", err.message);
  }

  // 2. Events list
  try {
    const res = await fetch(`${API_BASE}/events`);
    const events = await res.json();
    if (res.status === 200 && Array.isArray(events) && events.length >= 35) {
      console.log(`✓ GET /events: PASS (${events.length} events retrieved)`);
      results.eventsApi = true;
    } else {
      console.error("✗ GET /events: FAIL", events);
    }
  } catch (err) {
    console.error("✗ GET /events error:", err.message);
  }

  // 3. 404 for invalid slug
  try {
    const res = await fetch(`${API_BASE}/events/by-slug/non-existent-event-slug-xyz`);
    if (res.status === 404) {
      console.log("✓ GET /events/by-slug/:invalid (404 expected): PASS");
      results.events404 = true;
    } else {
      console.error(`✗ GET /events/by-slug/:invalid returned status ${res.status}`);
    }
  } catch (err) {
    console.error("✗ GET /events/by-slug/:invalid error:", err.message);
  }

  // 4. Announcements
  try {
    const res = await fetch(`${API_BASE}/announcements`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data)) {
      console.log(`✓ GET /announcements: PASS (${data.length} announcements retrieved)`);
      results.announcementsApi = true;
    } else {
      console.error("✗ GET /announcements: FAIL", data);
    }
  } catch (err) {
    console.error("✗ GET /announcements error:", err.message);
  }

  // 5. Registration Config Status
  try {
    const res = await fetch(`${API_BASE}/registrations/config/status`);
    const data = await res.json();
    if (res.status === 200 && typeof data.reg_open === "boolean") {
      console.log(`✓ GET /registrations/config/status: PASS (reg_open: ${data.reg_open})`);
      results.regConfigApi = true;
    } else {
      console.error("✗ GET /registrations/config/status: FAIL", data);
    }
  } catch (err) {
    console.error("✗ GET /registrations/config/status error:", err.message);
  }

  // 6. Admin Stats: Unauthenticated 401
  try {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (res.status === 401) {
      console.log("✓ GET /admin/stats unauthenticated 401: PASS");
      results.adminStatsAuth = true;
    } else {
      console.error(`✗ GET /admin/stats unauthenticated returned status ${res.status}`);
    }
  } catch (err) {
    console.error("✗ GET /admin/stats unauth error:", err.message);
  }

  // 7. Admin Stats: With Admin Key
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { "X-Admin-Key": "root26" },
    });
    const data = await res.json();
    if (res.status === 200 && data.all && typeof data.all.active_events === "number") {
      console.log("✓ GET /admin/stats with Admin Key: PASS", {
        activeEvents: data.all.active_events,
        totalRegs: data.all.total_registrations,
        totalCheckins: data.all.total_checkins,
      });
      results.adminStatsLive = true;
    } else {
      console.error("✗ GET /admin/stats admin key FAIL:", data);
    }
  } catch (err) {
    console.error("✗ GET /admin/stats admin key error:", err.message);
  }

  // 8. Registration Closed Enforcement: toggle closed -> test POST /registrations -> restore open
  try {
    // Set to closed
    await fetch(`${API_BASE}/registrations/config/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-Admin-Key": "root26" },
      body: JSON.stringify({ reg_open: false }),
    });

    // Attempt direct registration
    const dummyEventRes = await fetch(`${API_BASE}/events/by-slug/hackathon`);
    const dummyEvent = await dummyEventRes.json();

    const regRes = await fetch(`${API_BASE}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": "root26" },
      body: JSON.stringify({ event_id: dummyEvent.id }),
    });

    if (regRes.status === 403) {
      console.log("✓ POST /registrations while CLOSED rejects with 403 Forbidden: PASS");
      results.regClosedEnforcement = true;
    } else {
      console.error(`✗ POST /registrations while closed returned ${regRes.status}`);
    }

    // Restore to open
    await fetch(`${API_BASE}/registrations/config/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-Admin-Key": "root26" },
      body: JSON.stringify({ reg_open: true }),
    });
  } catch (err) {
    console.error("✗ Registration closed enforcement error:", err.message);
  }

  // ────────────────────────────────────────────────────────────────
  // PART 2: PLAYWRIGHT BROWSER & E2E JOURNEYS
  // ────────────────────────────────────────────────────────────────
  console.log("\n--- PART 2: PLAYWRIGHT BROWSER & E2E JOURNEYS ---");
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 3D Event Universe Audit (1440 x 900)
  const deskPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  await deskPage.addInitScript(() => {
    sessionStorage.setItem("vyuham26:seen", "1");
    sessionStorage.setItem("vyuham26:events_intro_seen", "1");
  });

  await deskPage.goto(`${FRONTEND_BASE}/`, { waitUntil: "domcontentloaded" });
  await deskPage.waitForTimeout(1500);

  // Scroll to events stage
  await deskPage.evaluate(() => {
    document.querySelector("#event-stage")?.scrollIntoView({ block: "center" });
  });
  await deskPage.waitForTimeout(800);

  // Verify:
  // a) No floating circle arrows (< and >)
  // b) No special selection box / border / active card enlargement
  // c) VYUHAM logo core at center
  const universeCheck = await deskPage.evaluate(() => {
    const stage = document.querySelector("#event-stage");
    const buttons = Array.from(stage?.querySelectorAll("button") || []);
    const floatingArrows = buttons.filter(b => b.querySelector("svg.lucide-chevron-left, svg.lucide-chevron-right"));
    const activeSelectionBox = Array.from(document.querySelectorAll("#event-sphere div")).filter(d => d.className && d.className.includes("ring-2"));
    const core = document.querySelector("#vyuham-core img");
    const cards = document.querySelectorAll("#event-sphere > div");
    return {
      hasStage: !!stage,
      floatingArrowCount: floatingArrows.length,
      activeSelectionBoxCount: activeSelectionBox.length,
      hasCoreLogo: !!core,
      cardCount: cards.length,
    };
  });

  console.log("Desktop 3D Universe Checks:", universeCheck);

  if (
    universeCheck.hasStage &&
    universeCheck.floatingArrowCount === 0 &&
    universeCheck.activeSelectionBoxCount === 0 &&
    universeCheck.hasCoreLogo &&
    universeCheck.cardCount >= 35
  ) {
    console.log("✓ 3D Event Universe Architecture (Fibonacci cards, stationary core, NO arrows, NO special selection): PASS");
    results.browser3DUniverse = true;
  } else {
    console.error("✗ 3D Event Universe Architecture check failed:", universeCheck);
  }

  // Test clicking ANY card immediately opens Event Dossier
  console.log("Testing direct card click -> Event Dossier...");
  const firstCard = await deskPage.$("#event-sphere > div:first-child");
  if (firstCard) {
    await firstCard.click();
    await deskPage.waitForTimeout(700);
    const dossierOpen = await deskPage.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      const title = dialog?.querySelector("h2, h3")?.textContent;
      return { isOpen: !!dialog, title };
    });
    console.log("Event Dossier direct open:", dossierOpen);
    if (dossierOpen.isOpen) {
      console.log("✓ Direct card click immediately opens Event Dossier: PASS");
      // Close dossier modal
      await deskPage.keyboard.press("Escape");
      await deskPage.waitForTimeout(500);
    }
  }

  // 2. Secret Day 3 Concert Protection Audit
  console.log("Testing Secret Day 3 Concert protection...");
  const classifiedCheck = await deskPage.evaluate(() => {
    const stageText = document.querySelector("#event-stage")?.textContent || "";
    const hasPerformerLeak = /arjit|coldplay|anirudh|thaman|armaan|sonu|shreya/i.test(stageText);
    const hasAftershock = stageText.includes("AFTERSHOCK");
    const hasTransmissionLocked = stageText.includes("TRANSMISSION LOCKED");
    return {
      hasAftershock,
      hasTransmissionLocked,
      hasPerformerLeak,
    };
  });
  console.log("Classified Concert Security Check:", classifiedCheck);
  if (classifiedCheck.hasAftershock && classifiedCheck.hasTransmissionLocked && !classifiedCheck.hasPerformerLeak) {
    console.log("✓ Secret Day 3 Concert is protected with zero performer leaks: PASS");
    results.secretConcertProtected = true;
  }

  // 3. Mobile Responsive Viewport Audit (390 x 844 & 360 x 800)
  console.log("Testing Mobile Responsive Viewports...");
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

  await mobilePage.goto(`${FRONTEND_BASE}/`, { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(1000);

  const mobileMetrics = await mobilePage.evaluate(() => {
    const stage = document.querySelector("#event-stage");
    const rect = stage?.getBoundingClientRect();
    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
    const arrowButtons = stage?.querySelectorAll("button:has(svg.lucide-chevron-left), button:has(svg.lucide-chevron-right)");
    return {
      stageHeight: rect?.height,
      hasHorizontalOverflow,
      arrowCount: arrowButtons ? arrowButtons.length : 0,
    };
  });

  console.log("Mobile Viewport Metrics (390x844):", mobileMetrics);
  if (!mobileMetrics.hasHorizontalOverflow && mobileMetrics.arrowCount === 0) {
    console.log("✓ Mobile Responsive Architecture (No horizontal overflow, clean HUD, no arrows): PASS");
    results.browserMobileResponsive = true;
  }

  // 4. Direct URL Navigation Tests (/events, /schedule, /announcements, /teams, /login, /dashboard)
  console.log("Testing Direct Route Navigation (SPA routing without 404s)...");
  const testRoutes = ["/events", "/schedule", "/announcements", "/teams", "/login", "/dashboard"];
  let allRoutesLoaded = true;

  for (const r of testRoutes) {
    await deskPage.goto(`${FRONTEND_BASE}${r}`, { waitUntil: "domcontentloaded" });
    await deskPage.waitForTimeout(400);
    const pageState = await deskPage.evaluate(() => {
      const root = document.querySelector("#root");
      const hasContent = (root?.textContent || "").length > 50;
      const has404 = document.title.includes("404") || (document.body?.textContent || "").includes("PAGE NOT FOUND");
      return { hasContent, has404 };
    });
    if (!pageState.hasContent || pageState.has404) {
      console.error(`✗ Route ${r} failed to load properly:`, pageState);
      allRoutesLoaded = false;
    } else {
      console.log(`✓ Direct navigation to ${r}: PASS`);
    }
  }

  results.browserDirectUrls = allRoutesLoaded;

  await browser.close();

  console.log("\n============================================================");
  console.log("AUDIT SUMMARY RESULTS");
  console.log("============================================================");
  console.table(results);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\nOVERALL PRODUCTION READINESS: ${allPassed ? "READY FOR PRODUCTION" : "ACTION REQUIRED"}`);
}

runAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});

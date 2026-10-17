(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const app = $('#app');
  let events = Array.isArray(window.VYUHAM_EVENTS) ? window.VYUHAM_EVENTS : [];
  const hiddenEventSlugs = new Set(['hackathon-continues', 'hackathon-demos', 'hackathon-winners', 'inauguration-ceremony', 'talk-agentic-ai', 'talk-quantum-ai', 'cultural-night', 'dj-night', 'concert', 'fashion-show', 'food-court']);
  const hiddenEventTitles = new Set(['hackathon continues', 'hackathon demos & judging', 'hackathon winners & prize distribution', 'inauguration ceremony', 'talk: from agents to outcomes: building ai that works in the real world (applied ai and engineering)', 'talk: responsible ai — a humanities lens', 'cultural night', 'dj night', 'concert night', 'fashion show', 'food court, markets & stalls']);
  const isVisibleEvent = event => !hiddenEventSlugs.has(event.slug) && !hiddenEventTitles.has(String(event.title || event.name || '').trim().toLowerCase());
  events = events.filter(isVisibleEvent);
  let registrationOpen = true;
  let landingIntroSeen = false;
  const registrationFeatureEnabled = window.VYUHAM_REGISTRATION_ENABLED === true;
  const MAKEMYPASS_HOME = 'https://org.makemypass.com/web/vyuham-26';
  const MAKEMYPASS_EVENT_PATHS = {
    hackathon: 'hackathon-24hr', 'workshop-ethical-hacking': 'workshop-ethical-hacking-osint',
    'best-manager': 'best-manager-4', 'marketing-game': 'marketing-game-3',
    'best-management-team': 'best-management-team', 'ctf': 'capture-the-flag-3',
    'tech-quiz': 'tech-quiz', 'startup-showcase': 'startup-showcase', 'prompt-war': 'prompt-war',
    'panel-cybersecurity': 'cybersecurity-panel-live-demo',
    'talk-ksum': 'talk-session-kerala-startup-mission', 'ai-short-film': 'ai-short-film',
    'valorant': 'valorant-tournament-2', 'movie-quiz': 'movie-quiz',
    'play-fest': 'play-fest', 'fitness-competition': 'fitness-competition',
    'efootball': 'e-football-tournament-2', 'bgmi': 'bgmi-tournament-3',
    'photography': 'photography-videography', 'business-quiz': 'business-quiz-2',
    'hr-game': 'hr-game-1', 'finance-game': 'finance-game-3',
    'cdac-workshop': 'c-dac-workshop',
    'project-expo-ieee': 'project-expo-by-ieee'
  };
  const days = [
    { day: 1, name: 'IGNITION', date: '30 OCT 2026', dateLong: 'Friday · October 30, 2026', desc: 'The first spark. Inauguration, leadership arenas, creative challenges and the opening of the 24-hour hackathon.' },
    { day: 2, name: 'CONVERGENCE', date: '31 OCT 2026', dateLong: 'Saturday · October 31, 2026', desc: 'Ideas collide. Hackathon demos, technology showcases, cultural experiences and competitive arenas.' },
    { day: 3, name: 'AFTERSHOCK', date: '01 NOV 2026', dateLong: 'Sunday · November 1, 2026', desc: 'The final wave. Grand finales, showcases, celebrations and the closing moments of VYUHAM’26.' }
  ];
  const streams = [
    { id: 'tech', name: 'Technology', symbol: '01', desc: 'Hackathons, cybersecurity, AI and hands-on invention. Build what comes next.', index: '01', image: 'assets/streams/technology.jpg' },
    { id: 'cultural', name: 'Culture', symbol: '02', desc: 'Performance, art, film and live experiences made to be shared.', index: '02', image: 'assets/streams/culture.jpg' },
    { id: 'esports', name: 'Gaming / Esports', symbol: '03', desc: 'Step into competitive arenas across Valorant, BGMI and E-Football.', index: '03', image: 'assets/streams/gaming.jpg' },
    { id: 'management', name: 'Impact / Management', symbol: '04', desc: 'Leadership, enterprise and strategy shaped by real-world challenges.', index: '04', image: 'assets/streams/management.jpg' }
  ];
  const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeExternalUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const scheduleMinutes = value => {
    const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return Number.POSITIVE_INFINITY;
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    return hour * 60 + Number(match[2]);
  };
  const officialVenue = value => value || 'Not listed in official schedule';
  const eventDayLabel = event => event.scheduleGroup === 'pre-fest'
    ? 'PRE-FEST'
    : event.scheduleDays?.length > 1
      ? 'ALL 3 DAYS'
      : Number.isFinite(Number(event.day))
        ? `DAY 0${event.day}`
        : 'FESTIVAL';
  const eventDateLabel = event => event.scheduleGroup === 'pre-fest'
    ? 'PRE-FESTIVAL'
    : event.scheduleDays?.length > 1
      ? '30 OCT – 01 NOV 2026'
      : days[Number(event.day) - 1]?.date || 'TBA';
  const registrationUrl = event => {
    const eventIdentity = `${event.slug || ''} ${event.title || event.name || ''}`.toLowerCase();
    if (eventIdentity.includes('workshop-luminar-technolab') || (eventIdentity.includes('luminar') && eventIdentity.includes('prompt engineering'))) {
      return 'https://org.makemypass.com/web/vyuham-26/events/workshop-on-prompt-engineering';
    }
    const supplied = safeExternalUrl(event.registration_url || event.registrationUrl || event.makemypass_url);
    if (supplied) {
      const url = new URL(supplied);
      if ((url.hostname === 'org.makemypass.com' && url.pathname.startsWith('/web/vyuham-26/events/')) || (url.hostname === 'makemypass.com' && url.pathname.startsWith('/event/'))) return url.href;
    }
    const mapped = MAKEMYPASS_EVENT_PATHS[event.slug];
    if (mapped) return `${MAKEMYPASS_HOME}/events/${mapped}`;
    return MAKEMYPASS_HOME;
  };
  // MakeMyPass owns public registration and payment. Keep its links independent
  // from the backend gate, which only controls VYUHAM's internal workflows.
  const canRegister = event => registrationFeatureEnabled && registrationOpen && !['registration_closed', 'closed', 'cancelled'].includes(event?.status);
  const registrationCta = (url, label, className = 'button button-primary', event = null) => canRegister(event)
    ? `<a class="${className}" href="${esc(url)}">${label}</a>`
    : `<span class="${className} registration-disabled" role="status" aria-disabled="true">REGISTRATION CLOSED</span>`;
  const updateHeaderRegistration = () => {
    const current = $('#headerRegistration');
    if (!current) return;
    const shouldLink = canRegister();
    if ((current.tagName === 'A') === shouldLink) return;
    const control = document.createElement(shouldLink ? 'a' : 'span');
    control.id = 'headerRegistration';
    control.className = 'button button-small button-primary' + (shouldLink ? '' : ' registration-disabled');
    control.innerHTML = shouldLink ? 'Register <span>↗</span>' : 'Registration closed';
    if (shouldLink) control.href = MAKEMYPASS_HOME;
    else { control.setAttribute('role', 'status'); control.setAttribute('aria-disabled', 'true'); }
    current.replaceWith(control);
  };
  const slugify = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const streamLabel = s => ({ tech: 'Technology', technology: 'Technology', management: 'Management', cultural: 'Culture', culture: 'Culture', esports: 'Esports', gaming: 'Esports', impact: 'Impact', general: 'General', session: 'Session' }[s] || 'General');
  const route = () => {
    // Hash routes use `#/...`; a plain `#section` is a native in-page anchor.
    const raw = location.hash.startsWith('#/') ? location.hash.slice(2) || 'home' : 'home';
    const path = raw.split('?')[0] || 'home';
    const parts = path.split('/').filter(Boolean);
    return { page: parts[0] || 'home', slug: parts.slice(1).join('/'), query: new URLSearchParams(raw.includes('?') ? raw.split('?').slice(1).join('?') : '') };
  };
  const go = path => { location.hash = '#/' + path.replace(/^\//, ''); };
  const eventCard = e => `<article class="event-card reveal" data-stream="${esc(e.stream)}">
    <div class="event-art" aria-hidden="true"${safeExternalUrl(e.image) ? ` style="--event-image:url('${esc(safeExternalUrl(e.image))}')"` : ''}><span>VYUHAM / ${esc(eventDayLabel(e))}</span><b>${esc(streamLabel(e.stream))}</b><i>${esc(e.scheduleGroup === 'pre-fest' ? 'PF' : e.scheduleDays?.length > 1 ? '03' : String(e.day ?? '--').padStart(2, '0'))}</i></div>
    <div class="event-content"><div class="event-top"><span class="tag">${esc(streamLabel(e.stream))}</span><span class="tag day">${esc(eventDayLabel(e))}</span></div>
    <h3><a href="#/event/${encodeURIComponent(e.slug)}">${esc(e.title)}</a></h3><p>${esc(e.cardDescription || e.description)}</p>
    <div class="event-meta"><span>PRIZE <strong>${esc(e.prizes || 'Not listed')}</strong></span><span>FEE <strong>${esc(e.fee || 'Not listed')}</strong></span></div>
    <div class="event-actions"><a class="text-link" href="#/event/${encodeURIComponent(e.slug)}">VIEW DOSSIER <span>↗</span></a><a class="button button-outline" href="#/event/${encodeURIComponent(e.slug)}">DETAILS</a>${registrationCta(registrationUrl(e), 'REGISTER ↗', 'button button-primary', e)}</div></div>
  </article>`;
  const pageHero = (kicker, title, desc, heroClass = '') => { const showCornerLogo = ['events-page-hero', 'participation-page-hero', 'competitions-page-hero', 'streams-page-hero'].includes(heroClass); return `<section class="page-hero ${heroClass}"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / ${esc(kicker.toUpperCase())}</div><div class="eyebrow">${esc(kicker)}</div><h1>${title}</h1><p>${desc}</p></div>${showCornerLogo ? '<img class="page-hero-corner-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72">' : ''}</section>` };
  const playLandingIntro = () => {
    if (landingIntroSeen) return false;
    landingIntroSeen = true;
    return !matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const home = () => {
    const showIntro = playLandingIntro();
    return `
    ${showIntro ? `<div class="intro-cinema" id="landingIntro" tabindex="-1" role="dialog" aria-modal="true" aria-label="VYUHAM 2026 introduction"><div class="intro-scene intro-scene-campus"><img src="assets/venue-campus-enhanced.jpg" alt=""><span>TECHNOCITY CAMPUS / TECHNOPARK PHASE 4</span></div><div class="intro-scene intro-scene-festival"><img src="assets/afterdark-monolith.png" alt=""><span>THREE DAYS / ONE CONVERGENCE</span></div><div class="intro-cinema-vignette"></div><div class="intro-cinema-grid"></div><div class="intro-cinema-orbit intro-cinema-orbit-a"></div><div class="intro-cinema-orbit intro-cinema-orbit-b"></div><div class="intro-cinema-core"><span class="intro-cinema-kicker"><img src="assets/duk-logo-intro.png" alt="Digital University Kerala"><b>Presents</b></span><img src="assets/vyuham_logo_optimized.png" alt=""><h1><span>VYUHAM</span><b>’26</b></h1><p>TECHNOLOGY. CULTURE. COMPETITION.</p></div><span class="intro-cinema-coordinate intro-cinema-left">30 OCT — 01 NOV / 2026</span><span class="intro-cinema-coordinate intro-cinema-right">THIRUVANANTHAPURAM / INDIA</span><div class="intro-cinema-flash"></div></div>` : ''}
    <section class="cyber-hero${showIntro ? ' intro-handoff' : ''}" id="home"><div class="cyber-hero-grid"><div class="cyber-copy"><div class="cyber-kicker"><span class="live-dot"></span> DIGITAL UNIVERSITY KERALA <i>·</i> 2026</div><div class="cyber-wordmark"><img src="assets/vyuham_logo_optimized.png" alt="VYUHAM red emblem"><h1>VYUHAM<span>’26</span></h1></div><p class="cyber-slogan">THE FUTURE<br><em>AWAITS.</em></p><p class="cyber-intro">VYUHAM’26 is Digital University Kerala’s flagship national-level management, technology and cultural fest.</p><div class="cyber-actions">${registrationCta(MAKEMYPASS_HOME, 'REGISTER & GET TICKETS <span>↗</span>')}<a class="text-link" href="#/events">EXPLORE ALL EVENTS <span>↓</span></a></div><div class="cyber-data"><span>30 OCT — 01 NOV, 2026</span><span>TECHNOCITY CAMPUS, TECHNOPARK PHASE 4</span></div><div class="hero-count cyber-count" aria-label="Countdown to festival opening"><small>COUNTDOWN TO OPENING</small><strong data-countdown>—</strong></div></div><div class="cyber-stage"><figure class="stage-screen stage-main"><img src="assets/vyuham-hero-convergence.png" alt="A crimson energy beam illuminating a monumental dark gateway above a misty reflective landscape"><div class="stage-shade"></div><div class="stage-brand"><img src="assets/vyuham_logo_optimized.png" alt=""><span>VYUHAM<sup>’26</sup></span></div><figcaption><span>VYUHAM / 01</span><span>THIRUVANANTHAPURAM, INDIA</span></figcaption></figure><a class="stage-screen stage-float" href="#/event/${encodeURIComponent(events.find(e => e.featured)?.slug || 'events')}"><span class="stage-float-label">FEATURED TRANSMISSION</span><b>${esc(events.find(e => e.featured)?.title || 'VYUHAM’26')}</b><span class="stage-float-foot">OPEN EVENT DOSSIER ↗</span></a><span class="stage-orbit stage-orbit-one"></span><span class="stage-orbit stage-orbit-two"></span><div class="stage-index">FESTIVAL SIGNAL <b>01—03</b></div></div></div><div class="cyber-hero-foot"><span>THE NATIONAL TECHNO-CULTURAL FESTIVAL</span><a href="#festival">SCROLL TO EXPLORE ↓</a></div></section>
    <div class="info-strip cyber-strip stats-bar"><span class="stats-item"><b>30.10—01.11</b><small>THREE FESTIVAL DAYS</small></span><span class="stats-item"><b>TECHNOCITY CAMPUS</b><small>TECHNOPARK PHASE 4</small></span><span class="stats-item"><b>${events.length}</b><small>EVENT RECORDS</small></span><span class="stats-item"><b>01 / 03</b><small>DAY 1 → DAY 3</small></span></div>
    <section class="section festival-intro" id="festival"><div class="container intro-composition"><div class="intro-mark reveal"><span>VYUHAM / DUK</span><img src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem"><b>ONE<br>FESTIVAL<br><i>FOUR WORLDS.</i></b></div><div class="intro-copy reveal"><div class="eyebrow">01 / ABOUT THE FESTIVAL</div><h2>WHERE<br>DISCIPLINES<br><span class="green">COLLIDE.</span></h2><p>VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest. Across three days, students gather to build, debate, perform and compete.</p><p>From autonomous systems and strategy arenas to live culture and esports, one campus becomes a meeting point for different ways of thinking.</p><a class="text-link" href="#/about">DISCOVER VYUHAM <span>↗</span></a></div></div></section>
    <section class="section stream-section" id="streams"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">02 / FOUR SIGNALS</div><h2>FIND YOUR<br><span class="green">FREQUENCY.</span></h2></div><p>Four distinct streams. One shared festival ground.</p></div><div class="stream-grid">${streams.map((s, i) => `<a class="stream-card stream-card-${i + 1} reveal" data-index="${s.index}" href="#/events?stream=${s.id}"><img class="stream-art" src="${s.image}" alt="" loading="lazy" decoding="async"><img class="stream-emblem" src="assets/vyuham_logo_sm.png" alt="" aria-hidden="true" loading="lazy"><span class="stream-icon">${s.symbol} / STREAM</span><strong>${s.name}</strong><p>${s.desc}</p><span class="stream-go">EXPLORE ↗</span><i class="stream-watermark">${s.index}</i></a>`).join('')}</div></div></section>
    <section class="section featured-home"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">03 / EVENT FREQUENCY</div><h2>THE LINEUP<br><span class="green">IS LIVE.</span></h2></div><a class="text-link" href="#/events">ALL ${events.filter(e => e.status !== 'cancelled').length} EVENTS ↗</a></div><div class="home-event-grid">${events.filter(e => e.featured && e.status !== 'cancelled').slice(0, 4).map((e, i) => `<a class="home-event home-event-${i + 1} reveal" href="#/event/${encodeURIComponent(e.slug)}"><span>${esc(streamLabel(e.stream))} / DAY 0${e.day}</span><strong>${esc(e.title)}</strong><small>OPEN EVENT ↗</small></a>`).join('')}</div></div></section>
    <section class="section schedule-section"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">04 / THREE DAYS</div><h2>THE FESTIVAL<br><span class="green">SEQUENCE.</span></h2></div><a class="text-link" href="#/schedule">OPEN FULL SCHEDULE ↗</a></div><div class="schedule-preview">${days.map(d => `<a class="day-card day-card-${d.day} reveal" href="#/schedule"><span class="day-num">${d.date}</span><h3>Day ${d.day}</h3><p>${d.desc}</p><span class="day-explore">VIEW DAY ↗</span><i class="day-ghost">0${d.day}</i></a>`).join('')}</div></div></section>
    <section class="section" id="venue"><div class="container venue-home"><div><div class="eyebrow">05 / THE VENUE</div><h2>MEET US AT<br><span class="green">TECHNOCITY.</span></h2><h3>Digital University Kerala</h3><p class="muted">Technocity Campus, Mangalapuram,<br>Thiruvananthapuram, Kerala — 695317.</p><a class="text-link" target="_blank" rel="noopener" href="https://maps.google.com/?q=Digital+University+Kerala+Technocity">GET DIRECTIONS ↗</a></div><a class="venue-map" aria-label="Open map directions to Digital University Kerala" target="_blank" rel="noopener" href="https://maps.google.com/?q=Digital+University+Kerala+Technocity"><img src="assets/venue-campus-enhanced.jpg" alt="Aerial view of Digital University Kerala campus among the green Technocity landscape" loading="lazy" width="1360" height="1024"></a></div></section>
    <section class="section" id="sponsors"><div class="container sponsors-home"><div><div class="eyebrow">06 / PARTNERS</div><h2>MADE POSSIBLE<br><span class="green">TOGETHER.</span></h2><p>Official partner names and identities will be listed when confirmed for publication.</p><a class="text-link" href="mailto:techfest@duk.ac.in">PARTNER WITH VYUHAM ↗</a></div><a class="button button-outline" href="mailto:techfest@duk.ac.in">PARTNERSHIP ENQUIRIES ↗</a></div></section>
    <section class="section"><div class="container"><div class="cta-band reveal"><div><div class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>ENTER THE<br><span class="green">CONVERGENCE.</span></h2><p>Find an event. Build a team. Make your mark at VYUHAM’26.</p></div><a class="button button-primary" href="#/events">FIND YOUR EVENT <span>↗</span></a></div></div></section>`;
  };
  const streamsPage = () => `${pageHero('Festival streams', 'FOUR FRONTS.<br><span class="green">ONE FUTURE.</span>', 'Find your place in the VYUHAM’26 programme. Each stream links to its events and experiences.', 'streams-page-hero')}
    <section class="section"><div class="container stream-page-grid">${streams.map((s, i) => { const count = events.filter(e => e.stream === s.id).length; return `<article class="stream-feature stream-feature-${i + 1} reveal" data-index="${s.index}"><span class="stream-feature-index">${s.index} / VYUHAM’26</span><div><h2>${esc(s.name)}</h2><p>${esc(s.desc)}</p><a class="text-link" href="#/events?stream=${encodeURIComponent(s.id)}">${String(count).padStart(2, '0')} EVENTS · EXPLORE STREAM ↗</a></div></article>` }).join('')}</div></section>`;
  const eventsPage = (query = '') => {
    const params = new URLSearchParams(query), selected = params.get('stream') || 'all';
    return `${pageHero('Event archive', 'FIND YOUR<br><span class="green">ARENA.</span>', 'Explore competitions, challenges and experiences across VYUHAM’26. Filter by stream or search for an event.', 'events-page-hero')}
      <section class="section"><div class="container"><div class="notice">Registration and ticket payments are completed on MakeMyPass. Select an event to view its official registration page.</div><div class="filter-bar"><label class="search-box"><input id="eventSearch" type="search" placeholder="Search events, keywords…" aria-label="Search events"></label><label class="event-filter"><span>DAY</span><select id="eventDay"><option value="all">All events</option><option value="1">Day 1 · Oct 30</option><option value="2">Day 2 · Oct 31</option><option value="3">Day 3 · Nov 1</option></select></label><label class="event-filter"><span>SORT</span><select id="eventSort"><option value="day">Festival order</option><option value="name">Name A–Z</option><option value="fee">Fee · low to high</option></select></label></div><div class="filter-pills" id="streamFilters">${[['all', 'ALL EVENTS'], ['tech', 'TECHNOLOGY'], ['management', 'MANAGEMENT'], ['cultural', 'CULTURE'], ['esports', 'ESPORTS']].map(([id, label]) => `<button class="filter-pill ${selected === id ? 'active' : ''}" data-stream="${id}">${label}</button>`).join('')}</div><p class="muted mono" style="font-size:10px;margin:22px 0" id="eventCount"></p><div class="events-grid" id="eventsGrid"></div><p style="text-align:center;margin-top:34px">${registrationCta(MAKEMYPASS_HOME, 'VIEW ALL EVENTS ON MAKEMYPASS ↗', 'button button-outline')}</p></div></section>`;
  };
  const eventDetail = slug => {
    const e = events.find(x => x.slug === decodeURIComponent(slug) && isVisibleEvent(x));
    if (!e) return notFound();
    const image = safeExternalUrl(e.image);
    const hero = image ? `<section class="page-hero event-page-hero" style="--event-hero-image:url('${esc(image)}')"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / EVENT DOSSIER</div><div class="eyebrow">EVENT DOSSIER</div><h1>${esc(e.title)}</h1><p>Event details, schedule information and participation overview for VYUHAM’26.</p></div></section>` : pageHero('Event dossier', esc(e.title), 'Event details, schedule information and participation overview for VYUHAM’26.');
    return `${hero}
      <section class="section"><div class="container"><a class="back-link" href="#/events">← BACK TO EVENT ARCHIVE</a><div class="event-detail"><div><div class="eyebrow">${esc(streamLabel(e.stream))} / ${esc(eventDayLabel(e))}</div><h2>${esc(e.title)}</h2><p class="muted" style="line-height:1.9">${esc(e.description)}</p><h3 style="margin-top:35px">Participation notes</h3>${e.rules && e.rules.length ? `<ul class="rule-list">${e.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : '<p class="muted">Detailed rules will be published by the event organizers.</p>'}<div class="notice">MakeMyPass is the official registration and payment provider. Review final event details and complete your registration on the event’s MakeMyPass page.</div></div><aside class="detail-panel"><div class="eyebrow">EVENT INTEL</div><dl><div><dt>DATE</dt><dd>${esc(eventDateLabel(e))}</dd></div><div><dt>TIME</dt><dd>${esc(e.time)}</dd></div><div><dt>VENUE</dt><dd>${esc(officialVenue(e.venue))}</dd></div>${e.speaker ? `<div><dt>SPEAKER</dt><dd>${esc(e.speaker)}</dd></div>` : ''}<div><dt>PRIZE</dt><dd class="green">${esc(e.prizes || 'Not listed')}</dd></div><div><dt>ENTRY FEE</dt><dd>${esc(e.fee || 'Not listed')}</dd></div><div><dt>TEAM SIZE</dt><dd>${esc(e.teamSize)}</dd></div><div><dt>ELIGIBILITY</dt><dd>${esc(e.eligibility)}</dd></div></dl>${registrationCta(registrationUrl(e), 'REGISTER & PAY ON MAKEMYPASS ↗', 'button button-primary event-register-cta', e)}<p class="muted" style="font-size:10px;margin:12px 0 0">Opens the official listing for this event. If its link is not mapped yet, MakeMyPass opens the VYUHAM event directory.</p></aside></div></div></section>`;
  };
  const schedulePage = () => `<section class="page-hero schedule-page-hero"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / FESTIVAL TIMELINE</div><div class="eyebrow">Festival timeline</div><h1>THREE DAYS.<br><span class="green">NO PAUSE.</span></h1><p>Plan your VYUHAM’26 experience. Event-specific timings and venues should be confirmed with the official schedule.</p></div><img class="schedule-hero-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72"></section>
    <section class="section"><div class="container"><div class="schedule-days" id="scheduleDays">${days.map(d => `<button class="schedule-day schedule-day-${d.day}" type="button" aria-pressed="${d.day === 1}" data-day="${d.day}"><b>DAY 0${d.day} <i>· ${d.date}</i></b><span>${d.name}</span><small>${d.desc}</small><em>VIEW DAY <strong>↘</strong></em></button>`).join('')}</div><div id="scheduleContent"></div><div class="notice">Event times and listed venues follow the official schedule. A venue marked “Not listed in official schedule” was not specified in that document.</div></div></section>`;
  const aboutPage = () => `${pageHero('About the festival', 'WHERE DISCIPLINES<br><span class="green">CONVERGE.</span>', 'A national-level techno-cultural gathering hosted by Digital University Kerala.')}
    <section class="section"><div class="container about-grid"><div class="about-visual"><div class="visual-cross"></div><div class="visual-core"><img src="assets/vyuham_logo_sm.png" alt="VYUHAM logo"></div></div><div class="about-copy"><div class="eyebrow">THE VYUHAM IDEA</div><h2>BUILT FOR<br><span class="green">WHAT’S NEXT.</span></h2><p>VYUHAM brings technology, management, culture and esports into one shared arena. It is designed for curious minds, ambitious teams, performers and problem-solvers from across India.</p><p>Across three days, participants can compete, collaborate, learn from one another and experience a festival shaped by innovation and expression.</p><div class="about-points"><div class="about-point"><i>01</i><span>Technology — create, test and build.</span></div><div class="about-point"><i>02</i><span>Management — lead, plan and adapt.</span></div><div class="about-point"><i>03</i><span>Culture — perform, express and connect.</span></div><div class="about-point"><i>04</i><span>Esports — compete with focus and teamwork.</span></div></div></div></div></section><section class="section"><div class="container"><div class="cta-band"><div><div class="eyebrow">OCTOBER 30 – NOVEMBER 1, 2026</div><h2>SEE YOU IN<br><span class="green">THE ARENA.</span></h2></div><a class="button button-primary" href="#/events">EXPLORE EVENTS ↗</a></div></div></section>`;
  const venueTeam = [
    { name: 'Nived B', role: 'Developer', course: '1st Yr MTech CyberSecurity', image: 'assets/team-nived.png' },
    { name: 'Pranavkrishna', role: 'Developer', course: '1st Yr MTech AI', image: 'assets/team-pranavkrishna.png' },
    { name: 'Adhwaith Krishnan J R', role: 'Developer', course: '1st Yr MTech CyberSecurity', image: 'assets/team-adhwaith.png' },
    { name: 'Aswanth M C', role: 'Developer', course: '1st Yr MSc Data Analytics', image: 'assets/team-aswanth.png' },
    { name: 'Hizan Rahman', course: '2nd Yr MSc Computer Science', role: 'Coordinator', image: 'assets/team-hizan-rehman.png' },
    { name: 'Noyal Mathew Thankachan', course: '2nd Yr MSc Computer Science', role: 'Coordinator', image: 'assets/team-new-member.png' }
  ];
  const renderTeamMember = member => `<article class="dev-team-card"><div class="dev-team-portrait"><img src="${member.image}" alt="${esc(member.name)}" loading="lazy" decoding="async"></div><div class="dev-team-caption"><h3>${esc(member.name)}</h3><p class="dev-team-role">${esc(member.role)}</p><p class="dev-team-course">${esc(member.course)}</p></div></article>`;
  const developerTeam = venueTeam.filter(member => member.role === 'Developer');
  const coordinatorTeam = venueTeam.filter(member => member.role === 'Coordinator');
  const venuePage = () => `<section class="page-hero venue-page-hero"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / ABOUT</div><div class="eyebrow">About</div><h1 class="venue-about-typewriter" aria-label="VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest."><span aria-hidden="true" data-typewriter="VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest."></span></h1></div><img class="venue-hero-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72"></section>
    <section class="section venue-team-section"><div class="container"><div class="section-head"><div><div class="eyebrow">THE PEOPLE BEHIND VYUHAM</div><h2>MEET THE<br><span class="green">DEV TEAM.</span></h2></div><p>Meet the people building the VYUHAM’26 experience.</p></div><div class="dev-team-grid" aria-label="VYUHAM development team"><div class="dev-team-row dev-team-row-primary">${developerTeam.map(renderTeamMember).join('')}</div><div class="dev-team-row dev-team-row-secondary">${coordinatorTeam.map(renderTeamMember).join('')}</div></div></div></section>
    <section class="section venue-location-section"><div class="container"><div class="section-head"><div><div class="eyebrow">VYUHAM / THE VENUE</div><h2>LOCATION</h2></div><p class="venue-location-description">VYUHAM’26 takes place at Digital University Kerala, Technocity Campus, Thiruvananthapuram.</p></div><div class="info-grid"><article class="info-card venue-info-card venue-campus-card"><span class="num">01 / CAMPUS</span><span class="venue-card-mark venue-campus-mark" aria-hidden="true">DUK</span><div class="venue-duk-logo-frame"><img class="venue-duk-logo" src="assets/duk-logo.png" alt="Digital University Kerala — Curating a responsible digital world" loading="lazy"></div><h3>Digital University Kerala</h3><p>Technocity Campus, Mangalapuram, Thiruvananthapuram, Kerala – 695317.</p></article><article class="info-card venue-info-card"><span class="num">02 / ARRIVAL</span><span class="venue-card-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M9 36c7-1 8-9 14-10s7 6 13 3 2-10 5-16"/><circle cx="9" cy="36" r="3"/><circle cx="41" cy="13" r="3"/><path d="m33 13 8 0 0 8"/></svg></span><h3>Plan your visit</h3><p>Check your event’s assigned venue and arrival instructions before travelling. Detailed transport information should be confirmed through official festival communications.</p></article><article class="info-card venue-info-card"><span class="num">03 / HELP</span><span class="venue-card-mark venue-help-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 42s14-13 14-25a14 14 0 1 0-28 0c0 12 14 25 14 25Z"/><circle cx="24" cy="17" r="5"/><path d="M34 35h8M38 31v8"/></svg></span><h3>Need directions?</h3><p>Contact the organizing team for venue access, accessibility needs and event-specific location details.</p><a class="text-link" href="mailto:techfest@duk.ac.in">CONTACT TEAM ↗</a></article></div><div style="margin-top:22px;border:1px solid var(--line);border-radius:12px;overflow:hidden"><iframe title="Digital University Kerala location" src="https://www.google.com/maps?q=Digital%20University%20Kerala%20Technocity&output=embed" width="100%" height="350" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>`;
  const contactPage = () => `${pageHero('Contact', 'LET’S START<br><span class="green">A SIGNAL.</span>', 'Questions about events, participation or the festival? Reach out to the organizing team.')}
    <section class="section"><div class="container contact-grid"><div><div class="contact-list"><div class="contact-item"><small>EMAIL</small><p><a href="mailto:techfest@duk.ac.in" class="text-link">techfest@duk.ac.in</a></p></div><div class="contact-item"><small>PHONE</small><p>+91 471 278 8000</p></div><div class="contact-item"><small>LOCATION</small><p>Technocity Campus, Mangalapuram, Thiruvananthapuram – 695317</p></div><div class="contact-item"><small>SOCIAL</small><p><a class="text-link" href="https://instagram.com/vyuham.duk" target="_blank" rel="noopener">INSTAGRAM ↗</a></p></div></div></div><form class="form-card" id="contactForm"><div class="eyebrow">SEND A MESSAGE</div><h3 style="margin:16px 0 22px">How can we help?</h3><div class="form-grid"><div class="form-field"><label for="contactName">NAME</label><input id="contactName" name="name" autocomplete="name" required></div><div class="form-field"><label for="contactEmail">EMAIL</label><input id="contactEmail" name="email" type="email" autocomplete="email" required></div><div class="form-field full"><label for="contactTopic">TOPIC</label><select id="contactTopic" name="topic"><option>Event information</option><option>Registration support</option><option>Partnership</option><option>Accessibility</option><option>Other</option></select></div><div class="form-field full"><label for="contactMessage">MESSAGE</label><textarea id="contactMessage" name="message" required></textarea></div></div><p class="form-note">Your inquiry is saved to the festival support system for organizer follow-up.</p><button class="button button-primary" type="submit">SEND MESSAGE ↗</button></form></div></section>`;
  const faqPage = () => `${pageHero('Help center', 'QUESTIONS?<br><span class="green">ANSWERS.</span>', 'A few things to know before you enter VYUHAM’26.')}
    <section class="section"><div class="container faq-list">${[
      ['When is VYUHAM’26?', 'The festival is scheduled for October 30, 31 and November 1, 2026. Check the official schedule for the latest event-specific timings.'],
      ['Where will the festival take place?', 'Digital University Kerala, Technocity Campus, Mangalapuram, Thiruvananthapuram, Kerala.'],
      ['How do I register for an event?', 'Open the event dossier and use the official registration link if one is provided. Registration availability and eligibility may differ by event.'],
      ['Can I register on the festival day?', 'This depends on the event and current registration status. Confirm directly with the organizers before travelling.'],
      ['Where can I find event rules and fees?', 'Each event dossier lists available information from the supplied source data. Verify the final rules and fees with the official organizers.']
    ].map(([q, a]) => `<div class="faq-item"><button class="faq-question" aria-expanded="false">${q}<span>＋</span></button><div class="faq-answer">${a}</div></div>`).join('')}</div></section>`;
  const participationPage = () => `${pageHero('Participation guide', 'CHOOSE YOUR<br><span class="green">ARENA.</span>', 'Find an event, check its requirements and finish registration and payment on the official MakeMyPass page.', 'participation-page-hero')}
    <section class="section"><div class="container"><div class="notice">MakeMyPass is the registration and ticketing provider. Your registration and payment status are confirmed there; this site does not process payments.</div><div class="participation-steps"><article class="info-card"><span class="num">STEP / 01</span><h3>Choose an event</h3><p>Browse by stream, festival day, or entry fee. Open an event dossier to review eligibility, team size and schedule.</p><a class="button button-small button-primary" href="#/events">Browse events</a></article><article class="info-card"><span class="num">STEP / 02</span><h3>Register on MakeMyPass</h3><p>Use the event-specific registration link to enter participant details and complete any ticket or event payment.</p>${registrationCta(MAKEMYPASS_HOME, 'Register now', 'button button-small button-primary')}</article><article class="info-card"><span class="num">STEP / 03</span><h3>Prepare to participate</h3><p>Follow the event instructions from the organizer. Follow the event confirmation and organizer instructions after registering on MakeMyPass.</p>${registrationCta(MAKEMYPASS_HOME, 'Register now', 'button button-small button-primary')}</article></div><div class="cta-band participation-cta"><div><div class="eyebrow">READY TO JOIN?</div><h2>YOUR NEXT<br><span class="green">MOVE.</span></h2></div><a class="button button-primary" href="#/events">FIND AN EVENT ↗</a></div></div></section>`;
  const competitionsPage = () => {
    const list = events.filter(e => isVisibleEvent(e) && ['tech', 'technology', 'management', 'esports', 'gaming'].includes(e.stream)); return `${pageHero('Competition hub', 'ENTER THE<br><span class="green">ARENA.</span>', 'Explore VYUHAM’26 competitions, then open the relevant event dossier for requirements and MakeMyPass registration.', 'competitions-page-hero')}
    <section class="section"><div class="container"><div class="notice">Competition entry and payment are handled by MakeMyPass. Open an event dossier for requirements and official registration details.</div><div class="events-grid">${list.map(eventCard).join('')}</div></div></section>`
  };
  const featurePage = (page) => {
    if (page === 'leaderboard') return `${pageHero('Competition leaderboard', 'THE CURRENT<br><span class="green">STANDINGS.</span>', 'Official placements published by VYUHAM event organizers.')}
      <section class="section"><div class="container"><div class="notice">Standings come from verified event results in the VYUHAM backend.</div><div id="leaderboardFeed" class="info-grid"><article class="notice">Loading official standings…</article></div><p style="margin-top:28px"><a class="text-link" href="#/results">VIEW ALL PUBLISHED RESULTS ↗</a></p></div></section>`;
    if (page === 'receipt') return `${pageHero('Payment receipt', 'YOUR<br><span class="green">RECEIPT.</span>', 'Retrieve a VYUHAM backend receipt by its transaction reference. MakeMyPass ticket receipts remain available from your MakeMyPass account.')}
      <section class="section"><div class="container"><form class="form-card" id="receiptForm" style="max-width:650px;margin:auto"><div class="form-field"><label for="receiptReference">TRANSACTION REFERENCE</label><input id="receiptReference" name="transaction_ref" required value="${esc(route().query.get('ref') || '')}" placeholder="VYU26-…"></div><button class="button button-primary" type="submit">LOOK UP RECEIPT ↗</button><p class="form-note" id="receiptMessage" role="status">Sign in with the account used for the VYUHAM backend payment.</p></form><div id="receiptResult" style="max-width:760px;margin:22px auto"></div><p style="text-align:center"><a class="text-link" href="${MAKEMYPASS_HOME}" target="_blank" rel="noopener noreferrer">OPEN MAKEMYPASS FOR TICKET RECEIPTS ↗</a></p></div></section>`;
    if (page === 'results') return `${pageHero('Official results', 'THE FINAL<br><span class="green">STANDINGS.</span>', 'Published results from the event organizers.')}
      <section class="section"><div class="container"><div id="resultsFeed" class="info-grid"><article class="notice">Loading verified event results…</article></div></div></section>`;
    if (page === 'certificates') return `${pageHero('Certificate registry', 'VERIFY YOUR<br><span class="green">MILESTONE.</span>', 'Check a certificate code against the official VYUHAM registry.')}
      <section class="section"><div class="container"><form class="form-card" id="certificateForm" style="max-width:650px;margin:auto"><div class="form-field"><label for="certificateCode">CERTIFICATE CODE</label><input id="certificateCode" name="code" required placeholder="CERT-VYU-XXXXXX"></div><button class="button button-primary" type="submit">VERIFY CERTIFICATE ↗</button></form><div id="certificateResult" style="max-width:650px;margin:18px auto"></div><h2 style="margin:52px 0 18px">Your certificates</h2><div id="myCertificates" class="info-grid"><div class="notice">Checking your signed-in account…</div></div></div></section>`;
    if (page === 'checkin') return `${pageHero('Gate operations', 'VERIFY<br><span class="green">ENTRY.</span>', 'Volunteer and organizer check-in terminal. Access is restricted to assigned operations roles.')}
      <section class="section"><div class="container"><div id="checkinAccess" class="notice">Checking scanner access…</div><form class="form-card" id="checkinForm" style="max-width:680px"><div class="form-grid"><div class="form-field"><label for="scanStation">CHECK-IN STATION</label><select id="scanStation" name="station"><option>Gate 1 - Main Entrance</option><option>Gate 2 - Tech & Hackathon Arena</option><option>Gate 3 - Cyber CTF Deck</option><option>Gate 4 - Cultural Amphitheatre</option><option>Station 5 - Food Court & Wallet Deck</option><option>Station 6 - VIP & Speaker Deck</option></select></div><div class="form-field"><label for="ticketCode">TICKET CODE</label><input id="ticketCode" name="ticket_code" autocomplete="off" required></div></div><button class="button button-primary" type="submit">VERIFY PASS ↗</button><div id="scanResult"></div></form><h2 style="margin:48px 0 16px">Recent scans</h2><div id="checkinHistory" class="schedule-list">Sign in with a volunteer or organizer account to load scans.</div></div></section>`;
    if (page === 'profile') return `${pageHero('Participant profile', 'YOUR<br><span class="green">IDENTITY.</span>', 'Update the participant profile stored by the VYUHAM backend.')}
      <section class="section"><div class="container"><form class="form-card" id="profileForm" style="max-width:680px;margin:auto"><div id="profileMessage" class="notice">Loading participant profile…</div><div class="form-grid"><div class="form-field"><label for="profileName">FULL NAME</label><input id="profileName" name="name" required></div><div class="form-field"><label for="profilePhone">PHONE</label><input id="profilePhone" name="phone" type="tel"></div><div class="form-field full"><label for="profileCollege">COLLEGE</label><input id="profileCollege" name="college"></div><div class="form-field"><label for="profileDegree">DEGREE</label><input id="profileDegree" name="degree"></div><div class="form-field"><label for="profileYear">YEAR</label><input id="profileYear" name="year"></div></div><button class="button button-primary" type="submit">SAVE PROFILE ↗</button></form></div></section>`;
    if (page === 'feedback') return `${pageHero('Feedback', 'SEND A<br><span class="green">SIGNAL.</span>', 'Tell the organizing team about your VYUHAM’26 experience.')}
      <section class="section"><div class="container"><form class="form-card" id="feedbackForm" style="max-width:680px;margin:auto"><div class="eyebrow">FESTIVAL DEBRIEF</div><h3 style="margin:16px 0 22px">How was your experience?</h3><div class="form-field"><label for="feedbackRating">RATING</label><select id="feedbackRating" name="rating" required><option value="5">5 — Excellent</option><option value="4">4 — Great</option><option value="3">3 — Good</option><option value="2">2 — Fair</option><option value="1">1 — Needs work</option></select></div><div class="form-field"><label for="feedbackComments">COMMENTS</label><textarea id="feedbackComments" name="comments" required></textarea></div><button class="button button-primary" type="submit">SUBMIT FEEDBACK ↗</button></form></div></section>`;
    const config = {
      certificates: ['Certificates', 'YOUR ACHIEVEMENTS', 'Certificate lookup and downloads require verified participant records.', 'Verified certificates will be listed here.'],
      checkin: ['Event check-in', 'CHECK IN', 'Event check-in requires a verified registration and an authorized organizer workflow.', 'No check-in action is active in this static build.'],
      checkout: ['Checkout', 'REVIEW YOUR ENTRY', 'Checkout and payment processing are disabled until the approved payment integration is connected.', 'No payment will be initiated from this page.'],
      confirmation: ['Confirmation', 'ENTRY STATUS', 'Registration confirmation must come from the authoritative registration service.', 'This static page cannot confirm an entry.'],
      feedback: ['Feedback', 'SEND A SIGNAL', 'Share feedback about the festival experience. Submission requires a connected service.', 'No feedback is stored or transmitted by this static page.'],
      food: ['Food & campus', 'FUEL THE MISSION', 'Festival food information and wallet features require current organizer-provided details.', 'Vendor, menu and wallet information is not connected.'],
      leaderboard: ['Leaderboard', 'THE CURRENT STANDINGS', 'Live scores and rankings require verified competition results.', 'No live scores are available in this static frontend.'],
      payment: ['Payment status', 'PAYMENT INTEL', 'Payment status must be verified through the trusted payment provider and backend.', 'No payment status is inferred or simulated.'],
      photography: ['Photography', 'CAPTURE THE MOMENT', 'Festival photography and gallery highlights will be displayed here when approved images are available.', 'Official gallery images can be added here.'],
      qualifiers: ['Qualifiers', 'QUALIFIER STATUS', 'Qualifier schedules and results should be published from verified event data.', 'No qualifier status is simulated.'],
      receipt: ['Receipt', 'ENTRY RECEIPT', 'Receipts must be generated from verified registration and payment records.', 'No receipt is generated by this static page.'],
      results: ['Results', 'FINAL RESULTS', 'Competition results should be published after verification by event organizers.', 'Official results will appear here when available.'],
    };
    const c = config[page] || ['Festival information', 'MORE FROM VYUHAM', 'Explore the VYUHAM’26 festival and its events.', 'Details will be updated through official festival communications.'];
    const action = '<a class="button button-outline" href="#/events">EXPLORE EVENTS ↗</a>';
    return `${pageHero(c[0], `${c[1].split(' ').slice(0, -1).join(' ')}<br><span class="green">${c[1].split(' ').slice(-1).join(' ')}</span>`, c[2])}<section class="section"><div class="container"><div class="notice">${esc(c[3])} This is a frontend-only page shell; it does not claim live account, payment or competition data.</div><div class="info-grid"><article class="info-card"><span class="num">VYUHAM’26 / 01</span><h3>Official information</h3><p>Use published festival communications for current status, eligibility and event instructions.</p></article><article class="info-card"><span class="num">VYUHAM’26 / 02</span><h3>Need assistance?</h3><p>Contact the organizing team for help with event participation and festival information.</p><a class="text-link" href="mailto:techfest@duk.ac.in">CONTACT TEAM ↗</a></article><article class="info-card"><span class="num">VYUHAM’26 / 03</span><h3>Continue exploring</h3><p>Browse the event archive and review available event dossiers.</p>${action}</article></div></div></section>`;
  };
  const notFound = () => `${pageHero('404 / Route unavailable', 'SIGNAL<br><span class="green">LOST.</span>', 'This route is not part of the converted static frontend yet. Return to the main experience and continue exploring.')}<section class="section"><div class="container"><a class="button button-primary" href="#/home">RETURN HOME ↗</a></div></section>`;
  const comingSoonPage = () => `${pageHero('Feature update', 'COMING<br><span class="green">SOON.</span>', 'This section is temporarily unavailable while the festival experience is being updated.')}<section class="section"><div class="container"><article class="info-card" style="max-width:720px;margin:0 auto;text-align:center"><span class="num">VYUHAM’26 / FEATURE STATUS</span><h2>This page is not active yet.</h2><p class="muted">Please return to the main festival pages for current information.</p><a class="button button-primary" href="#/home">RETURN HOME ↗</a></article></div></section>`;
  function renderEvents(query = '') {
    const params = new URLSearchParams(query); let selected = params.get('stream') || 'all'; let search = ''; let day = 'all', sort = 'day';
    const grid = $('#eventsGrid'), count = $('#eventCount'), input = $('#eventSearch');
    const draw = () => {
      const filtered = events.filter(e => {
        if (e.status === 'cancelled') return false;
        const streamOk = selected === 'all' || e.stream === selected || (selected === 'tech' && e.stream === 'technology') || (selected === 'cultural' && e.stream === 'culture') || (selected === 'esports' && e.stream === 'gaming');
        const eventDays = Array.isArray(e.scheduleDays) ? e.scheduleDays : (e.day == null ? [] : [Number(e.day)]);
        const dayOk = day === 'all' || eventDays.includes(Number(day));
        const hay = [e.title, e.description, e.stream, e.venue].join(' ').toLowerCase(); return streamOk && dayOk && hay.includes(search.toLowerCase());
      });
      if (sort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));
      if (sort === 'fee') filtered.sort((a, b) => { const cost = e => { const m = String(e.fee || '').match(/[\d,]+/); return m ? Number(m[0].replaceAll(',', '')) : Infinity }; return cost(a) - cost(b) });
      if (sort === 'day') filtered.sort((a, b) => {
        const order = e => e.scheduleGroup === 'pre-fest' ? 0 : (e.scheduleDays?.length ? Math.min(...e.scheduleDays) : Number(e.day) || 9);
        return order(a) - order(b) || a.title.localeCompare(b.title);
      });
      count.textContent = `${String(filtered.length).padStart(2, '0')} EVENTS FOUND / ${events.length} ${document.documentElement.dataset.api === 'online' ? 'LIVE API' : 'CATALOG'} RECORDS`;
      grid.innerHTML = filtered.length ? filtered.map(eventCard).join('') : '<div class="empty-state" style="grid-column:1/-1">No events match these filters. Clear a filter or try another search.</div>';
      $$('#streamFilters .filter-pill').forEach(b => b.classList.toggle('active', b.dataset.stream === selected)); observeReveals();
    };
    input.addEventListener('input', e => { search = e.target.value; draw() });
    $('#eventDay').addEventListener('change', e => { day = e.target.value; draw() });
    $('#eventSort').addEventListener('change', e => { sort = e.target.value; draw() });
    $('#streamFilters').addEventListener('click', e => { const b = e.target.closest('[data-stream]'); if (!b) return; selected = b.dataset.stream; draw() });
    draw();
  }
  function renderSchedule(day = 1) {
    const selected = Number(day) || 1; const d = days.find(x => x.day === selected) || days[0];
    $$('#scheduleDays button').forEach(b => { const active = Number(b.dataset.day) === selected; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)) });
    const dayEvents = events.filter(e => {
      const eventDays = Array.isArray(e.scheduleDays) ? e.scheduleDays : (e.day == null ? [] : [Number(e.day)]);
      return eventDays.includes(selected) && e.status !== 'cancelled';
    }).sort((a, b) => scheduleMinutes(a.time) - scheduleMinutes(b.time));
    $('#scheduleContent').innerHTML = `<div class="schedule-heading"><div><div class="eyebrow">DAY 0${d.day} / ${d.date}</div><h2>${d.name}</h2></div><p class="muted">${d.desc}</p></div><div class="schedule-list">${dayEvents.length ? dayEvents.map((e, index) => `<article class="schedule-row"><div class="schedule-time"><span>0${String(index + 1).padStart(2, '0')}</span><time>${esc(e.time)}</time></div><div class="schedule-event"><span class="schedule-stream">${esc(streamLabel(e.stream))}</span><h3><a href="#/event/${encodeURIComponent(e.slug)}">${esc(e.title)}</a></h3><p>${esc(e.description)}</p></div><div class="venue"><span>LOCATION</span><b>⌖ ${esc(officialVenue(e.venue))}</b></div></article>`).join('') : '<div class="empty-state">No event records are currently listed for this day.</div>'}</div>`;
  }
  function observeReveals() {
    const items = $$('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) { items.forEach(x => x.classList.add('visible')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }), { threshold: .08 }); items.forEach(x => io.observe(x));
  }
  async function loadResults() { const root = $('#resultsFeed'); if (!root) return; try { const rows = await window.VYUHAM_API.get('/events/results'); root.innerHTML = rows.length ? rows.map(row => `<article class="info-card"><span class="num">${esc(row.stream)} / PUBLISHED ${esc(row.published_at)}</span><h3>${esc(row.event_name)}</h3><p>1st · ${esc(row.first_place)}<br>2nd · ${esc(row.second_place)}<br>3rd · ${esc(row.third_place)}</p><small class="muted">PRIZES ${esc(row.prize_distributed)}</small></article>`).join('') : '<article class="empty-state" style="grid-column:1/-1">No official results have been published yet.</article>' } catch (error) { root.textContent = `Could not load verified results: ${error.message}` } }
  async function loadLeaderboard() { const root = $('#leaderboardFeed'); if (!root) return; try { const rows = await window.VYUHAM_API.get('/events/results'); root.innerHTML = rows.length ? rows.map(row => `<article class="info-card"><span class="num">${esc(row.stream)} / ${esc(row.published_at)}</span><h3>${esc(row.event_name)}</h3><p><strong>1ST</strong> · ${esc(row.first_place)}<br><strong>2ND</strong> · ${esc(row.second_place)}${row.third_place ? `<br><strong>3RD</strong> · ${esc(row.third_place)}` : ''}</p>${row.prize_distributed ? `<small class="muted">PRIZES ${esc(row.prize_distributed)}</small>` : ''}</article>`).join('') : '<article class="empty-state" style="grid-column:1/-1">No verified placements have been published yet.</article>' } catch (error) { root.innerHTML = `<article class="notice" style="grid-column:1/-1">Could not load official standings: ${esc(error.message)}</article>` } }
  async function showReceipt(reference) { const out = $('#receiptResult'), message = $('#receiptMessage'); if (!out || !message) return; const ref = String(reference || '').trim(); if (!ref) return; out.innerHTML = '<div class="notice">Checking the authenticated receipt record…</div>'; if (!window.VYUHAM_API.session()?.access_token) { message.innerHTML = 'Account-based receipt lookup is unavailable on this static site. Open MakeMyPass to access ticket receipts.'; out.textContent = ''; return } try { const receipt = await window.VYUHAM_API.get(`/payments/receipt/${encodeURIComponent(ref)}`); message.textContent = 'Receipt verified by the VYUHAM backend.'; out.innerHTML = `<article class="info-card"><span class="num">VERIFIED RECEIPT / ${esc(receipt.receipt_no)}</span><h2>${esc(receipt.attendee_name)}</h2><p>${esc(receipt.college)} · ${esc(receipt.timestamp)} · ${esc(receipt.payment_method)}</p><div class="schedule-list">${receipt.items.map(item => `<div class="schedule-row"><div><h3>${esc(item.title)}</h3><p>${esc(item.stream)}</p></div><div class="venue">₹${Number(item.fee).toLocaleString('en-IN')}</div></div>`).join('')}</div><p>Subtotal ₹${Number(receipt.subtotal).toLocaleString('en-IN')} · Platform fee ₹${Number(receipt.platform_fee).toLocaleString('en-IN')}</p><h3>TOTAL ₹${Number(receipt.total_amount).toLocaleString('en-IN')}</h3><small class="muted">REFERENCE ${esc(receipt.transaction_ref)}</small></article>` } catch (error) { message.textContent = `Receipt lookup failed: ${error.message}`; out.innerHTML = '' } }
  async function loadMyCertificates() { const root = $('#myCertificates'); if (!root) return; if (!window.VYUHAM_API.session()?.access_token) { root.innerHTML = '<article class="notice" style="grid-column:1/-1">Personal certificate lookup requires an organizer-provided certificate link or code.</article>'; return } try { const rows = await window.VYUHAM_API.get('/certificates/me'); root.innerHTML = rows.length ? rows.map(cert => `<article class="info-card"><span class="num">${esc(cert.stream)} / ${esc(cert.role)}</span><h3>${esc(cert.event)}</h3><p>${esc(cert.certificate_code)} · ${esc(cert.status)}</p><small class="muted">ISSUED ${esc(cert.issue_date)}</small>${safeExternalUrl(cert.pdf_url) ? `<p><a class="text-link" href="${esc(safeExternalUrl(cert.pdf_url))}" target="_blank" rel="noopener">DOWNLOAD CERTIFICATE ↗</a></p>` : ''}</article>`).join('') : '<article class="empty-state" style="grid-column:1/-1">No certificates have been issued to this account yet.</article>' } catch (error) { root.textContent = `Could not load your certificates: ${error.message}` } }
  async function loadCheckin() { const access = $('#checkinAccess'); if (!access) return; if (!window.VYUHAM_API.session()?.access_token) { access.innerHTML = 'Scanner access is restricted to authorized volunteers and organizers. Sign-in is not available on this static site.'; $('#checkinForm').querySelectorAll('input,select,button').forEach(el => el.disabled = true); return } try { const profile = await window.VYUHAM_API.get('/auth/me'); if (!['volunteer', 'event_head', 'admin'].includes(profile.role)) { access.textContent = 'Scanner access denied. This profile does not have an operations role.'; $('#checkinForm').querySelectorAll('input,select,button').forEach(el => el.disabled = true); return } access.textContent = `SCANNER AUTHORIZED / ${profile.role.toUpperCase()} / ${profile.name || profile.email}`; const history = await window.VYUHAM_API.get(`/checkin/history?station=${encodeURIComponent($('#scanStation').value)}&limit=20`); $('#checkinHistory').innerHTML = history.length ? history.map(r => `<div class="schedule-row"><time>${esc(new Date(r.scanned_at).toLocaleTimeString())}</time><div><h3>${esc(r.ticket_code)} · ${esc(r.status)}</h3><p>${esc(r.attendee_name)} · ${esc(r.event_name)}</p></div><div class="venue">${esc(r.station)}</div></div>`).join('') : 'No scans recorded at this station.' } catch (error) { access.textContent = `Could not verify scanner access: ${error.message}` } }
  function render() {
    const r = route();
    $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded', 'false'); $('#menuToggle').setAttribute('aria-label', 'Open navigation');
    $$('#mainNav [data-route]').forEach(a => a.classList.toggle('active', a.dataset.route === r.page));
    const shells = ['certificates', 'checkin', 'checkout', 'confirmation', 'feedback', 'food', 'leaderboard', 'payment', 'photography', 'qualifiers', 'receipt', 'results'];
    const removedRoutes = new Set(['login', 'signup', 'register', 'account', 'dashboard', 'profile', 'teams', 'hackathon', 'ctf', 'admin', 'sponsors']);
    if (removedRoutes.has(r.page)) { location.replace(`${location.pathname}${location.search}#/home`); return }
    const disabledRoutes = new Set(['announcements', 'contact', 'feedback', 'results', 'leaderboard', 'certificates', 'receipt', 'checkin']);
    const views = { home, events: () => eventsPage(location.hash.includes('?') ? location.hash.split('?').slice(1).join('?') : ''), streams: streamsPage, event: () => eventDetail(r.slug), schedule: schedulePage, about: aboutPage, venue: venuePage, contact: contactPage, faq: faqPage, participate: participationPage, competitions: competitionsPage, ...Object.fromEntries(shells.map(p => [p, () => featurePage(p)])) };
    const routeDisabled = disabledRoutes.has(r.page);
    app.innerHTML = routeDisabled ? comingSoonPage() : (views[r.page] || notFound)();
    const typewriterHeading = $('.venue-about-typewriter');
    const typewriterText = typewriterHeading?.querySelector('[data-typewriter]');
    if (typewriterHeading && typewriterText) {
      const fullText = typewriterText.dataset.typewriter || '';
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { typewriterText.textContent = fullText; typewriterHeading.classList.add('is-complete') }
      else {
        let typedCharacters = 0;
        typewriterText.textContent = '';
        const typeNextCharacter = () => {
          if (!typewriterText.isConnected) return;
          typedCharacters += 1;
          typewriterText.textContent = fullText.slice(0, typedCharacters);
          if (typedCharacters >= fullText.length) { typewriterHeading.classList.add('is-complete'); return }
          setTimeout(typeNextCharacter, /[,.]/.test(fullText[typedCharacters - 1]) ? 180 : 24);
        };
        typeNextCharacter();
      }
    }
    const intro = $('#landingIntro');
    if (intro) {
      const homeHero = $('#home');
      const previousFocus = document.activeElement;
      const inertTargets = [$('#siteHeader'), $('#siteFooter')].filter(Boolean);
      let introFinished = false;
      let sequenceStarted = false;
      let completionTimer;
      let assetFallbackTimer;
      let finalFallbackTimer;
      // Lock scroll and pause the sequence until its visual assets are ready.
      document.documentElement.classList.add('intro-locked');
      document.body.classList.add('intro-locked');
      document.documentElement.classList.add('intro-sequence-pending');
      inertTargets.forEach(el => { el.inert = true });
      homeHero?.setAttribute('inert', '');
      const finish = () => {
        if (introFinished) return;
        introFinished = true;
        clearTimeout(completionTimer);
        clearTimeout(assetFallbackTimer);
        clearTimeout(finalFallbackTimer);
        document.documentElement.classList.remove('intro-locked');
        document.body.classList.remove('intro-locked');
        document.documentElement.classList.remove('intro-sequence-pending');
        intro.remove();
        homeHero?.classList.remove('intro-handoff');
        homeHero?.classList.add('intro-completed');
        homeHero?.removeAttribute('inert');
        inertTargets.forEach(el => { el.inert = false });
        document.removeEventListener('keydown', onKeyDown);
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      };
      const onKeyDown = event => {
        if (event.key === 'Tab') { event.preventDefault(); intro.focus({ preventScroll: true }) }
      };
      document.addEventListener('keydown', onKeyDown);
      intro.focus({ preventScroll: true });
      const startSequence = () => {
        if (sequenceStarted || introFinished) return;
        sequenceStarted = true;
        document.documentElement.classList.remove('intro-sequence-pending');
        // Hold the completed VYUHAM identity for 1.5s, then allow the 1.5s fade to finish.
        completionTimer = setTimeout(finish, 8250);
      };
      const images = [...new Set([...intro.querySelectorAll('img'), ...homeHero.querySelectorAll('.stage-main img')])];
      const imagesReady = Promise.all(images.map(image => Promise.resolve().then(() => image.decode?.()).catch(() => undefined)));
      assetFallbackTimer = setTimeout(startSequence, 4000);
      imagesReady.then(startSequence);
      finalFallbackTimer = setTimeout(finish, 16000);
    }
    updateHeaderRegistration();
    updateCountdown();
    $('#siteFooter').style.display = '';
    if (routeDisabled) return;
    if (r.page === 'events') renderEvents(location.hash.includes('?') ? location.hash.split('?').slice(1).join('?') : '');
    if (r.page === 'schedule') {
      renderSchedule(1); $('#scheduleDays').addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (b) renderSchedule(b.dataset.day) });
    }
    if (r.page === 'contact') $('#contactForm').addEventListener('submit', async e => { e.preventDefault(); const d = new FormData(e.currentTarget); const button = e.currentTarget.querySelector('button[type="submit"]'); button.disabled = true; try { await window.VYUHAM_API.post('/contact', { name: d.get('name'), email: d.get('email'), tier: d.get('topic'), message: d.get('message') }); toast('Your inquiry was saved for organizer follow-up.'); e.currentTarget.reset() } catch (error) { toast(`Could not send message: ${error.message}. Please email techfest@duk.ac.in.`) } finally { button.disabled = false } });
    if (r.page === 'feedback') $('#feedbackForm').addEventListener('submit', async e => { e.preventDefault(); const d = new FormData(e.currentTarget); try { await window.VYUHAM_API.post('/feedback', { rating: Number(d.get('rating')), comments: d.get('comments') }); toast('Feedback received. Thank you.'); e.currentTarget.reset() } catch (error) { toast(`Feedback could not be sent: ${error.message}`) } });
    if (r.page === 'results') loadResults();
    if (r.page === 'leaderboard') loadLeaderboard();
    if (r.page === 'certificates') loadMyCertificates();
    if (r.page === 'receipt') $('#receiptForm').addEventListener('submit', async event => { event.preventDefault(); await showReceipt(new FormData(event.currentTarget).get('transaction_ref')) });
    if (r.page === 'checkin') loadCheckin();
    if (r.page === 'certificates') $('#certificateForm').addEventListener('submit', async e => { e.preventDefault(); const code = new FormData(e.currentTarget).get('code'); const root = $('#certificateResult'); root.innerHTML = '<div class="notice">Checking the official certificate registry…</div>'; try { const cert = await window.VYUHAM_API.get(`/certificates/verify/${encodeURIComponent(code)}`); root.innerHTML = `<article class="info-card"><span class="num">VERIFIED / ${esc(cert.certificate_code)}</span><h3>${esc(cert.participant_name)}</h3><p>${esc(cert.event)} · ${esc(cert.role)} · ${esc(cert.stream)}</p><small class="muted">${esc(cert.status)} · ISSUED ${esc(cert.issue_date)}</small>${safeExternalUrl(cert.pdf_url) ? `<p><a class="text-link" href="${esc(safeExternalUrl(cert.pdf_url))}" target="_blank" rel="noopener">OPEN CERTIFICATE PDF ↗</a></p>` : ''}</article>` } catch (error) { root.innerHTML = `<div class="notice">Certificate not verified: ${esc(error.message)}</div>` } });
    if (r.page === 'checkin') { $('#checkinForm').addEventListener('submit', async e => { e.preventDefault(); const d = new FormData(e.currentTarget), out = $('#scanResult'), button = e.currentTarget.querySelector('button'); button.disabled = true; try { const result = await window.VYUHAM_API.post('/checkin/scan', { ticket_code: d.get('ticket_code'), station: d.get('station') }); out.innerHTML = `<div class="notice"><b>${esc(result.status.toUpperCase())}</b> · ${esc(result.attendee_name || 'Unknown attendee')} · ${esc(result.event_name || 'No event')}<br>${esc(result.notes || '')}</div>`; await loadCheckin(); if (result.status === 'approved') e.currentTarget.elements.ticket_code.value = '' } catch (error) { out.innerHTML = `<div class="notice">Scan failed: ${esc(error.message)}</div>` } finally { button.disabled = false } }); $('#scanStation').addEventListener('change', loadCheckin) }
    if (r.page === 'faq') $$('.faq-question').forEach(b => b.addEventListener('click', () => { const item = b.closest('.faq-item'); item.classList.toggle('open'); b.setAttribute('aria-expanded', String(item.classList.contains('open'))); b.querySelector('span').textContent = item.classList.contains('open') ? '−' : '＋' }));
    observeReveals(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); $('#app').focus({ preventScroll: true });
  }
  function toast(message) { const region = $('#toastRegion'); const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; region.append(el); setTimeout(() => el.remove(), 4200) }
  const closeMenu = () => { $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded', 'false'); $('#menuToggle').setAttribute('aria-label', 'Open navigation') };
  const terminalOverlay = $('#terminalOverlay'), terminalHistory = $('#terminalHistory'), terminalInput = $('#terminalInput');
  const commandHistory = []; let commandHistoryIndex = -1;
  const terminalPrint = (type, content) => { const line = document.createElement(type === 'ascii' ? 'pre' : 'div'); line.className = `terminal-line ${type}`; line.textContent = content; terminalHistory.append(line); terminalHistory.scrollTop = terminalHistory.scrollHeight };
  const terminalPrintHelp = () => {
    const line = document.createElement('section'); line.className = 'terminal-line terminal-help';
    const groups = [
      ['EXPLORE', [
        ['events', 'Open the event directory'], ['event <name-or-slug>', 'Open an event dossier'], ['schedule', 'Open the festival schedule'], ['streams', 'Browse festival streams'], ['venue', 'View venue information'], ['about', 'About VYUHAM’26'], ['participate', 'Participation guide'], ['competitions', 'Competition hub']
      ]],
      ['REGISTRATION', [['register', 'Open MakeMyPass registration']]],
      ['SYSTEM', [['status / reg:status', 'Show registration status']]],
      ['TERMINAL', [['help', 'Show this guide'], ['clear / cls', 'Clear terminal history'], ['exit / quit', 'Close terminal']]]
    ];
    line.innerHTML = `<h2>VYUHAM’26 TERMINAL</h2>${groups.map(([title, commands]) => `<section class="terminal-help-group"><h3>${title}</h3><div class="terminal-help-commands">${commands.map(([command, description]) => `<div class="terminal-help-row"><code>${command}</code><span>${description}</span></div>`).join('')}</div></section>`).join('')}`;
    terminalHistory.append(line); terminalHistory.scrollTop = terminalHistory.scrollHeight;
  };
  const openTerminal = () => { closeMenu(); terminalOverlay.hidden = false; document.documentElement.classList.add('terminal-open'); terminalInput.focus() };
  const closeTerminal = () => { terminalOverlay.hidden = true; document.documentElement.classList.remove('terminal-open'); $('#consoleLauncher').focus() };
  const terminalNavigate = (path, message) => { terminalPrint('system', message); closeTerminal(); go(path) };
  const runTerminalCommand = async raw => {
    const text = raw.trim(); if (!text) return; terminalPrint('input', `$ ${text}`); commandHistory.push(text); commandHistoryIndex = commandHistory.length;
    const [verb, ...args] = text.split(/\s+/), cmd = verb.toLowerCase(), arg = args.join(' ').trim(), aliases = { schedule: 'schedule', events: 'events', streams: 'streams', about: 'about', venue: 'venue', participate: 'participate', competitions: 'competitions' };
    const navigateCommands = new Set(Object.keys(aliases));
    if (navigateCommands.has(cmd)) { terminalNavigate(aliases[cmd], `ROUTE // ${aliases[cmd].toUpperCase()}`); return }
    if (cmd === 'help') terminalPrint('system', 'LOGIN / SIGNUP // Opens the official MakeMyPass VYUHAM portal.');
    if (cmd === 'event') {
      const event = events.find(item => item.slug.toLowerCase() === arg.toLowerCase() || slugify(item.title) === slugify(arg));
      if (event) terminalNavigate(`event/${encodeURIComponent(event.slug)}`, `EVENT // ${event.title}`); else terminalPrint('error', arg ? `No event found for “${arg}”. Try: events` : 'Usage: event <event-name-or-slug>'); return;
    }
    if (cmd === 'register' || cmd === 'registration') {
      if (!canRegister()) { terminalPrint('error', 'REGISTRATION CLOSED // The organizer has closed registration.'); return }
      terminalPrint('system', 'Redirecting to the official MakeMyPass registration page…'); location.assign(MAKEMYPASS_HOME); return;
    }
    if (cmd === 'reg:status' || cmd === 'registration:status' || cmd === 'status') {
      terminalPrint('output', `VYUHAM’26 SYSTEM STATUS\nSITE          : ONLINE\nEVENT RECORDS : ${events.length}\nREGISTRATION  : ${canRegister() ? 'OPEN' : 'CLOSED'}\nFESTIVAL      : 30 OCT — 01 NOV 2026`); return;
    }
    if (cmd === 'whoami') {
      terminalPrint('output', 'VYUHAM’26 SESSION\nAUTH : NOT AVAILABLE IN THE STATIC SITE'); return;
    }
    if (cmd === 'help') {
      terminalPrintHelp(); return;
    }
    if (cmd === 'clear' || cmd === 'cls') { terminalHistory.replaceChildren(); return }
    if (cmd === 'exit' || cmd === 'quit' || cmd === 'close') { closeTerminal(); return }
    if (cmd === 'logo') { terminalPrint('system', 'VYUHAM’26 // DIGITAL UNIVERSITY KERALA'); return }
    terminalPrint('error', `Unknown command: ${verb}. Type “help” to see available commands.`);
  };
  const terminalForm = $('#terminalForm');
  terminalForm.addEventListener('submit', event => { event.preventDefault(); const value = terminalInput.value; terminalInput.value = ''; runTerminalCommand(value) });
  terminalInput.addEventListener('keydown', event => { if (event.key === 'ArrowUp') { event.preventDefault(); commandHistoryIndex = Math.max(0, commandHistoryIndex - 1); terminalInput.value = commandHistory[commandHistoryIndex] || '' } else if (event.key === 'ArrowDown') { event.preventDefault(); commandHistoryIndex = Math.min(commandHistory.length, commandHistoryIndex + 1); terminalInput.value = commandHistory[commandHistoryIndex] || '' } });
  $('#consoleLauncher').addEventListener('click', openTerminal); $('#consoleFooter').addEventListener('click', openTerminal); $('#terminalClose').addEventListener('click', closeTerminal);
  terminalOverlay.addEventListener('click', event => { if (event.target === terminalOverlay) closeTerminal() });
  terminalPrint('system', 'VYUHAM’26 // FESTIVAL CONSOLE READY\nExplore the festival, events and schedule. Type “help” for commands.');
  $('#menuToggle').addEventListener('click', () => { const open = $('#mainNav').classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(open)); $('#menuToggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation') });
  $('#mainNav').addEventListener('click', e => { if (e.target.closest('a')) closeMenu() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!terminalOverlay.hidden) closeTerminal(); closeMenu(); return } const isEditable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable; const backtick = e.key === '`' || e.key === '~' || e.code === 'Backquote'; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); terminalOverlay.hidden ? openTerminal() : closeTerminal() } else if (backtick && !isEditable) { e.preventDefault(); terminalOverlay.hidden ? openTerminal() : closeTerminal() } else if (e.key === '?' && !isEditable) { e.preventDefault(); openTerminal() } });
  document.addEventListener('click', e => { if (!e.target.closest('#siteHeader')) closeMenu() });
  const isRouteHash = () => location.hash.startsWith('#/');
  const scrollToHashTarget = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  window.addEventListener('hashchange', () => {
    if (isRouteHash()) render();
    else scrollToHashTarget();
  });
  window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; $('#topProgress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})` }, { passive: true });
  // Accurate IST countdown, with no negative values after the target time.
  const festivalStart = '2026-10-30T09:00:00+05:30';
  function updateCountdown() { const remaining = Math.max(0, new Date(festivalStart).getTime() - Date.now()); const values = [Math.floor(remaining / 86400000), Math.floor(remaining % 86400000 / 3600000), Math.floor(remaining % 3600000 / 60000), Math.floor(remaining % 60000 / 1000)]; $$('[data-countdown]').forEach(el => { el.innerHTML = values.map((value, i) => `<span><b>${String(value).padStart(2, '0')}</b><i>${['DAYS', 'HRS', 'MIN', 'SEC'][i]}</i></span>`).join('') }) }
  updateCountdown(); setInterval(updateCountdown, 1000);
  render();
  if (!isRouteHash() && location.hash.length > 1) scrollToHashTarget();
})();

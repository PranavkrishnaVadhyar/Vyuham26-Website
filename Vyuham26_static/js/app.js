(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const app = $('#app');
  const allEventRecords = Array.isArray(window.VYUHAM_EVENTS) ? window.VYUHAM_EVENTS : [];
  let events = allEventRecords;
  const hiddenEventSlugs = new Set(['hackathon-continues', 'hackathon-demos', 'hackathon-winners', 'inauguration-ceremony', 'talk-quantum-ai', 'cultural-night', 'dj-night', 'concert', 'fashion-show', 'food-court']);
  const hiddenEventTitles = new Set(['hackathon continues', 'hackathon demos & judging', 'hackathon winners & prize distribution', 'inauguration ceremony', 'talk: responsible ai — a humanities lens', 'cultural night', 'dj night', 'concert night', 'fashion show', 'food court, markets & stalls']);
  const isVisibleEvent = event => event.slug !== 'fit-arena-fitness-competition' && !hiddenEventSlugs.has(event.legacySlug || event.slug) && !hiddenEventTitles.has(String(event.title || event.name || '').trim().toLowerCase());
  const eventSlugAliases = new Map(events.filter(event => event.legacySlug).map(event => [event.legacySlug, event.slug]));
  eventSlugAliases.set('ink-letter-calligraphy-workshop', 'ink-and-letter-calligraphy-workshop');
  events = events.filter(isVisibleEvent);
  let registrationOpen = true;
  let landingIntroSeen = false;
  let heroCarouselCleanup = null;
  let concertPopupCleanup = null;
  let concertPopupShownThisSession = false;
  const registrationFeatureEnabled = window.VYUHAM_REGISTRATION_ENABLED === true;
  const MAKEMYPASS_HOME = 'https://org.makemypass.com/web/vyuham-26';
  const DAY_PASS_URL = `${MAKEMYPASS_HOME}/events/vyuham-day-pass`;
  const DAY_PASS_METADATA = { passLimit: '', fee: 'FREE ENTRY', poster: 'assets/eventpics/vyuham-day-pass.png' };
  const CONCERT_REGISTRATION_URL = 'https://org.makemypass.com/web/vyuham-26/events/concert';
  const CONCERT_PROMOTION = Object.freeze({
    slug: 'thamarassery-churam-concert',
    title: 'Thamarassery Churam Ft. Punnya Pradeep - Concert',
    date: '1 November 2026',
    time: '7:00 PM',
    venue: 'Digital University Kerala (DUK)',
    audience: 'For college students and Technopark employees',
    poster: 'assets/events/thamarassery-churam-punnya-pradeep-poster.jpg',
    registrationUrl: CONCERT_REGISTRATION_URL
  });
  const MAKEMYPASS_EVENT_PATHS = {
    hackathon: 'hackathon-24hr', 'workshop-ethical-hacking': 'workshop-ethical-hacking-osint',
    'best-manager': 'best-manager-4', 'marketing-game': 'marketing-game-3',
    'best-management-team': 'best-management-team', 'ctf': 'capture-the-flag-3',
    'tech-quiz': 'tech-quiz', 'startup-showcase': 'startup-showcase', 'prompt-war': 'prompt-war',
    'panel-cybersecurity': 'cybersecurity-panel-live-demo',
    'talk-ksum': 'talk-session-kerala-startup-mission', 'ai-short-film': 'ai-short-film',
    'fifa-27': 'fifa-27', 'valorant': 'valorant-tournament-2', 'movie-quiz': 'movie-quiz',
    'play-fest': 'play-fest', 'fitness-competition': 'fitness-competition',
    'efootball': 'e-football-tournament-2', 'bgmi': 'bgmi-tournament-3',
    'photography': 'photography-videography', 'business-quiz': 'business-quiz-2',
    'hr-game': 'hr-game-1', 'finance-game': 'finance-game-3',
    'cdac-workshop': 'c-dac-workshop',
    'project-expo-ieee': 'project-expo-by-ieee'
  };
  const days = [
    { day: 1, name: 'DAY 01', date: '30 OCT 2026', dateLabel: '30 October 2026', dateLong: 'Friday · 30 October 2026', desc: 'Management challenges, workshops and expert sessions, alongside the opening of the 24-hour hackathon.' },
    { day: 2, name: 'DAY 02', date: '31 OCT 2026', dateLabel: '31 October 2026', dateLong: 'Saturday · 31 October 2026', desc: 'Project showcases, the VEGA processor workshop, AI sessions, quiz arenas and VYUHAM After Dark.' },
    { day: 3, name: 'DAY 03', date: '01 NOV 2026', dateLabel: '01 November 2026', dateLong: 'Sunday · 01 November 2026', desc: 'Ethical hacking, competition finals, Couture Boulevard and the Thamarassery Churam Ft. Punnya Pradeep concert.' }
  ];
  const sponsors = [
    { name: 'DSpace', category: 'Title Sponsor', status: 'Confirmed', logo: 'assets/sponsors/dspace.svg' },
    { name: 'Canara Bank', category: 'Associate Sponsor', status: 'Confirmed', logo: 'assets/sponsors/canara_bank.svg' },
    { name: 'Reflections', category: 'Technology Partner', logo: 'assets/sponsors/reflections.png' }
  ];
  const streams = [
    { id: 'tech', name: 'Technology', symbol: '01', desc: 'Hackathons, cybersecurity, AI and hands-on invention. Build what comes next.', index: '01', image: 'assets/streams/technology.jpg' },
    { id: 'cultural', name: 'Culture', symbol: '02', desc: 'Performance, art, film and live experiences made to be shared.', index: '02', image: 'assets/streams/culture.jpg' },
    { id: 'esports', name: 'Gaming / Esports', symbol: '03', desc: 'Step into competitive arenas across FIFA 27, BGMI and E-Football.', index: '03', image: 'assets/streams/gaming.jpg' },
    { id: 'management', name: 'Management', symbol: '04', desc: 'Leadership, enterprise and strategy shaped by real-world challenges.', index: '04', image: 'assets/streams/management.jpg' }
  ];
  const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const titleCase = value => String(value || '').toLocaleLowerCase().replace(/\b\w/g, character => character.toUpperCase());
  const sponsorsSection = (page = 'home') => {
    const isHome = page === 'home';
    const renderSponsor = (sponsor, extraClass = '') => `<article class="sponsor-entry ${extraClass} ${sponsor.name === 'Reflections' ? 'sponsor-entry-reflections' : ''}"><div class="sponsor-mark">${sponsor.logo ? `<img src="${esc(sponsor.logo)}" alt="${esc(sponsor.name)}" loading="lazy">` : `<span class="sponsor-wordmark" role="img" aria-label="${esc(sponsor.name)}">${esc(sponsor.name)}</span>`}</div><span class="sponsor-name">${esc(sponsor.name)}</span><span class="sponsor-category">${esc(sponsor.category)}</span></article>`;
    const titleSponsor = sponsors.find(sponsor => sponsor.category === 'Title Sponsor');
    const supportingSponsors = sponsors.filter(sponsor => sponsor.category !== 'Title Sponsor');
    return `<section class="section sponsors-section sponsors-section-${page}"${isHome ? ' id="sponsors"' : ''}><div class="container"><div class="section-head sponsor-section-head"><div><div class="eyebrow">VYUHAM / PARTNERS</div><h2>OUR<br><span class="green">SPONSORS</span></h2></div><p>Meet the organizations supporting VYUHAM’26.</p></div><div class="sponsor-showcase"><div class="sponsor-tier sponsor-tier-title">${titleSponsor ? renderSponsor(titleSponsor, 'sponsor-entry-title') : ''}</div><div class="sponsor-tier sponsor-tier-supporting"><div class="sponsor-supporting-grid">${supportingSponsors.map(sponsor => renderSponsor(sponsor, 'sponsor-entry-supporting')).join('')}</div></div></div><div class="sponsors-section-footer"><span>Partnerships that help bring the festival to life.</span><a class="button button-outline" href="mailto:techfest@duk.ac.in">PARTNERSHIP ENQUIRIES ↗</a></div></div></section>`;
  };
  const safeExternalUrl = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const safeEventImage = value => {
    const external = safeExternalUrl(value);
    if (external) return external;
    const local = String(value || '').trim();
    return /^assets\/(?:eventpics|events)\/[a-z0-9 _&().-]+\.(?:png|jpe?g|webp|avif)$/i.test(local) ? local : '';
  };
  const scheduleMinutes = value => {
    const match = String(value || '').match(/(\d{1,2}):(\d{2})\s*([AP])\.?M\.?/i);
    if (!match) return Number.POSITIVE_INFINITY;
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'P') hour += 12;
    return hour * 60 + Number(match[2]);
  };
  const officialVenue = value => value || 'Not listed in official schedule';
  const ordinalDate = dateStr => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const match = String(dateStr || '').match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (!match) return dateStr;
    const day = Number(match[1]);
    const suffix = [11,12,13].includes(day % 100) ? 'th' : {1:'st',2:'nd',3:'rd'}[day % 10] || 'th';
    const monthIdx = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].indexOf(match[2].toUpperCase());
    return `${day}${suffix} ${months[monthIdx] || match[2]}`;
  };
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
      ? '30th October – 1st November 2026'
      : ordinalDate(days[Number(event.day) - 1]?.date) || 'TBA';
  const officialEventTitle = event => event.officialTitle || event.title;
  const eventPrizeValue = event => {
    const match = String(event.prizePool || '').match(/[\d,]+/);
    return match ? Number(match[0].replaceAll(',', '')) : 0;
  };
  const verifiedPrizePoolValue = event => {
    const match = String(event.prizePool || '').match(/₹\s*([\d,]+)/);
    return match ? Number(match[1].replaceAll(',', '')) : 0;
  };
  const eventMetadataFields = event => [
    ...(event.eventType === 'workshop'
      ? [{ label: 'CERTIFICATE PROVIDED', value: 'Yes' }]
      : event.prizePool ? [{ label: 'PRIZE POOL', value: event.prizePool }] : []),
    ...(event.participantLimit ? [{ label: 'PARTICIPANT LIMIT', value: event.participantLimit }] : []),
    ...(event.passLimit ? [{ label: 'PASS LIMIT', value: event.passLimit }] : []),
    ...(String(event.fee || '').trim() ? [{ label: 'FEE', value: event.fee }] : [])
  ];
  const renderEventMetadata = event => {
    const fields = eventMetadataFields(event);
    return fields.length ? `<div class="event-meta">${fields.map(field => `<span>${esc(field.label)}<strong>${esc(field.value)}</strong></span>`).join('')}</div>` : '';
  };
  const renderEventIntelRows = event => {
    const rows = [];
    const universalEligibility = 'Open to all working professionals and students.';
    const date = eventDateLabel(event);
    if (date && date !== 'TBA') rows.push({ label: 'DATE', value: date });
    if (event.time) rows.push({ label: 'TIME', value: event.time });
    if (event.speaker) rows.push({ label: 'SPEAKER', value: event.speaker });
    if (event.designation) rows.push({ label: 'DESIGNATION', value: event.designation });
    if (event.format) rows.push({ label: 'FORMAT', value: event.format });
    if (event.duration) rows.push({ label: 'DURATION', value: event.duration });
    rows.push(...eventMetadataFields(event));
    if (event.teamSize) rows.push({ label: 'TEAM SIZE', value: event.teamSize });
    rows.push({ label: 'ELIGIBILITY', value: universalEligibility });
    return rows.map(row => {
      const isSocIntelValue = (event.legacySlug || event.slug) === 'panel-cybersecurity' && ['TIME', 'SPEAKER', 'DESIGNATION', 'FORMAT'].includes(row.label);
      const classes = [row.label === 'PRIZE POOL' ? 'green' : '', isSocIntelValue ? 'soc-intel-value' : ''].filter(Boolean).join(' ');
      return `<div><dt>${esc(row.label)}</dt><dd${classes ? ` class="${classes}"` : ''}>${esc(row.value)}</dd></div>`;
    }).join('');
  };
  const eventStreamRank = event => ['tech', 'technology', 'management'].includes(String(event.stream || '').toLowerCase()) ? 0 : 1;
  const eventPriority = (a, b) => {
    const statusRank = event => event.status === 'live' ? 0 : event.status === 'upcoming' ? 1 : 2;
    const dayRank = event => event.scheduleGroup === 'pre-fest' ? 0 : (event.scheduleDays?.length ? Math.min(...event.scheduleDays) : Number(event.day) || 9);
    return dayRank(a) - dayRank(b) || statusRank(a) - statusRank(b) || eventStreamRank(a) - eventStreamRank(b) || eventPrizeValue(b) - eventPrizeValue(a) || officialEventTitle(a).localeCompare(officialEventTitle(b));
  };
  const homepageReplacementSlugs = new Set(['techsprint-tech-quiz', 'promptsmith-arena-prompt-war']);
  const homepageFeaturedEvents = (() => {
    const eligible = events.filter(event => event.registrationOpen !== false && ['live', 'upcoming'].includes(event.status));
    const replacements = eligible.filter(event => homepageReplacementSlugs.has(event.slug));
    const remainingLeaders = eligible
      .filter(event => !homepageReplacementSlugs.has(event.slug) && verifiedPrizePoolValue(event) > 0)
      .sort((a, b) => verifiedPrizePoolValue(b) - verifiedPrizePoolValue(a) || eventPriority(a, b))
      .slice(0, Math.max(0, 4 - replacements.length));
    return [...remainingLeaders, ...replacements]
      .sort((a, b) => verifiedPrizePoolValue(b) - verifiedPrizePoolValue(a) || eventPriority(a, b))
      .slice(0, 4);
  })();
  const homepageFeaturedPoster = event => {
    const candidate = event?.poster;
    if (!candidate) return '';
    return safeExternalUrl(candidate) || (/^(?:\/|assets\/)/.test(candidate) ? candidate : '');
  };
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
    const mapped = MAKEMYPASS_EVENT_PATHS[event.legacySlug || event.slug];
    if (mapped) return `${MAKEMYPASS_HOME}/events/${mapped}`;
    return MAKEMYPASS_HOME;
  };
  // MakeMyPass owns public registration and payment. Keep its links independent
  // from the backend gate, which only controls VYUHAM's internal workflows.
  const canRegister = event => registrationFeatureEnabled && registrationOpen && event?.registrationOpen !== false && !['registration_closed', 'closed', 'cancelled'].includes(event?.status);
  const registrationCta = (url, label, className = 'button button-primary', event = null) => canRegister(event)
    ? `<a class="${className}" href="${esc(url)}">${label}</a>`
    : `<span class="${className} registration-disabled" role="status" aria-disabled="true">REGISTRATION CLOSED</span>`;

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
  const eventCard = e => {
    const image = safeEventImage(e.image);
    const eventUrl = `#/event/${encodeURIComponent(e.slug)}`;
    const isConcert = e.slug === CONCERT_PROMOTION.slug;
    return `<article class="event-card${isConcert ? ' concert-event-card' : ''} reveal" data-stream="${esc(e.stream)}">
    <div class="event-art${image ? ' has-image' : ''}"${isConcert ? '' : ' aria-hidden="true"'}>${image ? (isConcert ? `<a class="concert-event-poster-link" href="${eventUrl}" aria-label="Open ${esc(officialEventTitle(e))} details"><img class="event-art-image" src="${esc(image)}" alt="" loading="lazy" decoding="async"></a>` : `<img class="event-art-image" src="${esc(image)}" alt="" loading="lazy" decoding="async">`) : ''}<span>VYUHAM / ${esc(eventDayLabel(e))}</span></div>
    <div class="event-content"><div class="event-top"><span class="tag stream-pill">${esc(streamLabel(e.stream))}</span><span class="tag day">${esc(eventDateLabel(e))}</span></div>
    <h3><a href="${eventUrl}">${esc(officialEventTitle(e))}</a></h3>${e.officialTitle ? `<p class="event-title-subtitle">${esc(e.title)}</p>` : ''}<p>${esc(e.cardDescription || e.description)}</p>
    ${renderEventMetadata(e)}
    <div class="event-actions"><a class="button button-outline" href="${eventUrl}">DETAILS</a>${registrationCta(registrationUrl(e), 'REGISTER ↗', 'button button-primary', e)}</div></div>
  </article>`;
  };
  const dayPassCard = () => `<article class="event-card day-pass-event-card reveal">
    <div class="event-art has-image" aria-hidden="true"><img class="event-art-image" src="${esc(DAY_PASS_METADATA.poster)}" alt="" loading="lazy" decoding="async"><span>VYUHAM / ALL 3 DAYS</span></div>
    <div class="event-content"><div class="event-top"><span class="tag stream-pill">FESTIVAL PASS</span><span class="tag day">30 OCT — 01 NOV</span></div>
    <h3><a href="#/event/day-pass">Vyuham Day-Pass</a></h3><p class="event-title-subtitle">VYUHAM’26 Day Pass</p><p><a class="day-pass-description-link" href="#/event/day-pass">Choose Day 1, Day 2, Day 3, or a combination when getting your pass.</a></p>
    <div class="event-meta">${DAY_PASS_METADATA.passLimit ? `<span>PASS LIMIT<strong>${esc(DAY_PASS_METADATA.passLimit)}</strong></span>` : ''}${DAY_PASS_METADATA.fee ? `<span>FEE<strong>${esc(DAY_PASS_METADATA.fee)}</strong></span>` : ''}</div>
    <div class="event-actions"><a class="button button-outline" href="#/event/day-pass">DETAILS</a><a class="button button-primary" href="${DAY_PASS_URL}" target="_blank" rel="noopener noreferrer">GET DAY PASS ↗</a></div></div>
  </article>`;
  const pageHero = (kicker, title, desc, heroClass = '') => { const showCornerLogo = ['events-page-hero', 'participation-page-hero', 'competitions-page-hero', 'streams-page-hero'].includes(heroClass); return `<section class="page-hero ${heroClass}"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / ${esc(kicker.toUpperCase())}</div><div class="eyebrow">${esc(kicker)}</div><h1>${title}</h1><p>${desc}</p></div>${showCornerLogo ? '<img class="page-hero-corner-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72">' : ''}</section>` };
  const dayPassDetail = () => `<section class="section day-pass-page"><div class="container"><a class="back-link" href="#/events">← BACK TO EVENT ARCHIVE</a><div class="event-detail"><div class="day-pass-main"><a class="day-pass-poster" href="${DAY_PASS_URL}" target="_blank" rel="noopener noreferrer" aria-label="Open VYUHAM’26 Day Pass on MakeMyPass"><img src="${esc(DAY_PASS_METADATA.poster)}" alt="VYUHAM’26 Day Pass poster for 30 October to 1 November 2026" loading="lazy" decoding="async"></a><div class="eyebrow">30 OCTOBER – 1 NOVEMBER 2026</div><h1>Vyuham Day-Pass</h1><p class="event-title-subtitle">VYUHAM’26 Day Pass</p><h2 class="day-pass-choice-heading">Choose your festival days</h2><p class="muted day-pass-intro">Select Day 1 only, Day 2 only, Day 3 only, or an applicable combination when completing your pass on MakeMyPass.</p><div class="pass-day-options" aria-label="Festival days"><article><span>DAY 01</span><h3>30 October</h3><p>Friday</p></article><article><span>DAY 02</span><h3>31 October</h3><p>Saturday</p></article><article><span>DAY 03</span><h3>1 November</h3><p>Sunday</p></article></div><p class="muted day-pass-note">Day selection and pass details are completed on the official MakeMyPass page.</p></div><aside class="detail-panel day-pass-panel"><div class="eyebrow">PASS DETAILS</div><dl><div><dt>FESTIVAL</dt><dd>VYUHAM’26</dd></div><div><dt>VALID DATES</dt><dd>30 Oct – 1 Nov 2026</dd></div>${DAY_PASS_METADATA.passLimit ? `<div><dt>PASS LIMIT</dt><dd>${esc(DAY_PASS_METADATA.passLimit)}</dd></div>` : ''}${DAY_PASS_METADATA.fee ? `<div><dt>FEE</dt><dd>${esc(DAY_PASS_METADATA.fee)}</dd></div>` : ''}<div><dt>DAY SELECTION</dt><dd>Single day or combination</dd></div></dl><a class="button button-primary event-register-cta" href="${DAY_PASS_URL}" target="_blank" rel="noopener noreferrer">REGISTER &amp; PAY ON MAKEMYPASS ↗</a><p class="muted day-pass-purchase-note">Continue to MakeMyPass to choose your attendance day(s) and complete your pass.</p></aside></div></div></section>`;
  const playLandingIntro = () => {
    if (landingIntroSeen) return false;
    landingIntroSeen = true;
    return !matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const concertRegisterCta = (className = 'button button-primary') => {
    const destination = safeExternalUrl(CONCERT_PROMOTION.registrationUrl);
    return destination
      ? `<a class="${className}" href="${esc(destination)}" target="_blank" rel="noopener noreferrer">REGISTER NOW <span aria-hidden="true">↗</span></a>`
      : `<button class="${className}" type="button" disabled aria-disabled="true" title="Official concert registration URL has not been configured">REGISTER NOW</button>`;
  };
  const concertPopup = () => `<div class="concert-popup-overlay" id="concertPopup" hidden><section class="concert-popup-dialog" role="dialog" aria-modal="true" aria-labelledby="concertPopupTitle" aria-describedby="concertPopupDescription"><button class="concert-popup-close" type="button" aria-label="Close concert announcement">×</button><a class="concert-popup-art" href="#/event/${encodeURIComponent(CONCERT_PROMOTION.slug)}" aria-label="View ${esc(CONCERT_PROMOTION.title)} concert details"><img src="${esc(CONCERT_PROMOTION.poster)}" alt="${esc(CONCERT_PROMOTION.title)} poster with event date, time and registration QR code"></a><div class="concert-popup-details"><span class="eyebrow">VYUHAM’26 PRESENTS / DAY 03</span><h2 id="concertPopupTitle"><a href="#/event/${encodeURIComponent(CONCERT_PROMOTION.slug)}">${esc(CONCERT_PROMOTION.title)}</a></h2><p id="concertPopupDescription">A live concert at Digital University Kerala.</p><dl><div><dt>DATE</dt><dd>${esc(CONCERT_PROMOTION.date)}</dd></div><div><dt>TIME</dt><dd>${esc(CONCERT_PROMOTION.time)}</dd></div><div><dt>VENUE</dt><dd>${esc(CONCERT_PROMOTION.venue)}</dd></div><div><dt>ENTRY</dt><dd>${esc(CONCERT_PROMOTION.audience)}</dd></div></dl>${concertRegisterCta('button button-primary concert-popup-cta')}</div></section></div>`;
  const initConcertPopup = () => {
    const root = $('#concertPopupRoot');
    if (!root) return () => {};
    root.innerHTML = concertPopup();
    const overlay = $('#concertPopup', root);
    const dialog = $('.concert-popup-dialog', root);
    const closeButton = $('.concert-popup-close', root);
    const siteHeader = $('#siteHeader');
    let timer = 0, readyHandler = null, previousFocus = null, wasAppInert = false, wasHeaderInert = false, wasFooterInert = false;
    let wasHeaderHidden = false;
    let open = false;
    // Show once per page load: a hard refresh should replay the intro and popup,
    // while SPA navigation during this load should not reopen a dismissed popup.
    if (concertPopupShownThisSession) return () => { root.innerHTML = '' };
    const finish = restoreFocus => {
      if (!open) return;
      open = false;
      overlay.hidden = true;
      document.documentElement.classList.remove('concert-popup-open');
      document.body.classList.remove('concert-popup-open');
      app.inert = wasAppInert;
      siteHeader.inert = wasHeaderInert;
      siteHeader.hidden = wasHeaderHidden;
      $('#siteFooter').inert = wasFooterInert;
      overlay.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onDialogKeydown);
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
    const onOverlayClick = event => { if (event.target === overlay) finish(true) };
    const onDialogKeydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); finish(true); return }
      if (event.key !== 'Tab') return;
      const controls = $$('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])', dialog).filter(element => !element.hidden);
      if (!controls.length) { event.preventDefault(); closeButton.focus(); return }
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    };
    const show = () => {
      if (open || overlay.hidden === false) return;
      concertPopupShownThisSession = true;
      previousFocus = document.activeElement;
      wasAppInert = app.inert; wasHeaderInert = siteHeader.inert; wasFooterInert = $('#siteFooter').inert; wasHeaderHidden = siteHeader.hidden;
      app.inert = true; siteHeader.inert = true; siteHeader.hidden = true; $('#siteFooter').inert = true;
      overlay.hidden = false; open = true;
      document.documentElement.classList.add('concert-popup-open');
      document.body.classList.add('concert-popup-open');
      overlay.addEventListener('click', onOverlayClick);
      document.addEventListener('keydown', onDialogKeydown);
      closeButton.focus({ preventScroll: true });
    };
    const onCloseClick = () => finish(true);
    closeButton.addEventListener('click', onCloseClick);
    const landingIntro = $('#landingIntro');
    const homeHero = $('#home');
    if (landingIntro && homeHero) {
      readyHandler = () => { readyHandler = null; show() };
      homeHero.addEventListener('hero:ready', readyHandler, { once: true });
    } else {
      timer = window.setTimeout(show, 4500);
    }
    return () => {
      clearTimeout(timer);
      if (readyHandler) $('#home')?.removeEventListener('hero:ready', readyHandler);
      finish(false);
      closeButton.removeEventListener('click', onCloseClick);
      root.innerHTML = '';
    };
  };
  const featuredHomeSection = () => {
    const topEvents = homepageFeaturedEvents;
    const cards = topEvents.map((e, i) => '<a class="home-event home-event-' + (i + 1) + ' reveal" href="#/event/' + encodeURIComponent(e.slug) + '">' + (safeEventImage(e.image) ? '<img class="home-event-poster" src="' + esc(safeEventImage(e.image)) + '" alt="" loading="eager" decoding="async">' : '') + '<span>' + esc(streamLabel(e.stream)) + ' / ' + esc(eventDateLabel(e)) + '</span><strong>' + esc(titleCase(officialEventTitle(e))) + '</strong>' + (e.officialTitle ? '<em class="home-event-subtitle">' + esc(e.title) + '</em>' : '') + '<small>VIEW EVENT ↗</small></a>').join('');
    return '<section class="section featured-home"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">03 / PRIZE POOL LEADERS</div><h2>FEATURED<br><span class="green">EVENTS.</span></h2></div><a class="text-link" href="#/events">ALL ' + events.filter(e => e.status !== 'cancelled').length + ' EVENTS ↗</a></div><div class="featured-showcase"><article class="concert-featured-panel"><a class="concert-featured-poster" href="#/event/' + encodeURIComponent(CONCERT_PROMOTION.slug) + '" aria-label="View ' + esc(CONCERT_PROMOTION.title) + ' details"><img src="' + esc(CONCERT_PROMOTION.poster) + '" alt="' + esc(CONCERT_PROMOTION.title) + ' poster, 1 November 2026 at 7:00 PM at Digital University Kerala" fetchpriority="high"></a><div class="concert-featured-details"><span class="eyebrow">DAY 03 / LIVE CONCERT</span><h3>' + esc(CONCERT_PROMOTION.title) + '</h3><p>' + esc(CONCERT_PROMOTION.date) + ' · ' + esc(CONCERT_PROMOTION.time) + '</p><small>' + esc(CONCERT_PROMOTION.venue) + '</small>' + concertRegisterCta('button button-primary') + '</div></article><div class="home-event-grid">' + cards + '</div></div></div></section>';
  };
  const home = () => {
    const showIntro = playLandingIntro();
    const featuredEvents = homepageFeaturedEvents;
    const featuredEvent = featuredEvents[0];
    return `
    ${showIntro ? `<div class="intro-cinema" id="landingIntro" tabindex="-1" role="dialog" aria-modal="true" aria-label="VYUHAM 2026 introduction"><button class="intro-skip" id="skipIntro" type="button">SKIP INTRO <span aria-hidden="true">↗</span></button><div class="intro-scene intro-scene-campus"><img src="assets/venue-campus-enhanced.jpg" alt=""><span>TECHNOCITY CAMPUS / TECHNOPARK PHASE 4</span></div><div class="intro-scene intro-scene-festival"><img src="assets/afterdark-monolith.png" alt=""><span>THREE DAYS / ONE CONVERGENCE</span></div><div class="intro-cinema-vignette"></div><div class="intro-cinema-grid"></div><div class="intro-cinema-orbit intro-cinema-orbit-a"></div><div class="intro-cinema-orbit intro-cinema-orbit-b"></div><div class="intro-cinema-core"><span class="intro-cinema-kicker"><img src="assets/duk-logo-intro.png" alt="Digital University Kerala"><b>Presents</b></span><img src="assets/vyuham_logo_optimized.png" alt=""><h1><span>VYUHAM</span><b>’26</b></h1><p>TECHNOLOGY. CULTURE. COMPETITION.</p></div><span class="intro-cinema-coordinate intro-cinema-left">30 OCT — 01 NOV / 2026</span><span class="intro-cinema-coordinate intro-cinema-right">THIRUVANANTHAPURAM / INDIA</span><div class="intro-cinema-flash"></div></div>` : ''}
    <section class="cyber-hero${showIntro ? ' intro-handoff' : ''}" id="home"><div class="cyber-hero-grid"><div class="cyber-copy"><div class="cyber-kicker"><span class="live-dot"></span> DIGITAL UNIVERSITY KERALA <i>·</i> 2026</div><div class="cyber-wordmark"><img src="assets/vyuham_logo_optimized.png" alt="VYUHAM red emblem"><h1>VYUHAM<span>’26</span></h1></div><p class="cyber-slogan">THE FUTURE<br><em>AWAITS.</em></p><p class="cyber-intro">VYUHAM’26 is Digital University Kerala’s flagship national-level management, technology and cultural fest.</p><div class="cyber-actions">${registrationCta(MAKEMYPASS_HOME, 'REGISTER & GET TICKETS <span aria-hidden="true">↗</span>', 'button button-primary hero-cta hero-cta-register')}<a class="button button-outline hero-cta hero-cta-map" href="https://duk360.duk.ac.in/duk-tour/?scene=technopark-phase-4" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>CAMPUS MAP <span aria-hidden="true">↗</span></a><a class="button button-outline hero-cta hero-cta-explore" href="#/events">EXPLORE ALL EVENTS <span aria-hidden="true">↓</span></a></div><div class="cyber-data"><span>30 OCT — 01 NOV, 2026</span><span>TECHNOCITY CAMPUS, TECHNOPARK PHASE 4</span></div><div class="hero-count cyber-count" aria-label="Countdown to festival opening"><small>COUNTDOWN TO OPENING</small><strong data-countdown>—</strong></div></div><div class="cyber-stage concert-stage" id="featuredCarousel" role="region" aria-label="Featured event carousel"><figure class="stage-screen stage-main"><img class="stage-featured-art" id="featuredArtwork" src="assets/vyuham-hero-convergence.png" alt="VYUHAM’26 cinematic hero artwork" fetchpriority="high"><div class="stage-shade"></div><div class="stage-brand"><img src="assets/vyuham_logo_optimized.png" alt=""><span>VYUHAM<sup>’26</sup></span></div><figcaption><span>VYUHAM / 01</span><span>THIRUVANANTHAPURAM, INDIA</span></figcaption></figure><div class="stage-screen stage-float" id="featuredCard" role="group" aria-roledescription="slide" aria-label="Featured event 1 of ${featuredEvents.length}"><img class="stage-float-poster" id="featuredPoster" alt="" hidden><a class="stage-float-hitarea" id="featuredLink" href="#/event/${encodeURIComponent(featuredEvent?.slug || 'events')}" aria-label="Open details for ${esc(featuredEvent ? officialEventTitle(featuredEvent) : 'VYUHAM’26')}"></a><span class="stage-float-label">FEATURED TRANSMISSION</span><span class="stage-float-category" id="featuredCategory">${esc(streamLabel(featuredEvent?.stream || 'tech'))}</span><b class="stage-float-title" id="featuredTitle">${esc(featuredEvent ? officialEventTitle(featuredEvent) : 'VYUHAM’26')}</b><small class="stage-float-subtitle" id="featuredSubtitle" ${featuredEvent?.officialTitle ? '' : 'hidden'}>${esc(featuredEvent?.officialTitle ? featuredEvent.title : '')}</small><div class="stage-float-footer"><span class="stage-float-foot">OPEN EVENT DOSSIER ↗</span><div class="stage-dots" id="featuredDots" role="group" aria-label="Choose a featured event">${featuredEvents.map((event, index) => `<button class="stage-dot ${index === 0 ? 'active' : ''}" type="button" data-featured-index="${index}" aria-label="Show ${esc(officialEventTitle(event))}" aria-pressed="${index === 0}"></button>`).join('')}</div></div></div><span class="stage-orbit stage-orbit-one"></span><span class="stage-orbit stage-orbit-two"></span></div></div><div class="cyber-hero-foot"><span>THE NATIONAL TECHNO-CULTURAL FESTIVAL</span><a href="#festival">SCROLL TO EXPLORE ↓</a></div></section>
    <div class="info-strip cyber-strip stats-bar"><span class="stats-item"><b>30 October 2026 - 01 November 2026</b><small>THREE FESTIVAL DAYS</small></span><span class="stats-item"><b>TECHNOCITY CAMPUS</b><small>TECHNOPARK PHASE 4</small></span><span class="stats-item"><b>${events.length}</b><small>EVENT RECORDS</small></span><span class="stats-item"><b>01 / 03</b><small>DAY 1 → DAY 3</small></span></div>
    <section class="section festival-intro" id="festival"><div class="container intro-composition"><div class="intro-mark reveal"><span>VYUHAM / DUK</span><img src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem"><b>ONE<br>FESTIVAL<br><i>FOUR WORLDS.</i></b></div><div class="intro-copy reveal"><div class="eyebrow">01 / ABOUT THE FESTIVAL</div><h2>WHERE<br>DISCIPLINES<br><span class="green">COLLIDE.</span></h2><p>VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest. Across three days, students gather to build, debate, perform and compete.</p><p>From autonomous systems and strategy arenas to live culture and esports, one campus becomes a meeting point for different ways of thinking.</p><a class="text-link" href="#/about">DISCOVER VYUHAM <span>↗</span></a></div></div></section>
    <section class="section stream-section" id="streams"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">02 / FOUR SIGNALS</div><h2>FIND YOUR<br><span class="green">FREQUENCY.</span></h2></div><p>Four distinct streams. One shared festival ground.</p></div><div class="stream-grid">${streams.map((s, i) => `<a class="stream-card stream-card-${i + 1} reveal" data-index="${s.index}" href="#/events?stream=${s.id}"><img class="stream-art" src="${s.image}" alt="" loading="lazy" decoding="async"><img class="stream-emblem" src="assets/vyuham_logo_sm.png" alt="" aria-hidden="true" loading="lazy"><span class="stream-icon">${s.symbol} / STREAM</span><strong>${s.name}</strong><p>${s.desc}</p><span class="stream-go">EXPLORE ↗</span><i class="stream-watermark">${s.index}</i></a>`).join('')}</div></div></section>
    ${featuredHomeSection()}
    <section class="section schedule-section"><div class="container"><div class="section-head reveal"><div><div class="eyebrow">04 / THREE DAYS</div><h2>THE FESTIVAL<br><span class="green">SEQUENCE.</span></h2></div><a class="text-link" href="#/schedule">OPEN FULL SCHEDULE ↗</a></div><div class="schedule-preview">${days.map(d => `<article class="day-card day-card-${d.day} reveal"><div class="day-card-meta"><span class="day-date">${d.dateLabel}</span></div><a class="day-card-link" href="#/schedule?day=${d.day}"><h3>${d.name}</h3><p>${d.desc}</p></a><footer class="day-card-actions"><a class="day-explore" href="#/schedule?day=${d.day}">VIEW DAY ↗</a><a class="day-pass-link" href="#/event/day-pass">DAY PASS ↗</a></footer><i class="day-ghost" aria-hidden="true">0${d.day}</i></article>`).join('')}</div></div></section>
    <section class="section" id="venue"><div class="container venue-home"><div><div class="eyebrow">05 / THE VENUE</div><h2>MEET US AT<br><span class="green">TECHNOCITY.</span></h2><h3>Digital University Kerala</h3><p class="muted">Technocity Campus, Mangalapuram,<br>Thiruvananthapuram, Kerala — 695317.</p><a class="text-link" target="_blank" rel="noopener" href="https://maps.google.com/?q=Digital+University+Kerala+Technocity">GET DIRECTIONS ↗</a></div><a class="venue-map" aria-label="Open map directions to Digital University Kerala" target="_blank" rel="noopener" href="https://maps.google.com/?q=Digital+University+Kerala+Technocity"><img src="assets/venue-campus-enhanced.jpg" alt="Aerial view of Digital University Kerala campus among the green Technocity landscape" loading="lazy" width="1360" height="1024"></a></div></section>
    ${sponsorsSection('home')}
    <section class="section"><div class="container"><div class="cta-band reveal"><div><div class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div><h2>ENTER THE<br><span class="green">CONVERGENCE.</span></h2><p>Find an event. Build a team. Make your mark at VYUHAM’26.</p></div><a class="button button-primary" href="#/events">FIND YOUR EVENT <span>↗</span></a></div></div></section>`;
  };
  const streamsPage = () => `${pageHero('Festival streams', 'FOUR FRONTS.<br><span class="green">ONE FUTURE.</span>', 'Find your place in the VYUHAM’26 programme. Each stream links to its events and experiences.', 'streams-page-hero')}
    <section class="section"><div class="container stream-page-grid">${streams.map((s, i) => { const count = events.filter(e => e.stream === s.id).length; return `<article class="stream-feature stream-feature-${i + 1} reveal" data-index="${s.index}"><span class="stream-feature-index">${s.index} / VYUHAM’26</span><div><h2>${esc(s.name)}</h2><p>${esc(s.desc)}</p><a class="text-link" href="#/events?stream=${encodeURIComponent(s.id)}">${String(count).padStart(2, '0')} EVENTS · EXPLORE STREAM ↗</a></div></article>` }).join('')}</div></section>`;
  const eventsPage = (query = '') => {
    const params = new URLSearchParams(query), selected = params.get('stream') || 'all';
    return `${pageHero('Event archive', 'FIND YOUR<br><span class="green">ARENA.</span>', 'Explore competitions, challenges and experiences across VYUHAM’26. Filter by stream or search for an event.', 'events-page-hero')}
      <section class="section"><div class="container"><div class="registration-info-bar"><details class="registration-info"><summary aria-label="Registration information"><span aria-hidden="true">i</span></summary><p>Registration and ticket payments are completed on MakeMyPass. Select an event to view its official registration page.</p></details></div><div class="filter-bar"><label class="search-box"><input id="eventSearch" type="search" placeholder="Search events, keywords…" aria-label="Search events"></label><label class="event-filter"><span>DAY</span><select id="eventDay"><option value="all">All events</option><option value="1">Day 1 · Oct 30</option><option value="2">Day 2 · Oct 31</option><option value="3">Day 3 · Nov 1</option></select></label><label class="event-filter"><span>SORT</span><select id="eventSort"><option value="day">Festival order</option><option value="name">Name A–Z</option><option value="fee">Fee · low to high</option></select></label></div><div class="filter-pills" id="streamFilters">${[['all', 'ALL EVENTS'], ['tech', 'TECHNOLOGY'], ['management', 'MANAGEMENT'], ['cultural', 'CULTURE'], ['esports', 'ESPORTS']].map(([id, label]) => `<button class="filter-pill ${selected === id ? 'active' : ''}" data-stream="${id}">${label}</button>`).join('')}</div><p class="muted mono" style="font-size:10px;margin:22px 0" id="eventCount"></p><div class="events-grid" id="eventsGrid"></div><p style="text-align:center;margin-top:34px">${registrationCta(MAKEMYPASS_HOME, 'VIEW ALL EVENTS ON MAKEMYPASS ↗', 'button button-outline')}</p></div></section>`;
  };
  const concertDetailPage = event => `<section class="page-hero event-page-hero concert-event-page-hero"><img class="event-hero-image" src="assets/eventpics/thamarassery-churam-punnyapradeep.png" alt="Thamarassery Churam featuring Punnya Pradeep concert banner"><div class="event-hero-shade"></div><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / <a href="#/events">EVENT ARCHIVE</a> / LIVE CONCERT</div><span class="stream-pill">CULTURALS</span><h1>THAMARASSERY CHURAM</h1><p class="concert-hero-subtitle">Ft. Punnya Pradeep · Live Concert</p><p>1 November 2026 · 7:00 PM · Digital University Kerala (DUK)</p></div></section><section class="section concert-event-details-section"><div class="container"><a class="back-link" href="#/events">← BACK TO EVENT ARCHIVE</a><div class="concert-event-details"><a class="concert-detail-poster" href="${esc(CONCERT_PROMOTION.registrationUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Register for ${esc(CONCERT_PROMOTION.title)} on MakeMyPass"><img src="${esc(CONCERT_PROMOTION.poster)}" alt="${esc(CONCERT_PROMOTION.title)} poster showing Punnya Pradeep and band, 1 November 2026" loading="lazy"></a><div class="concert-detail-copy"><div class="eyebrow">VYUHAM’26 / LIVE CONCERT</div><h2>${esc(CONCERT_PROMOTION.title)}</h2><p>${esc(event.description)}</p><dl><div><dt>DATE</dt><dd>${esc(CONCERT_PROMOTION.date)}</dd></div><div><dt>TIME</dt><dd>${esc(CONCERT_PROMOTION.time)}</dd></div><div><dt>VENUE</dt><dd>${esc(CONCERT_PROMOTION.venue)}</dd></div><div><dt>ENTRY</dt><dd>${esc(CONCERT_PROMOTION.audience)}</dd></div></dl><div class="concert-detail-actions"><a class="button button-primary" href="${esc(CONCERT_PROMOTION.registrationUrl)}" target="_blank" rel="noopener noreferrer">REGISTER NOW <span aria-hidden="true">↗</span></a><a class="button button-outline" href="#/schedule?day=3">VIEW DAY 03 SCHEDULE</a></div></div></div></div></section>`;
  const eventDetail = slug => {
    if (decodeURIComponent(slug) === 'day-pass') return dayPassDetail();
    // FIT ARENA is intentionally omitted from public listings, but its direct
    // detail URL remains valid for people who already have the link.
    const e = events.find(x => x.slug === decodeURIComponent(slug) && isVisibleEvent(x))
      || (decodeURIComponent(slug) === 'fit-arena-fitness-competition'
        ? allEventRecords.find(x => x.slug === decodeURIComponent(slug))
        : null);
    if (!e) return notFound();
    if (e.slug === CONCERT_PROMOTION.slug) return concertDetailPage(e);
    const isSocTalk = (e.legacySlug || e.slug) === 'panel-cybersecurity';
    const isAccuracyPanel = (e.legacySlug || e.slug) === 'panel-responsible-ai';
    const isPromptWar = (e.legacySlug || e.slug) === 'prompt-war';
    const isCalligraphyWorkshop = (e.legacySlug || e.slug) === 'workshop-prompt-engineering';
    const isAiFilm = (e.legacySlug || e.slug) === 'ai-short-film';
    const isKsumTalk = (e.legacySlug || e.slug) === 'talk-ksum';
    const isVegaWorkshop = e.slug === 'vega-processors-and-ecosystem-by-c-dac';
    const speakerContent = !isSocTalk && !isAccuracyPanel && e.speaker && e.speakerPhoto
      ? `<section class="soc-content-block"><div class="eyebrow">SESSION SPEAKER</div><article class="soc-speaker-profile ksum-speaker-profile${isVegaWorkshop ? ' vega-speaker-profile' : ''}"><img src="${esc(e.speakerPhoto)}" alt="${esc(e.speaker)}, ${esc(e.designation || 'session speaker')}" loading="lazy"><div class="soc-speaker-copy"><h3>${esc(e.speaker)}</h3><p class="soc-designation">${esc(e.designation || '')}</p>${e.speakerContact ? `<p class="soc-speaker-contact">CONTACT <a href="tel:${esc(e.speakerContact)}">${esc(e.speakerContact)}</a></p>` : ''}${isKsumTalk ? `<div class="ksum-speaker-details"><h4>Professional Biography</h4>${e.professionalBiography.map(paragraph => `<p class="muted">${esc(paragraph)}</p>`).join('')}<h4>Areas of Expertise</h4><ul class="soc-guidelines">${e.areasOfExpertise.map(area => `<li>${esc(area)}</li>`).join('')}</ul></div>` : ''}</div></article></section>`
      : '';
    const image = safeEventImage(e.image) || streams.find(stream => stream.id === e.stream)?.image || streams.find(stream => stream.id === ({ technology: 'tech', culture: 'cultural', gaming: 'esports' }[e.stream]))?.image || 'assets/streams/technology.jpg';
    const participationRules = e.rules || [];
    const participationNotes = isSocTalk
      ? `<p class="muted soc-format-note">${esc(e.format)} · ${esc(e.duration)}</p>`
      : isPromptWar
      ? ''
      : isCalligraphyWorkshop
      ? ''
      : (e.legacySlug || e.slug) === 'hackathon' && e.themes?.length
      ? `<ul class="rule-list">${participationRules.map(rule => `<li>${esc(rule)}</li>`).join('')}<li><strong>Hackathon themes:</strong><ul class="hackathon-theme-list">${e.themes.map(theme => `<li>${esc(theme)}</li>`).join('')}</ul></li></ul>`
      : participationRules.length ? '<ul class="rule-list">' + participationRules.map(rule => '<li>' + esc(rule) + '</li>').join('') + '</ul>' : '<p class="muted">Detailed rules will be published by the event organizers.</p>';
    const socContent = isSocTalk
      ? `<section class="soc-content-block"><div class="eyebrow">ABOUT THE EVENT</div><p class="muted">${esc(e.description)}</p></section>
        <section class="soc-content-block"><div class="eyebrow">SPEAKER</div><article class="soc-speaker-profile"><img src="${esc(e.speakerPhoto)}" alt="Mr. Vishnu Ramachandran, Security Specialist at H&amp;R Block" loading="lazy"><div class="soc-speaker-copy"><h3>${esc(e.speaker)}</h3><p class="soc-designation">${esc(e.designation)}</p><strong class="soc-experience">${esc(e.speakerExperience)}</strong><p class="muted">${esc(e.speakerBio)}</p></div></article></section>
        <section class="soc-content-block"><div class="eyebrow">SESSION SCHEDULE</div><div class="soc-session-list">${e.sessionSchedule.map(item => `<div><time>${esc(item.time)}</time><span>${esc(item.title)}</span></div>`).join('')}</div></section>
        <section class="soc-content-block"><div class="eyebrow">PARTICIPANT GUIDELINES</div><ol class="soc-guidelines">${e.participantGuidelines.map(item => `<li>${esc(item)}</li>`).join('')}</ol></section>
        <p class="soc-closing-line">${esc(e.closingLine)}</p>`
      : isAccuracyPanel
      ? `<section class="soc-content-block"><div class="eyebrow">ABOUT THE EVENT</div><p class="muted">${esc(e.description)}</p></section>
        <section class="soc-content-block"><div class="eyebrow">PANEL SPEAKERS</div><div class="panel-speaker-grid">${e.panelSpeakers.map(speaker => `<article class="soc-speaker-profile panel-speaker-profile"><img src="${esc(speaker.photo)}" alt="${esc(speaker.name)}, ${esc(speaker.designation)}" loading="lazy"><div class="soc-speaker-copy"><h3>${esc(speaker.name)}</h3><p class="soc-designation">${esc(speaker.designation)}</p></div></article>`).join('')}</div></section>`
      : isPromptWar
      ? `<section class="soc-content-block"><div class="eyebrow">RULES</div><ul class="rule-list">${participationRules.map(rule => `<li>${esc(rule)}</li>`).join('')}</ul></section>
        <section class="soc-content-block"><div class="eyebrow">ELIGIBILITY</div><p class="muted">${esc(e.eligibility)}</p></section>`
      : isCalligraphyWorkshop
      ? `<section class="soc-content-block"><div class="eyebrow">ABOUT THE EVENT</div><p class="muted">${esc(e.description)}</p>${e.descriptionParagraphs.map(paragraph => `<p class="muted">${esc(paragraph)}</p>`).join('')}</section>`
      : `<button class="info-toggle" type="button" aria-expanded="false" aria-controls="eventDescription"><span aria-hidden="true">i</span> ABOUT THIS EVENT</button><div class="event-description" id="eventDescription" hidden><p class="muted" style="line-height:1.9">${esc(e.description)}</p></div>`;
    const aiFilmGuidelines = isAiFilm
      ? `<section class="ai-film-guidelines"><h2>Participation Guidelines</h2><p class="muted ai-film-guidelines-intro">Review the competition requirements, AI-use rules, ethical standards, and submission checklist before preparing your film.</p><div class="ai-film-guideline-grid">${e.competitionGuidelines.map((section, index) => `<article class="ai-film-guideline"><div class="ai-film-guideline-title"><span>${String(index + 1).padStart(2, '0')}</span><h3>${esc(section.heading)}</h3></div>${section.intro ? `<p class="muted">${esc(section.intro)}</p>` : ''}<ul>${section.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div></section>`
      : '';
    const hero = `<section class="page-hero event-page-hero"><img class="event-hero-image" src="${esc(image)}" alt="${esc(officialEventTitle(e))} event poster"><div class="event-hero-shade"></div><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / EVENT DOSSIER</div><span class="stream-pill">${esc(streamLabel(e.stream))}</span><h1>${esc(officialEventTitle(e))}</h1>${e.officialTitle ? `<p class="event-title-subtitle">${esc(e.title)}</p>` : ''}<p>Event details, schedule information and participation overview for VYUHAM’26.</p></div></section>`;
    return `${hero}
      <section class="section event-details-section"><div class="container"><a class="back-link" href="#/events">← BACK TO EVENT ARCHIVE</a><div class="event-detail"><div>${isAiFilm ? aiFilmGuidelines : `<h3 class="event-participation-heading">Participation notes</h3>${participationNotes}${isKsumTalk ? `${speakerContent}${socContent}` : `${socContent}${speakerContent}`}`}</div><aside class="detail-panel"><div class="detail-panel-heading"><div class="eyebrow">EVENT INTEL</div></div><dl>${renderEventIntelRows(e)}</dl><div class="detail-panel-footer">${registrationCta(registrationUrl(e), 'REGISTER & PAY ON MAKEMYPASS ↗', 'button button-primary event-register-cta', e)}<details class="detail-info detail-info-bottom"><summary aria-label="MakeMyPass registration information">ⓘ</summary><p>MakeMyPass is the official registration and payment provider. Review final event details and complete your registration on the event’s MakeMyPass page.</p></details></div></aside></div></div></section>`;
  };
  const schedulePage = () => `<section class="page-hero schedule-page-hero"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / FESTIVAL TIMELINE</div><div class="eyebrow">Festival timeline</div><h1>THREE DAYS.<br><span class="green">NO PAUSE.</span></h1><p>Plan your VYUHAM’26 experience. Event-specific timings and venues should be confirmed with the official schedule.</p></div><img class="schedule-hero-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72"></section>
    <section class="section"><div class="container"><div class="schedule-days" id="scheduleDays">${days.map(d => `<button class="schedule-day schedule-day-${d.day}" type="button" aria-pressed="${d.day === 1}" data-day="${d.day}"><b>${d.dateLabel}</b><span>${d.name}</span><small>${d.desc}</small><em>VIEW DAY <strong>↘</strong></em></button>`).join('')}</div><div id="scheduleContent"></div></div></section>`;
  const aboutPage = () => `${pageHero('About the festival', 'WHERE DISCIPLINES<br><span class="green">CONVERGE.</span>', 'A national-level techno-cultural gathering hosted by Digital University Kerala.')}
    <section class="section"><div class="container about-grid"><div class="about-visual"><div class="visual-cross"></div><div class="visual-core"><img src="assets/vyuham_logo_sm.png" alt="VYUHAM logo"></div></div><div class="about-copy"><div class="eyebrow">THE VYUHAM IDEA</div><h2>BUILT FOR<br><span class="green">WHAT’S NEXT.</span></h2><p>VYUHAM brings technology, management, culture and esports into one shared arena. It is designed for curious minds, ambitious teams, performers and problem-solvers from across India.</p><p>Across three days, participants can compete, collaborate, learn from one another and experience a festival shaped by innovation and expression.</p><div class="about-points"><div class="about-point"><i>01</i><span>Technology — create, test and build.</span></div><div class="about-point"><i>02</i><span>Management — lead, plan and adapt.</span></div><div class="about-point"><i>03</i><span>Culture — perform, express and connect.</span></div><div class="about-point"><i>04</i><span>Esports — compete with focus and teamwork.</span></div></div></div></div></section><section class="section"><div class="container"><div class="cta-band"><div><div class="eyebrow">OCTOBER 30 – NOVEMBER 1, 2026</div><h2>SEE YOU IN<br><span class="green">THE ARENA.</span></h2></div><a class="button button-primary" href="#/events">EXPLORE EVENTS ↗</a></div></div></section>`;
  const venuePage = () => `<section class="page-hero venue-page-hero"><div class="container"><div class="breadcrumb"><a href="#/home">VYUHAM’26</a> / ABOUT</div><div class="eyebrow">About</div><h1 class="venue-about-typewriter" aria-label="VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest."><span aria-hidden="true" data-typewriter="VYUHAM is Digital University Kerala’s flagship national-level management, technology and cultural fest."></span></h1></div><img class="venue-hero-logo" src="assets/vyuham_logo_sm.png" alt="VYUHAM emblem" width="72" height="72"></section>
    <section class="section venue-location-section"><div class="container"><div class="section-head"><div><div class="eyebrow">VYUHAM / THE VENUE</div><h2>LOCATION</h2></div><p class="venue-location-description">VYUHAM’26 takes place at Digital University Kerala, Technocity Campus, Thiruvananthapuram.</p></div><div class="info-grid"><article class="info-card venue-info-card venue-campus-card"><span class="num">01 / CAMPUS</span><span class="venue-card-mark venue-campus-mark" aria-hidden="true">DUK</span><div class="venue-duk-logo-frame"><img class="venue-duk-logo" src="assets/duk-logo.png" alt="Digital University Kerala — Curating a responsible digital world" loading="lazy"></div><h3>Digital University Kerala</h3><p>Technocity Campus, Mangalapuram, Thiruvananthapuram, Kerala – 695317.</p></article><article class="info-card venue-info-card"><span class="num">02 / ARRIVAL</span><span class="venue-card-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M9 36c7-1 8-9 14-10s7 6 13 3 2-10 5-16"/><circle cx="9" cy="36" r="3"/><circle cx="41" cy="13" r="3"/><path d="m33 13 8 0 0 8"/></svg></span><h3>Plan your visit</h3><p>Check your event’s assigned venue and arrival instructions before travelling. Detailed transport information should be confirmed through official festival communications.</p></article><article class="info-card venue-info-card"><span class="num">03 / HELP</span><span class="venue-card-mark venue-help-mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 42s14-13 14-25a14 14 0 1 0-28 0c0 12 14 25 14 25Z"/><circle cx="24" cy="17" r="5"/><path d="M34 35h8M38 31v8"/></svg></span><h3>Need directions?</h3><p>Contact the organizing team for venue access, accessibility needs and event-specific location details.</p><a class="text-link" href="mailto:techfest@duk.ac.in">CONTACT TEAM ↗</a></article></div><div style="margin-top:22px;border:1px solid var(--line);border-radius:12px;overflow:hidden"><iframe title="Digital University Kerala location" src="https://www.google.com/maps?q=Digital%20University%20Kerala%20Technocity&output=embed" width="100%" height="350" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>${sponsorsSection('about')}`;
  const hospitalityPage = () => {
    const accommodations = [
      { name: 'Technopark Guest House', type: 'GUEST HOUSE', area: 'Technopark Phase IV · Technocity', address: 'Technopark Phase IV, Technocity, Thiruvananthapuram', contacts: [{ label: '0471 2700825', tel: '+914712700825' }, { label: '0471 2700925', tel: '+914712700925' }, { label: '0471 3048105', tel: '+914713048105' }], rates: [['STANDARD ROOM', '₹2,100 / day'], ['SUITE ROOM', '₹2,625 / day'], ['DELUXE SUITE', '₹3,150 / day']], rateNote: 'Official Technopark rates; taxes extra.', map: 'https://www.google.com/maps/search/?api=1&query=Technopark+Guest+House+Thiruvananthapuram', link: 'https://technopark.in/services-directory-details', linkLabel: 'OFFICIAL TECHNOPARK LISTING ↗' },
      { name: 'Lotus PG', type: 'PAYING GUEST · GENTS', area: 'Kazhakkoottam and Attinkuzhi, Thiruvananthapuram', address: 'Kazhakkoottam and Attinkuzhi, Thiruvananthapuram', contacts: [{ label: '+91 73568 27032', tel: '+917356827032' }, { label: 'info@lotuspggroups.com', mail: true }], rateNote: 'Contact provider for current rates and availability.', link: 'https://www.lotuspggroups.com/pg/', linkLabel: 'OFFICIAL LOTUS PG LISTING ↗', map: 'https://www.google.com/maps/search/?api=1&query=Lotus+PG+Kazhakkoottam+Attinkuzhi' },
      { name: 'Kalloor Residency', type: 'RESIDENCY', area: 'Mangalapuram', address: 'JRGX+Q8J, Mangalapuram, Kerala 695317', contacts: [], rateNote: 'Contact details and rates not verified; confirm locally before booking.', map: 'https://www.google.com/maps/search/?api=1&query=Kalloor+Residency+Mangalapuram+Kerala' },
      { name: 'JL Residency', type: 'RESIDENCY', area: 'Kalloor Building · NH 66 Junction · Mangalapuram', address: 'Kalloor Building, NH 66 Junction, Mangalapuram, Kerala 695317', contacts: [{ label: '81378 62001', tel: '+918137862001' }], rateNote: 'Rates vary by room and date; check live availability.', link: 'https://www.oyorooms.com/215785/', linkLabel: 'PROPERTY LISTING ↗', map: 'https://www.google.com/maps/search/?api=1&query=JL+Residency+Mangalapuram+Kerala' },
      { name: 'Amalas Lodge', type: 'LODGE', area: 'Vetturoad · Kazhakkoottam', address: 'Amalas Tower, Vetturoad, Kazhakkoottam, Thiruvananthapuram 695585', contacts: [{ label: '98954 85116', tel: '+919895485116' }], rateNote: 'Rates vary by dates and room; contact the property or check live availability.', link: 'https://www.makemytrip.com/hotels/amalas_lodge-details-thiruvananthapuram.html', linkLabel: 'PROPERTY LISTING ↗', map: 'https://www.google.com/maps/search/?api=1&query=Amalas+Lodge+Vetturoad+Kazhakkoottam' },
      { name: 'Grace Service Apartments', type: 'SERVICE APARTMENTS', area: 'Nila Nagar Road · Technopark Campus', address: 'Nila Nagar Road, Technopark Campus, Kazhakkoottam 695582', contacts: [{ label: '70251 85000', tel: '+917025185000' }], rateNote: 'Contact provider for current rates and availability.', map: 'https://www.google.com/maps/search/?api=1&query=Grace+Service+Apartments+Nila+Nagar+Road' },
      { name: 'Capital Park Residency', type: 'RESIDENCY', area: 'Kazhakkoottam Bypass · Technopark Campus', address: 'Kazhakkoottam Bypass, Technopark Campus, Thiruvananthapuram 695582', contacts: [{ label: '92077 15154 · WhatsApp', tel: '+919207715154' }, { label: '0471 259 9990 · property', tel: '+914712599990' }], rateNote: 'Contact the property for a quote for your dates.', link: 'https://capitalparkresidency.in/', linkLabel: 'OFFICIAL PROPERTY SITE ↗', map: 'https://www.google.com/maps/search/?api=1&query=Capital+Park+Residency+Kazhakkoottam' },
      { name: 'BnB Homes', type: 'HOMESTAY', area: 'Kulathoor · near Technopark', address: 'Thripadapuram Road, Phoenix Lane, near Technopark, Kulathoor 695583', contacts: [{ label: '75400 00750', tel: '+917540000750' }], rateNote: 'Rates vary by dates and room; check the property site.', link: 'https://bnbhomes.in/', linkLabel: 'PROPERTY WEBSITE ↗', map: 'https://www.google.com/maps/search/?api=1&query=BnB+Homes+Kulathoor+Trivandrum' },
      { name: 'Super Hotel O, Technopark Phase 2', type: 'HOTEL', area: 'Nila Nagar Road · near Technopark', address: 'Nila Nagar Road, near Technopark, Kazhakkoottam 695582', contacts: [{ label: '0124 433 0599 · booking service', tel: '+911244330599' }], rateNote: 'Rates vary by dates and room; check live availability.', map: 'https://www.google.com/maps/search/?api=1&query=Hotel+O+Kazhakkoottam+Technopark+Phase+2' },
      { name: 'Blue Pearl Residency', type: 'RESIDENCY', area: 'St Joseph Church Lane · Kazhakkoottam', address: 'St Joseph Church Lane, near Kazhakkoottam Railway Station Road, Thiruvananthapuram 695582', contacts: [{ label: '79022 06775', tel: '+917902206775' }], rateNote: 'Rates vary by dates and room; check live availability.', link: 'https://www.makemytrip.com/hotels/blue_pearl_residency_near_technopark-details-thiruvananthapuram.html', linkLabel: 'PROPERTY LISTING ↗', map: 'https://www.google.com/maps/search/?api=1&query=Blue+Pearl+Residency+Kazhakkoottam' },
      { name: 'Infinity Rooms – AKR Residency', type: 'RESIDENCY', area: 'Bypass Junction · Kazhakkoottam', address: 'Bypass Junction, Kazhakkoottam, Thiruvananthapuram 695582', contacts: [{ label: '95672 12358', tel: '+919567212358' }], rateNote: 'Rates vary by dates and room; contact the property to confirm.', map: 'https://www.google.com/maps/search/?api=1&query=Infinity+Rooms+AKR+Residency+Kazhakkoottam' },
      { name: 'Olaya Residency', type: 'RESIDENCY', area: 'Technopark Campus · Ambalathinkara', address: 'Technopark Campus, Ambalathinkara, Kazhakkoottam 695582', contacts: [{ label: '88911 10445', tel: '+918891110445' }], rates: [['ONLINE RATE · 30–31 OCT 2026', '₹2,200 / night']], rateNote: 'MakeMyTrip listing for 30–31 October 2026; taxes and availability may change.', link: 'https://www.makemytrip.com/hotels/olaya_residency-details-thiruvananthapuram.html', linkLabel: 'PROPERTY LISTING ↗', map: 'https://www.google.com/maps/search/?api=1&query=Olaya+Residency+Technopark+Kazhakkoottam' }
    ];
    const cards = accommodations.map((place, index) => `<article class="hospitality-card"><div class="hospitality-card-top"><span class="num">${String(index + 1).padStart(2, '0')} / ${esc(place.type)}</span></div><h3>${esc(place.name)}</h3><p class="hospitality-location">${esc(place.area)}</p><p class="hospitality-address">${esc(place.address)}</p>${place.contacts?.length ? `<div class="hospitality-contact"><span>CONTACT</span>${place.contacts.map(contact => contact.mail ? `<a href="mailto:${esc(contact.label)}">${esc(contact.label)}</a>` : `<a href="tel:${esc(contact.tel)}">${esc(contact.label)}</a>`).join('')}</div>` : ''}<div class="hospitality-card-actions">${place.link ? `<a class="text-link" href="${esc(place.link)}" target="_blank" rel="noopener noreferrer">${esc(place.linkLabel || 'PROPERTY INFORMATION ↗')}</a>` : ''}<a class="text-link hospitality-map-link" href="${esc(place.map)}" target="_blank" rel="noopener noreferrer">OPEN GOOGLE MAPS ↗</a></div></article>`).join('');
    return `${pageHero('Hospitality near DUK', 'FIND YOUR<br><span class="green">STAY.</span>', 'Rooms, PGs and campus accommodation contacts for visitors attending VYUHAM’26.', 'hospitality-page-hero')}
      <section class="section hospitality-section"><div class="container"><div class="hospitality-intro"><div><div class="eyebrow">VISITOR INFORMATION / ACCOMMODATION</div><h2>STAY NEAR<br><span class="green">THE FESTIVAL.</span></h2></div><p>Contact providers directly to confirm availability, eligibility and booking terms.</p></div><div class="hospitality-grid">${cards}</div><p class="hospitality-note">Listings are provided for visitor convenience. VYUHAM’26 does not manage bookings or guarantee accommodation, availability, distance or service quality. Confirm all booking details directly with the property.</p></div></section>`;
  };
  const contactPage = () => `${pageHero('Contact', 'LET’S START<br><span class="green">A SIGNAL.</span>', 'Questions about events, participation or the festival? Reach out to the organizing team.')}
    <section class="section"><div class="container contact-grid"><div><div class="contact-list"><div class="contact-item"><small>EMAIL</small><p><a href="mailto:techfest@duk.ac.in" class="text-link">techfest@duk.ac.in</a></p></div><div class="contact-item"><small>PHONE</small><p>+91 471 278 8000</p></div><div class="contact-item"><small>LOCATION</small><p>Technocity Campus, Mangalapuram, Thiruvananthapuram – 695317</p></div><div class="contact-item"><small>SOCIAL</small><p><a class="text-link" href="https://instagram.com/vyuham.duk" target="_blank" rel="noopener">INSTAGRAM ↗</a></p></div></div></div><form class="form-card" id="contactForm"><div class="eyebrow">SEND A MESSAGE</div><h3 style="margin:16px 0 22px">How can we help?</h3><div class="form-grid"><div class="form-field"><label for="contactName">NAME</label><input id="contactName" name="name" autocomplete="name" required></div><div class="form-field"><label for="contactEmail">EMAIL</label><input id="contactEmail" name="email" type="email" autocomplete="email" required></div><div class="form-field full"><label for="contactTopic">TOPIC</label><select id="contactTopic" name="topic"><option>Event information</option><option>Registration support</option><option>Partnership</option><option>Accessibility</option><option>Other</option></select></div><div class="form-field full"><label for="contactMessage">MESSAGE</label><textarea id="contactMessage" name="message" required></textarea></div></div><p class="form-note">Your inquiry is saved to the festival support system for organizer follow-up.</p><button class="button button-primary" type="submit">SEND MESSAGE ↗</button></form></div></section>`;
  const FAQ_CATEGORIES = [
    { id: 'festival', label: 'Festival Information', icon: '✦' },
    { id: 'registration', label: 'Registration & Tickets', icon: '↗' },
    { id: 'events', label: 'Events & Competitions', icon: '◇' },
    { id: 'payments', label: 'Payments & Refunds', icon: '₹' },
    { id: 'schedule', label: 'Schedule & Venue', icon: '⌖' },
    { id: 'rules', label: 'Participation Rules', icon: '✓' },
    { id: 'support', label: 'Technical Support', icon: '?' }
  ];
  const FAQ_ENTRIES = [
    { category: 'festival', question: 'What is VYUHAM’26?', answer: 'VYUHAM’26 is Digital University Kerala’s national techno-cultural festival, bringing together technology, management, culture and esports.' },
    { category: 'festival', question: 'When and where is VYUHAM’26?', answer: 'The festival runs October 30–November 1, 2026 at Digital University Kerala, Technocity Campus, Mangalapuram, Thiruvananthapuram. See the <a href="#/venue">venue page</a> and <a href="#/schedule">schedule</a> for details.' },
    { category: 'festival', question: 'Who organizes VYUHAM’26, and who can attend?', answer: 'VYUHAM’26 is hosted by Digital University Kerala. Attendance and eligibility can vary by pass or event, so check the relevant listing; some events welcome participants from across India.' },
    { category: 'festival', question: 'What makes VYUHAM’26 different from other college festivals?', answer: 'VYUHAM brings technology, management, culture and esports together in one three-day programme at Digital University Kerala.' },

    { category: 'registration', question: 'How do I register, and do I need a MakeMyPass account?', answer: 'Open an event in the <a href="#/events">event archive</a> and follow its MakeMyPass link. MakeMyPass will show whether you need to sign in or create an account.' },
    { category: 'registration', question: 'Is registration free or paid?', answer: 'Fees vary by event. Check the event dossier and its MakeMyPass listing for current charges.' },
    { category: 'registration', question: 'What is the VYUHAM’26 Day Pass? Does it include event entry?', answer: 'The pass lets you choose Day 1, Day 2, Day 3, or an applicable combination on MakeMyPass. Whether it includes individual event entry is not confirmed; check the <a href="#/event/day-pass">Day Pass details</a> and event listing.' },
    { category: 'registration', question: 'Can I register for multiple events or on the festival day?', answer: 'Availability, limits and on-day registration vary by event. Check each MakeMyPass listing and the <a href="#/schedule">festival schedule</a> before planning.' },
    { category: 'registration', question: 'Can I edit my registration, and how do I get confirmation?', answer: 'Edit options and confirmations are handled by MakeMyPass. Check your account and email after registering; contact MakeMyPass support or the event organizer if you need help.' },

    { category: 'events', question: 'Where can I find events, rules and fees?', answer: 'Browse the <a href="#/events">event archive</a> and open an event dossier. Confirm final rules, fees and availability on its MakeMyPass listing.' },
    { category: 'events', question: 'How do I check an event’s prize pool?', answer: 'Prize information appears on event cards and, where available, in the event dossier. Confirm final details with the event organizer.' },
    { category: 'events', question: 'Can I enter individually or as a team, and how many members are allowed?', answer: 'Participation type, team size, workshop prerequisites and participant limits vary by event. Check its dossier and MakeMyPass listing; also review the schedule if entering multiple events.' },

    { category: 'payments', question: 'What if payment succeeds but registration is not confirmed?', answer: 'Check your MakeMyPass account and confirmation email. If the status remains unclear, contact MakeMyPass support with your transaction reference and notify the event organizer.' },
    { category: 'payments', question: 'Are tickets or passes refundable?', answer: 'A general refund policy is not published here. Review the terms on the specific MakeMyPass listing or contact its support team before purchasing.' },

    { category: 'schedule', question: 'Where can I find the schedule and daily timings?', answer: 'Use the <a href="#/schedule">festival schedule</a> for day-by-day information. Check each event page for its latest timing and venue.' },
    { category: 'schedule', question: 'When should I arrive, and how do I find an event venue?', answer: 'Arrival instructions depend on your event. Check its listing and the <a href="#/venue">venue page</a>, and contact the organizer if you need directions.' },
    { category: 'schedule', question: 'Can the schedule change?', answer: 'Programme details may be updated. Check the schedule and official event communications before travelling.' },
    { category: 'schedule', question: 'Are parking, food and transport arrangements available?', answer: 'These arrangements are not confirmed on this website. Contact the organizers at <a href="mailto:techfest@duk.ac.in">techfest@duk.ac.in</a> for current guidance.' },

    { category: 'rules', question: 'What should I bring? Is a college ID mandatory?', answer: 'Requirements vary by event. Check its eligibility and pass instructions; keeping your registration confirmation and a valid photo ID available is recommended.' },
    { category: 'rules', question: 'What if I arrive late or need to cancel my participation?', answer: 'Late-entry and cancellation rules are event-specific. Review the MakeMyPass terms and contact the event organizer for guidance.' },
    { category: 'rules', question: 'Who can help with accessibility, lost items or event conduct rules?', answer: 'Follow event and venue staff instructions. For accessibility support or lost property, contact the organizers at <a href="mailto:techfest@duk.ac.in">techfest@duk.ac.in</a>.' },

    { category: 'support', question: 'I cannot register or did not receive a confirmation email. What should I do?', answer: 'Check that required details are complete, then review your MakeMyPass account and spam folder. If the issue continues, contact MakeMyPass support or the event organizer.' },
    { category: 'support', question: 'How do I report an incorrect event detail or contact the organizers?', answer: 'Email <a href="mailto:techfest@duk.ac.in">techfest@duk.ac.in</a> with the event name and details, or use the <a href="#/contact">contact page</a>.' },
    { category: 'support', question: 'Where can I find official announcements?', answer: 'Check the VYUHAM’26 website and the official <a href="https://instagram.com/vyuham.duk" target="_blank" rel="noopener noreferrer">VYUHAM Instagram account</a> for updates.' }
  ];
  const faqPage = () => {
    const counts = Object.fromEntries(FAQ_CATEGORIES.map(category => [category.id, FAQ_ENTRIES.filter(entry => entry.category === category.id).length]));
    return `<div class="faq-page"><section class="faq-hero"><div class="container faq-hero-inner"><div class="faq-hero-copy"><div class="eyebrow">HELP CENTER / FAQ</div><h1>QUESTIONS?<br><span class="green">ANSWERS.</span></h1><p>Everything you need to know before experiencing VYUHAM’26.</p><div class="faq-stats"><span><b>${FAQ_ENTRIES.length}</b><small>QUESTIONS</small></span><span><b>${FAQ_CATEGORIES.length}</b><small>TOPICS</small></span></div></div><div class="faq-question-mark" aria-hidden="true">?</div></div></section><section class="faq-browser"><div class="container"><div class="faq-search-wrap"><label class="faq-search" for="faqSearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg><input id="faqSearch" type="search" placeholder="Search questions, registration, events..." autocomplete="off"><span class="faq-search-hint">SEARCH</span></label><button class="faq-search-clear" id="faqSearchClear" type="button" aria-label="Clear search" hidden>×</button></div><nav class="faq-categories" id="faqCategories" aria-label="Filter frequently asked questions"><button class="faq-category active" type="button" data-category="all" aria-pressed="true"><span aria-hidden="true">✧</span> All Questions <small>${FAQ_ENTRIES.length}</small></button>${FAQ_CATEGORIES.map(category => `<button class="faq-category" type="button" data-category="${category.id}" aria-pressed="false"><span aria-hidden="true">${category.icon}</span> ${category.label} <small>${counts[category.id]}</small></button>`).join('')}</nav><div class="faq-results-head"><span class="eyebrow" id="faqResultsCount" aria-live="polite" aria-atomic="true">${FAQ_ENTRIES.length} ANSWERS</span><span>Choose a question to read more</span></div><div class="faq-accordion" id="faqResults"></div></div></section><section class="faq-support-section"><div class="container"><div class="faq-support"><div><span class="eyebrow">VYUHAM’26 / SUPPORT</span><h2>Still have questions?</h2><p>Can't find what you're looking for? Reach out to the VYUHAM’26 team for assistance.</p></div><div class="faq-support-actions"><a class="button button-outline" href="mailto:techfest@duk.ac.in">CONTACT THE TEAM ↗</a><a class="text-link" href="#/events">EXPLORE EVENTS ↗</a></div></div></div></section></div>`;
  };
  const initFaq = () => {
    const search = $('#faqSearch'), clear = $('#faqSearchClear'), categories = $('#faqCategories'), results = $('#faqResults'), count = $('#faqResultsCount');
    if (!search || !clear || !categories || !results || !count) return;
    let activeCategory = 'all';
    const renderResults = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = FAQ_ENTRIES.filter(entry => (activeCategory === 'all' || entry.category === activeCategory) && `${entry.question} ${entry.answer} ${FAQ_CATEGORIES.find(category => category.id === entry.category)?.label || ''}`.toLocaleLowerCase().includes(query));
      clear.hidden = !search.value;
      count.textContent = `${matches.length} ${matches.length === 1 ? 'ANSWER' : 'ANSWERS'}`;
      if (!matches.length) {
        results.innerHTML = `<div class="faq-empty"><span aria-hidden="true">?</span><h2>No answers found</h2><p>Try another search or clear your filters to browse all questions.</p><button class="text-link" type="button" data-faq-reset>RESET SEARCH &amp; FILTERS ↗</button></div>`;
        return;
      }
      results.innerHTML = matches.map((entry, index) => {
        const category = FAQ_CATEGORIES.find(item => item.id === entry.category);
        const answerId = `faq-answer-${index + 1}`;
        return `<article class="faq-item" data-faq-item><button class="faq-question" id="faq-question-${index + 1}" type="button" aria-expanded="false" aria-controls="${answerId}"><span class="faq-question-meta"><small>${String(index + 1).padStart(2, '0')}</small><span class="faq-question-title">${entry.question}</span></span><span class="faq-toggle-icon" aria-hidden="true"></span></button><div class="faq-answer" id="${answerId}" role="region" aria-labelledby="faq-question-${index + 1}" aria-hidden="true" inert><div class="faq-answer-inner"><span class="faq-answer-category">${category?.label || 'VYUHAM’26'}</span><p>${entry.answer}</p></div></div></article>`;
      }).join('');
    };
    search.addEventListener('input', renderResults);
    clear.addEventListener('click', () => { search.value = ''; activeCategory = 'all'; categories.querySelectorAll('[data-category]').forEach(button => { const selected = button.dataset.category === 'all'; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); }); renderResults(); search.focus(); });
    categories.addEventListener('click', event => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      activeCategory = button.dataset.category;
      categories.querySelectorAll('[data-category]').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
      renderResults();
    });
    results.addEventListener('click', event => {
      const reset = event.target.closest('[data-faq-reset]');
      if (reset) { search.value = ''; activeCategory = 'all'; categories.querySelectorAll('[data-category]').forEach(button => { const selected = button.dataset.category === 'all'; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); }); renderResults(); search.focus(); return; }
      const button = event.target.closest('.faq-question');
      if (!button) return;
      const questionId = button.id, shouldOpen = button.getAttribute('aria-expanded') !== 'true';
      results.querySelectorAll('.faq-question').forEach(question => {
        const isOpen = shouldOpen && question.id === questionId;
        question.setAttribute('aria-expanded', String(isOpen));
        const panel = document.getElementById(question.getAttribute('aria-controls'));
        const item = question.closest('.faq-item');
        item.classList.toggle('open', isOpen);
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.toggleAttribute('inert', !isOpen);
      });
    });
    renderResults();
  };
  const initHeroFeaturedCarousel = waitingForIntro => {
    const stage = $('#featuredCarousel'), card = $('#featuredCard');
    const poster = $('#featuredPoster'), title = $('#featuredTitle'), subtitle = $('#featuredSubtitle'), category = $('#featuredCategory'), link = $('#featuredLink'), dots = $('#featuredDots');
    if (!stage || !card || !poster || !title || !category || !link || !dots || homepageFeaturedEvents.length < 2) return () => {};
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const imageLoads = new Map();
    const imageFor = event => safeEventImage(event?.image) || homepageFeaturedPoster(event);
    const initialPoster = imageFor(homepageFeaturedEvents[0]);
    if (initialPoster) {
      const initialAlt = `${officialEventTitle(homepageFeaturedEvents[0])} event poster`;
      poster.src = initialPoster; poster.alt = initialAlt; poster.hidden = false; card.classList.add('has-poster');
    }
    const preload = event => {
      const src = imageFor(event);
      if (!src) return Promise.resolve();
      if (!imageLoads.has(src)) imageLoads.set(src, new Promise(resolve => {
        const image = new Image();
        image.onload = image.onerror = () => resolve();
        image.src = src;
        if (image.complete) resolve();
      }));
      return imageLoads.get(src);
    };
    homepageFeaturedEvents.forEach(preload);
    let activeIndex = 0, timer = 0, transitionFrame = 0, transitionToken = 0;
    let hoverPaused = false, focusPaused = false, pageHidden = document.hidden, ready = !waitingForIntro;
    const canAutoplay = () => ready && !pageHidden && !hoverPaused && !focusPaused && !reducedMotion.matches;
    const schedule = () => {
      clearTimeout(timer);
      timer = 0;
      if (!canAutoplay()) return;
      timer = window.setTimeout(() => {
        timer = 0;
        showEvent((activeIndex + 1) % homepageFeaturedEvents.length).then(schedule);
      }, 4500);
    };
    const showEvent = async index => {
      const event = homepageFeaturedEvents[index];
      if (!event || index === activeIndex) return;
      const requestToken = ++transitionToken;
      stage.classList.add('is-transitioning');
      await preload(event);
      if (requestToken !== transitionToken || !stage.isConnected) return;
      const posterSrc = imageFor(event);
      if (posterSrc) {
        poster.src = posterSrc;
        poster.alt = `${officialEventTitle(event)} event poster`;
        poster.hidden = false;
        card.classList.add('has-poster');
      } else {
        poster.removeAttribute('src');
        poster.alt = '';
        poster.hidden = true;
        card.classList.remove('has-poster');
      }
      title.textContent = officialEventTitle(event);
      category.textContent = streamLabel(event.stream);
      if (subtitle) { subtitle.textContent = event.officialTitle ? event.title : ''; subtitle.hidden = !event.officialTitle; }
      link.href = `#/event/${encodeURIComponent(event.slug)}`;
      link.setAttribute('aria-label', `Open details for ${officialEventTitle(event)}`);
      card.setAttribute('aria-label', `Featured event ${index + 1} of ${homepageFeaturedEvents.length}: ${officialEventTitle(event)}`);
      dots.querySelectorAll('[data-featured-index]').forEach(dot => {
        const active = Number(dot.dataset.featuredIndex) === index;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-pressed', String(active));
      });
      activeIndex = index;
      cancelAnimationFrame(transitionFrame);
      transitionFrame = requestAnimationFrame(() => {
        if (requestToken === transitionToken) stage.classList.remove('is-transitioning');
      });
    };
    const onMouseEnter = () => { hoverPaused = true; schedule(); };
    const onMouseLeave = () => { hoverPaused = false; schedule(); };
    const onFocusIn = () => { focusPaused = true; schedule(); };
    const onFocusOut = event => { if (!card.contains(event.relatedTarget)) { focusPaused = false; schedule(); } };
    const onVisibility = () => { pageHidden = document.hidden; schedule(); };
    const onReducedMotion = () => schedule();
    const onIntroReady = () => { ready = true; schedule(); };
    const onDotClick = event => {
      const dot = event.target.closest('[data-featured-index]');
      if (!dot) return;
      showEvent(Number(dot.dataset.featuredIndex)).then(schedule);
    };
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    card.addEventListener('focusin', onFocusIn);
    card.addEventListener('focusout', onFocusOut);
    dots.addEventListener('click', onDotClick);
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener?.('change', onReducedMotion);
    if (waitingForIntro) stage.closest('#home')?.addEventListener('hero:ready', onIntroReady, { once: true });
    schedule();
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(transitionFrame);
      transitionToken++;
      card.removeEventListener('mouseenter', onMouseEnter);
      card.removeEventListener('mouseleave', onMouseLeave);
      card.removeEventListener('focusin', onFocusIn);
      card.removeEventListener('focusout', onFocusOut);
      dots.removeEventListener('click', onDotClick);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener?.('change', onReducedMotion);
      stage.closest('#home')?.removeEventListener('hero:ready', onIntroReady);
    };
  };
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
        const hay = [officialEventTitle(e), e.title, e.description, e.stream, e.venue].join(' ').toLowerCase(); return streamOk && dayOk && hay.includes(search.toLowerCase());
      });
      if (sort === 'name') filtered.sort((a, b) => officialEventTitle(a).localeCompare(officialEventTitle(b)));
      if (sort === 'fee') filtered.sort((a, b) => { const cost = e => { const m = String(e.fee || '').match(/[\d,]+/); return m ? Number(m[0].replaceAll(',', '')) : Infinity }; return cost(a) - cost(b) });
      if (sort === 'day') filtered.sort(eventPriority);
      count.textContent = `${String(filtered.length).padStart(2, '0')} EVENTS FOUND / ${events.length} ${document.documentElement.dataset.api === 'online' ? 'LIVE API' : 'CATALOG'} RECORDS`;
      const showDayPass = selected === 'all' && day === 'all' && !search.trim();
      grid.innerHTML = `${filtered.length ? filtered.map(eventCard).join('') : '<div class="empty-state" style="grid-column:1/-1">No events match these filters. Clear a filter or try another search.</div>'}${showDayPass ? dayPassCard() : ''}`;
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
    $('#scheduleContent').innerHTML = `<div class="schedule-heading"><div><span class="date-capsule">${esc(d.dateLabel)}</span><h2>${esc(d.name)}</h2></div><p class="muted">${esc(d.desc)}</p></div><div class="schedule-list">${dayEvents.length ? dayEvents.map((e, index) => `<article class="schedule-row"><div class="schedule-time"><span>0${String(index + 1).padStart(2, '0')}</span><time>${esc(e.time)}</time></div><div class="schedule-event"><h3><a href="#/event/${encodeURIComponent(e.slug)}">${esc(officialEventTitle(e))}</a></h3>${e.officialTitle ? `<small class="schedule-event-subtitle">${esc(e.title)}</small>` : ''}<p>${esc(e.description)}</p></div><div class="venue"><span>STREAM</span><b>${esc(streamLabel(e.stream))}</b></div></article>`).join('') : '<div class="empty-state">No event records are currently listed for this day.</div>'}</div>`;
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
    heroCarouselCleanup?.();
    heroCarouselCleanup = null;
    concertPopupCleanup?.();
    concertPopupCleanup = null;
    const r = route();
    if (r.page === 'event' && decodeURIComponent(r.slug) !== 'day-pass') {
      const requestedSlug = decodeURIComponent(r.slug);
      const aliasedSlug = eventSlugAliases.get(requestedSlug);
      const resolvedEvent = events.find(event => event.slug === requestedSlug || event.slug === aliasedSlug)
        || (requestedSlug === 'fit-arena-fitness-competition'
          ? allEventRecords.find(event => event.slug === requestedSlug)
          : null);
      if (resolvedEvent && requestedSlug !== resolvedEvent.slug) {
        go(`event/${encodeURIComponent(resolvedEvent.slug)}`);
        return;
      }
    }
    const activeEvent = r.page === 'event' && decodeURIComponent(r.slug) !== 'day-pass'
      ? events.find(e => e.slug === decodeURIComponent(r.slug))
        || (decodeURIComponent(r.slug) === 'fit-arena-fitness-competition'
          ? allEventRecords.find(e => e.slug === decodeURIComponent(r.slug))
          : null)
      : null;
    document.title = decodeURIComponent(r.slug || '') === 'day-pass' && r.page === 'event' ? 'Vyuham Day-Pass | VYUHAM’26' : activeEvent?.officialTitle ? `${officialEventTitle(activeEvent)} | VYUHAM’26` : r.page === 'hospitality' ? 'Hospitality near DUK | VYUHAM’26' : "VYUHAM'26 - Digital University Kerala";
    $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded', 'false'); $('#menuToggle').setAttribute('aria-label', 'Open navigation');
    $$('#mainNav [data-route]').forEach(a => a.classList.toggle('active', a.dataset.route === r.page));
    const shells = ['certificates', 'checkin', 'checkout', 'confirmation', 'feedback', 'food', 'leaderboard', 'payment', 'photography', 'qualifiers', 'receipt', 'results'];
    const removedRoutes = new Set(['login', 'signup', 'register', 'account', 'dashboard', 'profile', 'teams', 'hackathon', 'ctf', 'admin', 'sponsors', 'participate']);
    if (removedRoutes.has(r.page)) { location.replace(`${location.pathname}${location.search}#/home`); return }
    const disabledRoutes = new Set(['announcements', 'contact', 'feedback', 'results', 'leaderboard', 'certificates', 'receipt', 'checkin']);
    const views = { home, events: () => eventsPage(location.hash.includes('?') ? location.hash.split('?').slice(1).join('?') : ''), streams: streamsPage, event: () => eventDetail(r.slug), schedule: schedulePage, hospitality: hospitalityPage, about: venuePage, venue: aboutPage, contact: contactPage, faq: faqPage, competitions: competitionsPage, ...Object.fromEntries(shells.map(p => [p, () => featurePage(p)])) };
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
    const siteHeader = $('#siteHeader');
    if (siteHeader) siteHeader.hidden = Boolean(intro);
    if (intro) {
      const homeHero = $('#home');
      const skipButton = intro.querySelector('#skipIntro');
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
        if (siteHeader) siteHeader.hidden = false;
        homeHero?.classList.remove('intro-handoff');
        homeHero?.classList.add('intro-completed');
        homeHero?.removeAttribute('inert');
        inertTargets.forEach(el => { el.inert = false });
        skipButton?.removeEventListener('click', finish);
        document.removeEventListener('keydown', onKeyDown);
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        homeHero?.dispatchEvent(new Event('hero:ready'));
      };
      const onKeyDown = event => { if (event.key === 'Escape') finish() };
      document.addEventListener('keydown', onKeyDown);
      skipButton?.addEventListener('click', finish);
      (skipButton || intro).focus({ preventScroll: true });
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

    if (r.page === 'home') {
      heroCarouselCleanup = initHeroFeaturedCarousel(Boolean(intro));
      concertPopupCleanup = initConcertPopup();
    }

    updateCountdown();
    $('#siteFooter').style.display = '';
    if (routeDisabled) return;
    if (r.page === 'events') renderEvents(location.hash.includes('?') ? location.hash.split('?').slice(1).join('?') : '');
    $$('.info-toggle').forEach(button => button.addEventListener('click', () => {
      const description = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      description.hidden = expanded;
    }));
    if (r.page === 'schedule') {
      renderSchedule(r.query.get('day') || 1); $('#scheduleDays').addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (b) renderSchedule(b.dataset.day) });
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
    if (r.page === 'faq') initFaq();
    observeReveals(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); $('#app').focus({ preventScroll: true });
  }
  function toast(message) { const region = $('#toastRegion'); const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; region.append(el); setTimeout(() => el.remove(), 4200) }
  const closeMenu = (restoreFocus = false) => { const wasOpen = $('#mainNav').classList.contains('open'); $('#mainNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded', 'false'); $('#menuToggle').setAttribute('aria-label', 'Open navigation'); if (restoreFocus && wasOpen) $('#menuToggle').focus() };
  const terminalOverlay = $('#terminalOverlay'), terminalHistory = $('#terminalHistory'), terminalInput = $('#terminalInput');
  const commandHistory = []; let commandHistoryIndex = -1;
  const terminalPrint = (type, content) => { const line = document.createElement(type === 'ascii' ? 'pre' : 'div'); line.className = `terminal-line ${type}`; line.textContent = content; terminalHistory.append(line); terminalHistory.scrollTop = terminalHistory.scrollHeight };
  const terminalPrintHelp = () => {
    const line = document.createElement('section'); line.className = 'terminal-line terminal-help';
    const groups = [
      ['EXPLORE', [
        ['events', 'Open the event directory'], ['schedule', 'Open the festival schedule'], ['streams', 'Browse festival streams'], ['about', 'Venue & about VYUHAM’26'], ['competitions', 'Competition hub']
      ]],
      ['REGISTRATION', [['register', 'Open MakeMyPass registration']]],
      ['SYSTEM', [['status / reg:status', 'Show registration status']]],
      ['TERMINAL', [['help', 'Show this guide'], ['clear / cls', 'Clear terminal history'], ['exit / quit', 'Close terminal']]]
    ];
    line.innerHTML = `<h2>VYUHAM’26 TERMINAL</h2>${groups.map(([title, commands]) => `<section class="terminal-help-group"><h3>${title}</h3><div class="terminal-help-commands">${commands.map(([command, description]) => `<div class="terminal-help-row"><code>${command}</code><span>${description}</span></div>`).join('')}</div></section>`).join('')}`;
    terminalHistory.append(line); terminalHistory.scrollTop = terminalHistory.scrollHeight;
  };
  let terminalReturnFocus = null;
  const openTerminal = (trigger = document.activeElement) => { terminalReturnFocus = trigger?.id === 'mobileConsoleLauncher' || trigger?.closest?.('#mainNav') ? $('#menuToggle') : trigger; closeMenu(); terminalOverlay.hidden = false; document.documentElement.classList.add('terminal-open'); terminalInput.focus() };
  const closeTerminal = () => { terminalOverlay.hidden = true; document.documentElement.classList.remove('terminal-open'); (terminalReturnFocus?.isConnected ? terminalReturnFocus : $('#consoleLauncher')).focus(); terminalReturnFocus = null };
  const terminalNavigate = (path, message) => { terminalPrint('system', message); closeTerminal(); go(path) };
  const runTerminalCommand = async raw => {
    const text = raw.trim(); if (!text) return; terminalPrint('input', `$ ${text}`); commandHistory.push(text); commandHistoryIndex = commandHistory.length;
    const [verb, ...args] = text.split(/\s+/), cmd = verb.toLowerCase(), arg = args.join(' ').trim(), aliases = { schedule: 'schedule', events: 'events', streams: 'streams', about: 'about', venue: 'venue', competitions: 'competitions' };
    const navigateCommands = new Set(Object.keys(aliases));
    if (navigateCommands.has(cmd)) { terminalNavigate(aliases[cmd], `ROUTE // ${aliases[cmd].toUpperCase()}`); return }
    if (cmd === 'help') terminalPrint('system', 'LOGIN / SIGNUP // Opens the official MakeMyPass VYUHAM portal.');
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
  $('#consoleLauncher').addEventListener('click', e => openTerminal(e.currentTarget)); $('#mobileConsoleLauncher').addEventListener('click', e => openTerminal(e.currentTarget)); $('#consoleFooter').addEventListener('click', e => openTerminal(e.currentTarget)); $('#terminalClose').addEventListener('click', closeTerminal);
  terminalOverlay.addEventListener('click', event => { if (event.target === terminalOverlay) closeTerminal() });
  terminalPrint('system', 'VYUHAM’26 // FESTIVAL CONSOLE READY\nExplore the festival, events and schedule. Type “help” for commands.');
  $('#menuToggle').addEventListener('click', () => { const open = $('#mainNav').classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(open)); $('#menuToggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); if (open) $('#mainNav').querySelector('a')?.focus() });
  $('#mainNav').addEventListener('click', e => { if (e.target.closest('a')) closeMenu() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!terminalOverlay.hidden) closeTerminal(); closeMenu(true); return } const isEditable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable; const backtick = e.key === '`' || e.key === '~' || e.code === 'Backquote'; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); terminalOverlay.hidden ? openTerminal() : closeTerminal() } else if (backtick && !isEditable) { e.preventDefault(); terminalOverlay.hidden ? openTerminal() : closeTerminal() } else if (e.key === '?' && !isEditable) { e.preventDefault(); openTerminal() } });
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
  let lastScrollY = 0; let scrollIdleTimer = null;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#topProgress').style.transform = `scaleX(${max > 0 ? current / max : 0})`;
    const header = $('#siteHeader');
    if (current > lastScrollY && current > 120) header.classList.add('header-hidden');
    else header.classList.remove('header-hidden');
    lastScrollY = current;
    clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(() => header.classList.remove('header-hidden'), 800);
  }, { passive: true });
  // Accurate IST countdown, with no negative values after the target time.
  const festivalStart = '2026-10-30T09:00:00+05:30';
  function updateCountdown() { const remaining = Math.max(0, new Date(festivalStart).getTime() - Date.now()); const values = [Math.floor(remaining / 86400000), Math.floor(remaining % 86400000 / 3600000), Math.floor(remaining % 3600000 / 60000), Math.floor(remaining % 60000 / 1000)]; $$('[data-countdown]').forEach(el => { el.innerHTML = values.map((value, i) => `<span><b>${String(value).padStart(2, '0')}</b><i>${['DAYS', 'HRS', 'MIN', 'SEC'][i]}</i></span>`).join('') }) }
  updateCountdown(); setInterval(updateCountdown, 1000);
  render();
  if (!isRouteHash() && location.hash.length > 1) scrollToHashTarget();
})();

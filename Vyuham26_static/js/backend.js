(() => {
  'use strict';
  const savedApi = localStorage.getItem('vyuham26:api-url');
  const isLoopbackApi = value => { try { return ['localhost','127.0.0.1','::1'].includes(new URL(value).hostname); } catch { return false; } };
  if (!window.VYUHAM_API_URL && isLoopbackApi(savedApi)) localStorage.removeItem('vyuham26:api-url');
  const configured = window.VYUHAM_API_URL || (isLoopbackApi(savedApi) ? '' : savedApi) || 'https://vyuham26-backend.vercel.app';
  const base = String(configured).replace(/\/+$/, '');
  const supabaseUrl = String(window.VYUHAM_SUPABASE_URL || 'https://cnbnhfwvldgskpzfmifj.supabase.co').replace(/\/+$/, '');
  const supabaseKey = window.VYUHAM_SUPABASE_ANON_KEY || 'sb_publishable_S5LSbaNgwMQDbfhS5P7r5w_BXA_dMx3';
  const SESSION_KEY = 'vyuham26:supabase-session';
  const getSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
  const saveSession = session => { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY); };
  const supabaseRequest = async (path, body) => {
    const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: supabaseKey }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || 'Authentication request failed');
    return data;
  };
  const refreshSession = async () => {
    const session = getSession();
    if (!session?.refresh_token) return null;
    const renewed = await supabaseRequest('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
    saveSession(renewed); return renewed;
  };
  const request = async (path, options = {}, retry = true) => {
    if (!base) throw new Error('This static site is using bundled data; live services are not configured.');
    const session = getSession();
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}), ...(options.headers || {}) };
    const response = await fetch(`${base}${path}`, {
      ...options,
      headers,
    });
    if (response.status === 401 && retry && session?.refresh_token) {
      try { await refreshSession(); return request(path, options, false); } catch { saveSession(null); }
    }
    if (!response.ok) {
      let detail = `Request failed (${response.status})`;
      try { const data = await response.json(); detail = data.detail || detail; } catch {}
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
    return response.status === 204 ? null : response.json();
  };
  window.VYUHAM_API = {
    base,
    get: path => request(path),
    post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
    patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: path => request(path, { method: 'DELETE' }),
    session: getSession,
    async signIn(email, password) { const session = await supabaseRequest('token?grant_type=password', { email: email.trim().toLowerCase(), password }); saveSession(session); return session; },
    async signUp(details) { const session = await supabaseRequest('signup', { email: details.email.trim().toLowerCase(), password: details.password, data: { name: details.name, college: details.college || '', phone: details.phone || '' } }); if (session.access_token) saveSession(session); return session; },
    async signOut() { const session = getSession(); try { if (session?.access_token) await fetch(`${supabaseUrl}/auth/v1/logout`, { method: 'POST', headers: { apikey: supabaseKey, Authorization: `Bearer ${session.access_token}` } }); } catch {} finally { saveSession(null); } },
    async status() {
      if (!base) return { online: false, configured: false, error: new Error('Static mode: showing bundled public data; live services are not configured.') };
      try {
        await request('/health');
        const [gateResult, eventsResult, announcementsResult] = await Promise.allSettled([
          request('/registrations/config/status'), request('/events'), request('/announcements'),
        ]);
        return {
          online: true,
          gate: gateResult.status === 'fulfilled' ? gateResult.value : null,
          events: eventsResult.status === 'fulfilled' ? eventsResult.value : null,
          announcements: announcementsResult.status === 'fulfilled' ? announcementsResult.value : [],
          endpointErrors: {
            gate: gateResult.status === 'rejected' ? gateResult.reason.message : null,
            events: eventsResult.status === 'rejected' ? eventsResult.reason.message : null,
            announcements: announcementsResult.status === 'rejected' ? announcementsResult.reason.message : null,
          },
        };
      } catch (error) { return { online: false, error }; }
    },
  };
})();

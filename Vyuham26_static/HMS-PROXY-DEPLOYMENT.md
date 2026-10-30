# HMS under `vyuham.duk.ac.in/hackathon`

This directory is the shared-folder copy of the static VYUHAM site. The
`.htaccess` file here is the route rule to publish with this site. Apache must
allow overrides for this directory and have proxy modules enabled.

## Apache administrator

1. Ensure Apache enables `rewrite`, `proxy`, and `proxy_http`, and permits
   `AllowOverride FileInfo` (or `All`) for the hosted VYUHAM directory.
2. Publish the `.htaccess` file alongside the site files.
3. Check response headers:
   `curl -sSI https://vyuham.duk.ac.in/hackathon` and
   `curl -sSI https://vyuham.duk.ac.in/hackathon/`.

If the host disallows proxy rules in `.htaccess`, the administrator can instead
install `apache-hackathon-proxy.conf` inside the active HTTPS VirtualHost and
reload Apache. The browser should remain on the DUK hostname for the root and
nested routes. A redirect to Vercel is not equivalent to this proxy.

## Vercel deployment owner

The deployed app must actually serve `/hackathon/` and its nested pages. Before
the Apache proxy is enabled, confirm the deployment supports all of these:

- The app renders at `/hackathon/`; direct visits to nested pages survive a
  reload.
- Next.js assets, manifest, icons, and API requests resolve under the proxied
  origin/path. If assets are requested from `/_next/` at the origin root, the
  current Apache include does not proxy them.
- The service worker is served from `/hackathon/sw.js` and registered with
  scope `/hackathon/`. It must not register at `/` or claim unrelated VYUHAM
  pages. The current downloaded HMS source registers `/sw.js` with scope `/`,
  so the deployed build must be updated by its owner for path hosting.
- PWA install and offline behavior work after visiting
  `https://vyuham.duk.ac.in/hackathon/`.

If Vercel cannot serve the app with a `/hackathon` base path and confined PWA
scope, use a dedicated hostname instead of proxying it below the static site.

## Acceptance checks

- `/hackathon` and `/hackathon/` display HMS while the address bar remains on
  `vyuham.duk.ac.in`.
- Nested HMS routes and query strings work on direct navigation and refresh.
- Browser developer tools show no Vercel-host redirect, missing chunks, or
  cross-origin API failure.
- The registered service worker's scope is `/hackathon/`, and it does not
  control `/`, `/events`, or other VYUHAM routes.
- With network disabled after a successful visit, the intended public HMS
  information is available offline; authenticated or operational data is not
  served stale from cache.

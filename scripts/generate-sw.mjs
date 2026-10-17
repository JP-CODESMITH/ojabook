/*
 * Post-build service worker generator for Ojabook.
 *
 * vite-plugin-pwa / Workbox cannot hook TanStack Start's own build pipeline
 * (it sets `ssr: true` for the client environment and owns buildApp), so the
 * generated worker ends up empty. The reliable approach is to let Vite build
 * the app, then generate the worker here from the *actual* emitted assets.
 *
 * Run automatically by `bun run build` after `vite build`.
 */
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const CLIENT_DIR = 'dist/client'
const SHELL = '/_shell.html'

if (!existsSync(CLIENT_DIR)) {
  console.error(`[generate-sw] ${CLIENT_DIR} not found — run "vite build" first.`)
  process.exit(1)
}

/** Recursively list every file in a directory. */
function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

/** Map an emitted file to the URL(s) it should be cached under. */
function urlsFor(file) {
  const rel = relative(CLIENT_DIR, file).split(sep).join('/')
  if (rel === 'index.html') return ['/']
  if (rel.endsWith('/index.html')) {
    const base = '/' + rel.slice(0, -'index.html'.length)
    return [base, base.slice(0, -1)]
  }
  return ['/' + rel]
}

const PRECACHE_EXT = /\.(html|js|css|svg|png|ico|json|webmanifest)$/

const urls = [
  ...new Set(
    walk(CLIENT_DIR)
      .filter((f) => PRECACHE_EXT.test(f))
      .filter((f) => !f.endsWith(`${sep}sw.js`))
      .flatMap(urlsFor),
  ),
].sort()

const hash = createHash('sha256').update(urls.join('\n')).digest('hex').slice(0, 10)
const CACHE = `ojabook-${hash}`

const sw = `/* Ojabook service worker — auto-generated. Do not edit by hand. */
const CACHE = ${JSON.stringify(CACHE)};
const SHELL = ${JSON.stringify(SHELL)};
const PRECACHE = ${JSON.stringify(urls, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch {
            /* a single missing asset must not break install */
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

async function handleNavigate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    const shell = await caches.match(SHELL);
    return (
      shell ||
      new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      })
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok && response.type === 'basic') {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }
  // Same-origin assets: cache-first. Cross-origin (e.g. analytics): network only.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});
`

writeFileSync(join(CLIENT_DIR, 'sw.js'), sw)
console.log(
  `[generate-sw] wrote ${CLIENT_DIR}/sw.js — ${urls.length} precached URLs (${CACHE})`,
)

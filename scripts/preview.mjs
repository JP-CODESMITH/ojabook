/*
 * Minimal static preview server for the SPA build output (dist/client).
 * Mirrors how a static host serves the app: real files first, then
 * /dir/index.html, then /dir.html, then the SPA shell for everything else.
 *
 * Usage: bun run preview
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = 'dist/client'
const PORT = Number(process.env.PORT || 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

async function asFile(path) {
  try {
    const s = await stat(path)
    return s.isFile() ? path : null
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const rawPath = decodeURIComponent((req.url || '/').split('?')[0])
  const rel = normalize(rawPath).replace(/^([.]{2}[/\\])+/, '').replace(/^\/+/, '')
  const target = join(ROOT, rel)

  let file =
    (await asFile(target)) ||
    (extname(rel) ? null : await asFile(join(target, 'index.html'))) ||
    (extname(rel) ? null : await asFile(target + '.html')) ||
    (await asFile(join(ROOT, '_shell.html')))

  if (!file) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Build output missing. Run "bun run build" first.')
    return
  }

  const body = await readFile(file)
  const type = TYPES[extname(file)] || 'application/octet-stream'
  const isHashed = file.includes(`${'assets'}/`)
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': isHashed ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  res.end(body)
})

server.listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}`)
})

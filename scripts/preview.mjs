import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import { handleRequest } from '../worker/index.js'

const root = new URL('../public/', import.meta.url)
const port = Number(process.env.PORT || 8801)

function typeFor(file) {
  const ext = extname(file)
  if (ext === '.html') return 'text/html; charset=utf-8'
  if (ext === '.css') return 'text/css; charset=utf-8'
  if (ext === '.js') return 'application/javascript; charset=utf-8'
  if (ext === '.json' || ext === '.webmanifest') return 'application/json; charset=utf-8'
  if (ext === '.xml') return 'application/xml; charset=utf-8'
  if (ext === '.svg') return 'image/svg+xml'
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  return 'text/plain; charset=utf-8'
}

const assetBinding = {
  async fetch(request) {
    const url = new URL(request.url)
    let file = decodeURIComponent(url.pathname)
    file = file === '/' ? 'index.html' : file.replace(/^\//, '')
    if (file.endsWith('/')) file += 'index.html'
    try {
      const body = await readFile(new URL(file, root))
      return new Response(body, { status: 200, headers: { 'Content-Type': typeFor(file) } })
    } catch {
      return new Response('not found', { status: 404 })
    }
  },
}

createServer(async (req, res) => {
  const request = new Request(`http://127.0.0.1:${port}${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
    duplex: req.method === 'GET' || req.method === 'HEAD' ? undefined : 'half',
  })
  const response = await handleRequest(request, {
    SITE_ASSETS: assetBinding,
    ACCESS_TEST_MODE: 'true',
    OPENMONTAGE_SPACE_ACCESS_SECRET: 'local_preview_secret',
  })
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()))
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.end(Buffer.from(await response.arrayBuffer()))
}).listen(port, '127.0.0.1', () => {
  console.log(`OpenMontage Space preview: http://127.0.0.1:${port}/`)
})

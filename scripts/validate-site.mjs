import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { handleRequest } from '../worker/index.js'

const root = new URL('../public/', import.meta.url)
const product = JSON.parse(await readFile(new URL('product.json', root), 'utf8'))
const scriptVersion = '/app.js?v=20260627-openmontage-space-v1'
const required = [
  'index.html',
  'planner/index.html',
  'video-pipeline-selector/index.html',
  'reference-video-brief/index.html',
  'ai-video-cost-estimator/index.html',
  'quality-gates/index.html',
  'open-source-ai-video/index.html',
  'keyword-evidence/index.html',
  'pricing/index.html',
  'checkout/index.html',
  'docs/index.html',
  'privacy/index.html',
  'terms/index.html',
  'changelog/index.html',
  'success/index.html',
  'cancel/index.html',
  '404/index.html',
  'styles.css',
  'app.js',
  'assets/openmontage-showcase.jpg',
  'assets/openmontage-social-preview.png',
  'assets/openmontage-architecture.png',
  'favicon.svg',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'product.json',
  'BingSiteAuth.xml',
  '590a3ab02487cffe4cfd55b0df769f65.txt',
]

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(full))
    else files.push(full)
  }
  return files
}

for (const file of required) {
  const info = await stat(new URL(file, root))
  if (!info.isFile() || info.size < 8) throw new Error('Required file is missing or empty: ' + file)
}

const files = await walk(root.pathname)
const textFiles = files.filter((file) => /\.(html|txt|json|js|css|svg|webmanifest|xml)$/.test(file))
const htmlFiles = textFiles.filter((file) => file.endsWith('.html'))
for (const file of textFiles) {
  const text = await readFile(file, 'utf8')
  if (/[\u4e00-\u9fff]/.test(text)) throw new Error('Public file contains CJK text: ' + file)
  if (/Cognee|Firecrawl|SpiderFoot|Stirling|Penpot|PDF workflow|knowledge graph RAG/i.test(text)) {
    throw new Error('Public file contains stale template wording: ' + file)
  }
  if (/<a\b[^>]*href=["']https?:\/\//i.test(text)) {
    throw new Error('Public file contains visible outbound link: ' + file)
  }
  if (/isAccessibleForFree":true|Generate free production plan|fake checkout/i.test(text)) {
    throw new Error('Public file contains weak checkout or free planner wording: ' + file)
  }
}

for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8')
  const relative = path.relative(root.pathname, file)
  const h1Count = (text.match(/<h1\b/gi) || []).length
  if (h1Count !== 1) throw new Error('HTML page must have exactly one H1: ' + relative)
  const canonical = text.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
  const ogUrl = text.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1]
  if (!canonical) throw new Error('HTML page missing canonical: ' + relative)
  if (!ogUrl) throw new Error('HTML page missing og:url: ' + relative)
  if (canonical !== ogUrl) throw new Error('HTML page canonical and og:url differ: ' + relative)
  if (!text.includes(scriptVersion)) throw new Error('HTML page missing versioned app script: ' + relative)
}

const index = await readFile(new URL('index.html', root), 'utf8')
for (const needle of [
  'OpenMontage Space',
  'Plan the video your AI agent can actually ship.',
  'View pricing packages',
  'Preview planner',
  'assets/openmontage-showcase.jpg',
  '23,768',
  'AGPL-3.0',
  'pricing_required',
]) {
  if (!index.toLowerCase().includes(needle.toLowerCase())) throw new Error('Homepage missing expected copy: ' + needle)
}

const pricing = await readFile(new URL('pricing/index.html', root), 'utf8')
for (const needle of [
  'Independent pricing packages',
  'data-billing-tabs',
  'data-default-billing="annual"',
  'Annual <span>Save 50%</span>',
  'Monthly',
  'data-monthly-display="29"',
  'data-annual-display="14.50"',
  'data-annual-display="4.50"',
  '$174 due today',
  '$354 due today',
  'Checkout Pro annual',
  'do not automatically renew',
  'Feature gate',
]) {
  if (!pricing.includes(needle)) throw new Error('Pricing page missing package gate copy: ' + needle)
}

const appScript = await readFile(new URL('app.js', root), 'utf8')
for (const needle of ['page_view', 'billing_toggle', 'setBillingMode', 'data-checkout-link-plan', 'checkoutBilling', 'openmontageSpaceAccessToken']) {
  if (!appScript.includes(needle)) throw new Error('App script missing billing or access behavior: ' + needle)
}

const docs = await readFile(new URL('docs/index.html', root), 'utf8')
for (const needle of ['independent, unofficial', 'AGPL-3.0', 'Official Sources', 'conversion CTAs stay on openmontage.space']) {
  if (!docs.includes(needle)) throw new Error('Docs page missing source boundary copy: ' + needle)
}

const keywordEvidence = await readFile(new URL('keyword-evidence/index.html', root), 'utf8')
for (const needle of [
  'OpenMontage keyword evidence',
  'Relative heat vs mirofish',
  'confirmed_same_request_trends',
  'official Google Trends same-request',
  'AI video generator',
  'video production pipeline',
  'AI video workflow',
  'AI video cost estimator',
]) {
  if (!keywordEvidence.toLowerCase().includes(needle.toLowerCase())) throw new Error('Keyword evidence page missing expected copy: ' + needle)
}
for (const stale of ['pending_same_request_trends', 'blocked_trends_pending_browser_dom', 'No row is marked as a validated traffic keyword yet']) {
  if (keywordEvidence.includes(stale)) throw new Error('Keyword evidence page still contains stale blocked copy: ' + stale)
}

const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8')
const urlCount = (sitemap.match(/<url>/g) || []).length
if (urlCount < 16) throw new Error('Sitemap has too few URLs: ' + urlCount)
for (const route of ['planner', 'video-pipeline-selector', 'reference-video-brief', 'ai-video-cost-estimator', 'quality-gates', 'open-source-ai-video', 'keyword-evidence', 'pricing', 'checkout', 'docs']) {
  if (!sitemap.includes('/' + route + '/')) throw new Error('Sitemap missing route: ' + route)
}

if (product.keywordValidation?.status !== 'keyword_validation_passed' ||
  product.keywordValidation?.source !== 'official_google_trends_api_same_request_plus_browser_chart' ||
  product.keywordValidation?.confirmedTrafficKeywords !== 14 ||
  product.keywordValidation?.confirmedPrimaryKeywords !== 6 ||
  product.keywordValidation?.confirmedLongTailKeywords !== 8 ||
  product.keywordValidation?.relativeHeatUnit !== 'termAvg / mirofishAvg' ||
  product.keywords?.length !== 14 ||
  product.keywords?.filter((row) => row.themeRelevance === 'strong').length !== 14 ||
  product.keywords?.filter((row) => row.validationState === 'confirmed_same_request_trends').length !== 14 ||
  product.keywords?.filter((row) => row.type === 'primary').length !== 6 ||
  product.keywords?.filter((row) => row.type === 'long-tail').length !== 8 ||
  product.keywords?.some((row) => !(Number(row.relativeHeatVsMirofish) > 0) || !(Number(row.termAvg) > 0) || !(Number(row.mirofishAvg) > 0) || !(Number(row.nonZeroWeeks) > 0))) {
  throw new Error('product.json keyword validation metadata is incomplete')
}

if (product.trustDataLedger?.length < 3 ||
  product.gates?.trust_data_gate !== 'pass_local' ||
  product.gates?.trust_content_gate !== 'pass_local' ||
  product.gates?.keyword_gate !== 'pass_google_trends_same_request') {
  throw new Error('Trust data/content gate metadata is incomplete')
}

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8'
  if (file.endsWith('.css')) return 'text/css; charset=utf-8'
  if (file.endsWith('.js')) return 'application/javascript; charset=utf-8'
  if (file.endsWith('.json') || file.endsWith('.webmanifest')) return 'application/json; charset=utf-8'
  if (file.endsWith('.xml')) return 'application/xml; charset=utf-8'
  if (file.endsWith('.svg')) return 'image/svg+xml'
  if (file.endsWith('.png')) return 'image/png'
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg'
  return 'text/plain; charset=utf-8'
}

const assetBinding = {
  async fetch(request) {
    const url = new URL(request.url)
    let route = decodeURIComponent(url.pathname)
    let file = route === '/' ? 'index.html' : route.replace(/^\//, '')
    if (file.endsWith('/')) file += 'index.html'
    try {
      const body = await readFile(new URL(file, root))
      return new Response(body, { status: 200, headers: { 'Content-Type': contentType(file) } })
    } catch {
      return new Response('not found', { status: 404 })
    }
  },
}

const local = 'http://127.0.0.1:8801'
const analyticsRows = []
const analyticsDb = {
  prepare(sql) {
    const statement = {
      sql,
      values: [],
      bind(...values) {
        statement.values = values
        return statement
      },
      async run() {
        if (/INSERT INTO analytics_events/i.test(sql)) analyticsRows.push({ sql, values: statement.values })
        return { success: true }
      },
    }
    return statement
  },
  async batch(statements) {
    return statements.map(() => ({ success: true }))
  },
}

let response = await handleRequest(new Request(local + '/api/runtime'), { SITE_ASSETS: assetBinding, ANALYTICS_DB: analyticsDb })
if (response.status !== 200) throw new Error('/api/runtime did not return 200')
const runtime = await response.json()
if (!runtime.ok || runtime.product !== product.brand || !runtime.upstreamRepo || runtime.mode !== 'independent_unofficial_companion' || runtime.paymentProvider !== 'polar' || !runtime.pricing || runtime.plannerAccess !== 'paid_access_required' || !runtime.accessEndpoint || !runtime.analyticsConfigured) {
  throw new Error('runtime response is incomplete')
}
if (runtime.keywordValidation?.status !== 'keyword_validation_passed' ||
  runtime.keywordValidation?.confirmedTrafficKeywords !== 14 ||
  runtime.keywordValidation?.confirmedPrimaryKeywords !== 6 ||
  runtime.keywordValidation?.confirmedLongTailKeywords !== 8) {
  throw new Error('runtime keyword validation response is incomplete')
}
if (runtime.defaultBilling !== 'annual' ||
  runtime.pricing.starter?.annual?.displayMonthlyUsd !== 4.5 ||
  runtime.pricing.starter?.annual?.dueTodayUsd !== 54 ||
  runtime.pricing.pro?.monthly?.displayMonthlyUsd !== 29 ||
  runtime.pricing.pro?.annual?.displayMonthlyUsd !== 14.5 ||
  runtime.pricing.pro?.annual?.dueTodayUsd !== 174 ||
  runtime.pricing.enterprise?.annual?.displayMonthlyUsd !== 29.5 ||
  runtime.pricing.enterprise?.annual?.dueTodayUsd !== 354) {
  throw new Error('runtime pricing metadata is missing Annual/Monthly 50% discount values')
}

response = await handleRequest(new Request(local + '/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Referer: 'https://chatgpt.com/' },
  body: JSON.stringify({ event: 'page_view', path: '/docs/', referrer: 'https://chatgpt.com/c/abc' }),
}), { SITE_ASSETS: assetBinding, ANALYTICS_DB: analyticsDb })
const analytics = await response.json()
if (response.status !== 200 || analytics.stored !== true || !analytics.sinks?.includes('d1') || analytics.aiSource !== 'openai-chatgpt' || analyticsRows.length !== 1) {
  throw new Error('/api/analytics should store D1 events and classify AI referrals')
}

response = await handleRequest(new Request(local + '/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId: 'pro', billing: 'annual' }),
}), { SITE_ASSETS: assetBinding, ANALYTICS_DB: analyticsDb })
const missingCheckout = await response.json()
if (response.status !== 503 || missingCheckout.provider !== 'polar' || missingCheckout.paymentConfigured !== false) {
  throw new Error('checkout response should report missing Polar configuration')
}

response = await handleRequest(new Request(local + '/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId: 'pro', billing: 'annual' }),
}), { SITE_ASSETS: assetBinding, ANALYTICS_DB: analyticsDb, POLAR_CHECKOUT_URL_PRO_ANNUAL: 'https://buy.polar.sh/polar_cl_test' })
const checkout = await response.json()
if (response.status !== 200 || checkout.provider !== 'polar' || checkout.dueTodayUsd !== 174 || !/^https:\/\/buy\.polar\.sh\//.test(checkout.checkoutUrl || '')) {
  throw new Error('checkout response is missing Polar hosted checkout URL')
}

response = await handleRequest(new Request(local + '/api/planner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ goal: 'Make a documentary montage using real footage from archives', scale: 'standard', output: 'json' }),
}), { SITE_ASSETS: assetBinding })
const lockedPlanner = await response.json()
if (response.status !== 402 || lockedPlanner.requiresPayment !== true || !lockedPlanner.pricingPath?.endsWith('/pricing/')) {
  throw new Error('/api/planner should require paid access before returning plans')
}

response = await handleRequest(new Request(local + '/api/access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ checkoutId: 'local_paid_checkout_123', planId: 'pro', billing: 'annual' }),
}), { SITE_ASSETS: assetBinding, ACCESS_TEST_MODE: 'true', OPENMONTAGE_SPACE_ACCESS_SECRET: 'local_validation_secret' })
const access = await response.json()
if (response.status !== 200 || !access.accessToken) throw new Error('/api/access did not issue test paid access token')

response = await handleRequest(new Request(local + '/api/planner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + access.accessToken },
  body: JSON.stringify({ goal: 'Make a documentary montage using real footage from archives', scale: 'standard', output: 'json' }),
}), { SITE_ASSETS: assetBinding, ANALYTICS_DB: analyticsDb, OPENMONTAGE_SPACE_ACCESS_SECRET: 'local_validation_secret' })
if (response.status !== 200) throw new Error('/api/planner did not return 200 after paid access')
const plan = await response.json()
if (!plan.recommendedEndpoints?.some((endpoint) => endpoint.name === 'documentary-montage') || !plan.qualityGates?.includes('ffprobe validation')) {
  throw new Error('planner response is missing expected OpenMontage recommendations')
}

response = await handleRequest(new Request(local + '/.well-known/openmontage-space.json'), { SITE_ASSETS: assetBinding })
if (response.status !== 200) throw new Error('facts JSON did not return 200')
const facts = await response.json()
if (facts.relationship !== 'independent_unofficial_companion' || !facts.upstream.license.includes('AGPL-3.0')) {
  throw new Error('facts JSON is incomplete')
}
if (facts.keywordEvidence?.status !== 'keyword_validation_passed' ||
  facts.keywordEvidence?.confirmedTrafficKeywords !== 14 ||
  facts.keywordEvidence?.relativeHeatVsMirofish !== '0.0046-54.4675') {
  throw new Error('facts JSON keyword evidence is incomplete')
}

response = await handleRequest(new Request(local + '/missing-page'), { SITE_ASSETS: assetBinding })
if (response.status !== 404) throw new Error('unknown route should return 404')

const css = await readFile(new URL('styles.css', root), 'utf8')
const js = await readFile(new URL('app.js', root), 'utf8')
const performanceEvidence = {
  tool: 'local_static_fallback',
  collectedAt: new Date().toISOString(),
  checkedUrls: ['/', '/pricing/', '/planner/'],
  assets: {
    cssBytes: Buffer.byteLength(css),
    cssGzipBytes: gzipSync(css).length,
    jsBytes: Buffer.byteLength(js),
    jsGzipBytes: gzipSync(js).length,
    heroImageBytes: (await stat(new URL('assets/openmontage-showcase.jpg', root))).size,
    socialImageBytes: (await stat(new URL('assets/openmontage-social-preview.png', root))).size,
  },
  firstPacketHtmlContains: {
    homepageH1: index.includes('<h1>Plan the video your AI agent can actually ship.</h1>'),
    pricingCta: pricing.includes('Checkout Pro annual'),
    paidGate: index.includes('pricing_required') && pricing.includes('Feature gate'),
  },
  budget: {
    criticalJsGzipUnder500kb: gzipSync(js).length < 500 * 1024,
    criticalCssGzipUnder150kb: gzipSync(css).length < 150 * 1024,
    heroImageUnder1mb: (await stat(new URL('assets/openmontage-showcase.jpg', root))).size < 1024 * 1024,
  },
  result: 'pass_local_fallback',
}
await writeFile(new URL('../reports/performance-evidence.json', import.meta.url), `${JSON.stringify(performanceEvidence, null, 2)}\n`)

console.log('Validated ' + product.brand + ': ' + textFiles.length + ' public text files, ' + urlCount + ' sitemap URLs, independent pricing page, paid planner gate, keyword validation pass, runtime API, stored analytics mock, Polar checkout mock, facts JSON, 404 handling, and local performance evidence.')

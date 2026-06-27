const CONFIG = {
  slug: 'openmontage-space',
  brand: 'OpenMontage Space',
  domain: 'openmontage.space',
  canonicalOrigin: 'https://openmontage.space',
  support: 'support@aigeamy.com',
  upstreamRepo: 'https://github.com/calesthio/OpenMontage',
  upstreamLicense: 'AGPL-3.0',
  relationship: 'independent_unofficial_companion',
  defaultPlanId: 'pro',
  defaultBilling: 'annual',
  plans: {
    starter: { id: 'starter', name: 'Starter', monthlyAmountCents: 900, allowedBilling: ['monthly', 'annual'], summary: 'One OpenMontage production brief.' },
    pro: { id: 'pro', name: 'Pro', monthlyAmountCents: 2900, allowedBilling: ['monthly', 'annual'], summary: 'Five production briefs plus quality-gate checklist.' },
    enterprise: { id: 'enterprise', name: 'Enterprise', monthlyAmountCents: 5900, allowedBilling: ['monthly', 'annual'], summary: 'Fifteen briefs plus governance-ready production planning.' },
  },
  keywords: {
    status: 'pending_mirofish_trends',
    path: '/keyword-evidence/',
    confirmedTrafficKeywords: 0,
    blocker: 'blocked_trends_pending_browser_dom',
  },
}

const ANNUAL_DISCOUNT_MULTIPLIER = 0.5
const POLAR_API_BASE = 'https://api.polar.sh'
const POLAR_ACCESS_TOKEN_KEYS = ['POLAR_ACCESS_TOKEN', 'POLAR_API_KEY', 'POLAR_TOKEN']
const POLAR_GENERIC_PRODUCT_ID_KEYS = ['POLAR_PRODUCT_ID', 'POLAR_DEFAULT_PRODUCT_ID', 'POLAR_OPENMONTAGE_SPACE_PRODUCT_ID']
const POLAR_CHECKOUT_LINK_KEYS = {
  'starter:monthly': ['POLAR_CHECKOUT_URL_STARTER_MONTHLY', 'POLAR_STARTER_MONTHLY_CHECKOUT_URL'],
  'starter:annual': ['POLAR_CHECKOUT_URL_STARTER_ANNUAL', 'POLAR_STARTER_ANNUAL_CHECKOUT_URL'],
  'pro:monthly': ['POLAR_CHECKOUT_URL_PRO_MONTHLY', 'POLAR_PRO_MONTHLY_CHECKOUT_URL'],
  'pro:annual': ['POLAR_CHECKOUT_URL_PRO_ANNUAL', 'POLAR_PRO_ANNUAL_CHECKOUT_URL'],
  'enterprise:monthly': ['POLAR_CHECKOUT_URL_ENTERPRISE_MONTHLY', 'POLAR_ENTERPRISE_MONTHLY_CHECKOUT_URL'],
  'enterprise:annual': ['POLAR_CHECKOUT_URL_ENTERPRISE_ANNUAL', 'POLAR_ENTERPRISE_ANNUAL_CHECKOUT_URL'],
}
const POLAR_PRODUCT_ID_KEYS = {
  'starter:monthly': ['POLAR_PRODUCT_ID_STARTER_MONTHLY', 'POLAR_STARTER_MONTHLY_PRODUCT_ID'],
  'starter:annual': ['POLAR_PRODUCT_ID_STARTER_ANNUAL', 'POLAR_STARTER_ANNUAL_PRODUCT_ID'],
  'pro:monthly': ['POLAR_PRODUCT_ID_PRO_MONTHLY', 'POLAR_PRO_MONTHLY_PRODUCT_ID'],
  'pro:annual': ['POLAR_PRODUCT_ID_PRO_ANNUAL', 'POLAR_PRO_ANNUAL_PRODUCT_ID'],
  'enterprise:monthly': ['POLAR_PRODUCT_ID_ENTERPRISE_MONTHLY', 'POLAR_ENTERPRISE_MONTHLY_PRODUCT_ID'],
  'enterprise:annual': ['POLAR_PRODUCT_ID_ENTERPRISE_ANNUAL', 'POLAR_ENTERPRISE_ANNUAL_PRODUCT_ID'],
}
const ACCESS_SECRET_KEYS = ['OPENMONTAGE_SPACE_ACCESS_SECRET', 'ACCESS_SIGNING_SECRET']
const ACCESS_TTL_SECONDS = 60 * 60 * 24 * 30
const ALT_HOSTS = new Set(['www.' + CONFIG.domain])
let analyticsSchemaReady = false

function originAllowed(origin) {
  if (!origin) return false
  try {
    const url = new URL(origin)
    return url.hostname === CONFIG.domain ||
      ALT_HOSTS.has(url.hostname) ||
      url.hostname.endsWith('.workers.dev') ||
      url.hostname.endsWith('.pages.dev') ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
  } catch {
    return false
  }
}

function securityHeaders(request) {
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'X-Robots-Tag': 'index, follow',
  })
  const origin = request?.headers?.get?.('Origin')
  if (originAllowed(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Vary', 'Origin')
  }
  return headers
}

function jsonResponse(data, status = 200, request = null) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  return new Response(JSON.stringify(data), { status, headers })
}

async function getSecretValue(value) {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value.get === 'function') {
    const resolved = await value.get()
    return typeof resolved === 'string' ? resolved.trim() : ''
  }
  return ''
}

async function firstSecretEnv(env, ...keys) {
  for (const key of keys) {
    const value = await getSecretValue(env?.[key])
    if (value) return value
  }
  return ''
}

function selectionKey(planId, billing) {
  return `${planId}:${billing}`
}

function normalizePlanSelection(body = {}) {
  const rawPlanId = typeof body.planId === 'string'
    ? body.planId.split(':')[0]
    : typeof body.plan === 'string'
      ? body.plan
      : CONFIG.defaultPlanId
  const plan = CONFIG.plans[rawPlanId] || CONFIG.plans[CONFIG.defaultPlanId]
  const requestedBilling = body.billing === 'monthly' || body.period === 'monthly' ? 'monthly' : 'annual'
  const billing = plan.allowedBilling.includes(requestedBilling) ? requestedBilling : CONFIG.defaultBilling
  return { plan, planId: plan.id, billing, period: billing }
}

function amountFor(plan, billing) {
  const monthlyCents = billing === 'annual'
    ? Math.round(plan.monthlyAmountCents * ANNUAL_DISCOUNT_MULTIPLIER)
    : plan.monthlyAmountCents
  return {
    monthlyCents,
    dueTodayCents: billing === 'annual' ? monthlyCents * 12 : monthlyCents,
  }
}

function centsToUsd(cents) {
  return Number((cents / 100).toFixed(2))
}

function publicPlans() {
  return Object.fromEntries(
    Object.entries(CONFIG.plans).map(([id, plan]) => {
      const monthly = amountFor(plan, 'monthly')
      const annual = amountFor(plan, 'annual')
      return [id, {
        id,
        name: plan.name,
        summary: plan.summary,
        defaultBilling: CONFIG.defaultBilling,
        allowedBilling: plan.allowedBilling,
        noAutomaticRenewal: true,
        monthly: {
          displayMonthlyUsd: centsToUsd(monthly.monthlyCents),
          dueTodayUsd: centsToUsd(monthly.dueTodayCents),
          coverage: 'one month',
        },
        annual: {
          displayMonthlyUsd: centsToUsd(annual.monthlyCents),
          dueTodayUsd: centsToUsd(annual.dueTodayCents),
          coverage: 'one year',
        },
      }]
    }),
  )
}

function safeText(value, maxLength = 180) {
  return String(value || '')
    .replace(/[^\w:./?=&%#+@,;'"() -]/g, '')
    .slice(0, maxLength)
    .trim()
}

function hostFromUrl(value) {
  try {
    return new URL(String(value || '')).hostname.toLowerCase()
  } catch {
    return ''
  }
}

function userAgentFamily(value) {
  const text = String(value || '').toLowerCase()
  if (!text) return ''
  if (text.includes('chatgpt-user')) return 'chatgpt-user'
  if (text.includes('perplexity')) return 'perplexity'
  if (text.includes('claudebot') || text.includes('anthropic')) return 'anthropic'
  if (text.includes('googlebot')) return 'googlebot'
  if (text.includes('bingbot')) return 'bingbot'
  if (text.includes('chrome')) return 'chrome'
  if (text.includes('safari')) return 'safari'
  if (text.includes('firefox')) return 'firefox'
  return 'other'
}

function aiReferralSource(referrerHost, userAgent) {
  const text = `${referrerHost} ${String(userAgent || '').toLowerCase()}`
  if (/chatgpt|openai/.test(text)) return 'openai-chatgpt'
  if (/perplexity/.test(text)) return 'perplexity'
  if (/gemini|bard\.google|google\.com\/search/.test(text)) return 'google-gemini-or-search'
  if (/copilot|bing\.com|microsoft/.test(text)) return 'microsoft-copilot-or-bing'
  if (/claude|anthropic/.test(text)) return 'anthropic-claude'
  return ''
}

function analyticsConfigured(env) {
  return Boolean(env?.ANALYTICS_DB?.prepare)
}

async function ensureAnalyticsSchema(env) {
  if (analyticsSchemaReady || !env?.ANALYTICS_DB?.prepare) return
  await env.ANALYTICS_DB.batch([
    env.ANALYTICS_DB.prepare(`CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      site TEXT NOT NULL,
      domain TEXT NOT NULL,
      timestamp_ms INTEGER NOT NULL,
      day TEXT NOT NULL,
      event TEXT NOT NULL,
      path TEXT NOT NULL,
      target TEXT,
      product TEXT,
      provider TEXT,
      plan_id TEXT,
      billing TEXT,
      feature TEXT,
      scale TEXT,
      output TEXT,
      deployment TEXT,
      referrer_host TEXT,
      ai_source TEXT,
      user_agent_family TEXT,
      country TEXT,
      raw_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`),
    env.ANALYTICS_DB.prepare('CREATE INDEX IF NOT EXISTS idx_openmontage_events_site_day ON analytics_events (site, day)'),
    env.ANALYTICS_DB.prepare('CREATE INDEX IF NOT EXISTS idx_openmontage_events_event_day ON analytics_events (event, day)'),
    env.ANALYTICS_DB.prepare('CREATE INDEX IF NOT EXISTS idx_openmontage_events_ai_source ON analytics_events (ai_source)'),
  ])
  analyticsSchemaReady = true
}

async function writeAnalyticsEvent(env, event) {
  const sinks = []
  if (env?.ANALYTICS_DB?.prepare) {
    await ensureAnalyticsSchema(env)
    await env.ANALYTICS_DB.prepare(`INSERT INTO analytics_events (
      id, site, domain, timestamp_ms, day, event, path, target, product, provider,
      plan_id, billing, feature, scale, output, deployment, referrer_host,
      ai_source, user_agent_family, country, raw_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      crypto.randomUUID(),
      event.site,
      event.domain,
      event.timestamp,
      event.day,
      event.event,
      event.path,
      event.target,
      event.product,
      event.provider,
      event.planId,
      event.billing,
      event.feature,
      event.scale,
      event.output,
      event.deployment,
      event.referrerHost,
      event.aiSource,
      event.userAgentFamily,
      event.country,
      JSON.stringify(event),
      new Date(event.timestamp).toISOString(),
    ).run()
    sinks.push('d1')
  }
  return sinks
}

async function handleAnalytics(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  let body = {}
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }
  const referrerHost = hostFromUrl(body.referrer || request.headers.get('Referer') || '')
  const userAgent = request.headers.get('User-Agent') || ''
  const now = Date.now()
  const event = {
    site: CONFIG.slug,
    domain: CONFIG.domain,
    timestamp: now,
    day: new Date(now).toISOString().slice(0, 10),
    event: safeText(body.event || 'event', 64),
    path: safeText(body.path || new URL(request.url).pathname, 120),
    target: safeText(body.target || ''),
    product: CONFIG.brand,
    provider: safeText(body.provider || ''),
    planId: safeText(body.planId || ''),
    billing: safeText(body.billing || ''),
    feature: safeText(body.feature || ''),
    scale: safeText(body.scale || ''),
    output: safeText(body.output || ''),
    deployment: safeText(body.deployment || ''),
    referrerHost,
    aiSource: aiReferralSource(referrerHost, userAgent),
    userAgentFamily: userAgentFamily(userAgent),
    country: safeText(request.cf?.country || ''),
  }
  const sinks = await writeAnalyticsEvent(env, event)
  return jsonResponse({
    ok: true,
    stored: sinks.includes('d1'),
    sinks,
    aiSource: event.aiSource,
    analyticsConfigured: analyticsConfigured(env),
  }, 200, request)
}

function validPolarUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' && /(^|\.)polar\.sh$/i.test(url.hostname) ? url.toString() : ''
  } catch {
    return ''
  }
}

function validPolarApiBase(value) {
  if (typeof value !== 'string' || !value.trim()) return POLAR_API_BASE
  try {
    const url = new URL(value.trim())
    if (url.protocol === 'https:' && (url.hostname === 'api.polar.sh' || url.hostname === 'sandbox-api.polar.sh')) return url.origin
  } catch {}
  return POLAR_API_BASE
}

async function polarCheckoutLinkFromEnv(env, planId, billing) {
  return validPolarUrl(await firstSecretEnv(env, ...(POLAR_CHECKOUT_LINK_KEYS[selectionKey(planId, billing)] || []), 'POLAR_CHECKOUT_URL'))
}

async function polarProductIdFromEnv(env, planId, billing) {
  return firstSecretEnv(env, ...(POLAR_PRODUCT_ID_KEYS[selectionKey(planId, billing)] || []), ...POLAR_GENERIC_PRODUCT_ID_KEYS)
}

async function polarApiBaseFromEnv(env) {
  return validPolarApiBase(await firstSecretEnv(env, 'POLAR_API_BASE'))
}

function extractPolarCheckoutUrl(payload) {
  return validPolarUrl(payload?.url) || validPolarUrl(payload?.checkout_url)
}

async function requestPolarCheckoutSession(apiBase, accessToken, payload) {
  const response = await fetch(`${apiBase}/v1/checkouts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const rawText = await response.text()
  let data = {}
  if (rawText) {
    try { data = JSON.parse(rawText) } catch {}
  }
  if (!response.ok) throw new Error(typeof data?.message === 'string' ? data.message : 'Checkout session failed.')
  return data
}

function checkoutSessionPayload({ productId, planId, billing, plan, amount, origin, orderId, request }) {
  const customerIp = request.headers.get('CF-Connecting-IP') || (request.headers.get('X-Forwarded-For') || '').split(',')[0].trim()
  return {
    products: [productId],
    prices: {
      [productId]: [
        {
          amount_type: 'fixed',
          price_amount: amount.dueTodayCents,
          price_currency: 'usd',
        },
      ],
    },
    success_url: `${origin}/success/?planId=${encodeURIComponent(planId)}&billing=${encodeURIComponent(billing)}&checkout_id={CHECKOUT_ID}`,
    return_url: `${origin}/checkout/?planId=${encodeURIComponent(planId)}&billing=${encodeURIComponent(billing)}`,
    allow_discount_codes: true,
    require_billing_address: false,
    ...(customerIp ? { customer_ip_address: customerIp } : {}),
    metadata: {
      site: CONFIG.slug,
      domain: CONFIG.domain,
      plan: planId,
      billing,
      order_id: orderId,
      product: plan.name,
    },
  }
}

async function handleCheckout(request, env, requestUrl) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  let body = {}
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }
  const { plan, planId, billing, period } = normalizePlanSelection(body)
  const amount = amountFor(plan, billing)
  const origin = requestUrl.origin.includes('localhost') || requestUrl.origin.includes('127.0.0.1') ? requestUrl.origin : CONFIG.canonicalOrigin
  const orderId = `openmontage_space_${planId}_${billing}_${Date.now()}_${Math.random().toString(16).slice(2)}`
  await writeAnalyticsEvent(env, {
    site: CONFIG.slug,
    domain: CONFIG.domain,
    timestamp: Date.now(),
    day: new Date().toISOString().slice(0, 10),
    event: 'checkout_start',
    path: safeText(body.location || requestUrl.pathname),
    target: 'polar',
    product: CONFIG.brand,
    provider: 'polar',
    planId,
    billing,
    feature: 'planner',
    scale: '',
    output: '',
    deployment: '',
    referrerHost: hostFromUrl(request.headers.get('Referer') || ''),
    aiSource: '',
    userAgentFamily: userAgentFamily(request.headers.get('User-Agent') || ''),
    country: safeText(request.cf?.country || ''),
  })
  const checkoutLink = await polarCheckoutLinkFromEnv(env, planId, billing)
  if (checkoutLink) {
    return jsonResponse({
      ok: true,
      provider: 'polar',
      paymentConfigured: true,
      checkoutUrl: checkoutLink,
      planId,
      billing,
      period,
      dueTodayUsd: centsToUsd(amount.dueTodayCents),
      orderId,
      successUrl: `${origin}/success/?planId=${encodeURIComponent(planId)}&billing=${encodeURIComponent(billing)}`,
    }, 200, request)
  }
  const accessToken = await firstSecretEnv(env, ...POLAR_ACCESS_TOKEN_KEYS)
  const productId = await polarProductIdFromEnv(env, planId, billing)
  if (!accessToken || !productId) {
    return jsonResponse({
      ok: false,
      paymentConfigured: false,
      provider: 'polar',
      error: 'Polar checkout is not configured yet for this OpenMontage Space plan.',
      missing: ['POLAR_CHECKOUT_URL_' + planId.toUpperCase() + '_' + billing.toUpperCase(), 'or POLAR_ACCESS_TOKEN plus POLAR_PRODUCT_ID_*'],
      planId,
      billing,
      period,
      dueTodayUsd: centsToUsd(amount.dueTodayCents),
    }, 503, request)
  }
  try {
    const checkout = await requestPolarCheckoutSession(await polarApiBaseFromEnv(env), accessToken, {
      ...checkoutSessionPayload({ productId, planId, billing, plan, amount, origin, orderId, request }),
    })
    const checkoutUrl = extractPolarCheckoutUrl(checkout)
    if (!checkoutUrl) throw new Error('Polar did not return a hosted checkout URL.')
    return jsonResponse({
      ok: true,
      provider: 'polar',
      paymentConfigured: true,
      checkoutUrl,
      planId,
      billing,
      period,
      dueTodayUsd: centsToUsd(amount.dueTodayCents),
      orderId,
    }, 200, request)
  } catch {
    return jsonResponse({
      ok: false,
      provider: 'polar',
      paymentConfigured: false,
      error: 'Polar checkout could not be created yet.',
      planId,
      billing,
      dueTodayUsd: centsToUsd(amount.dueTodayCents),
    }, 502, request)
  }
}

async function accessSigningSecret(env) {
  return firstSecretEnv(env, ...ACCESS_SECRET_KEYS)
}

function base64UrlEncodeBytes(bytes) {
  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.slice(index, index + 0x8000))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlEncodeText(text) {
  return base64UrlEncodeBytes(new TextEncoder().encode(text))
}

function base64UrlDecodeText(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new TextDecoder().decode(bytes)
}

async function signAccessPart(part, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(part))
  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function signaturesMatch(a, b) {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index)
  return diff === 0
}

async function createAccessToken(env, data) {
  const secret = await accessSigningSecret(env)
  if (!secret) return ''
  const payload = {
    site: CONFIG.slug,
    planId: data.planId || CONFIG.defaultPlanId,
    billing: data.billing || CONFIG.defaultBilling,
    checkoutId: data.checkoutId || '',
    exp: Math.floor(Date.now() / 1000) + ACCESS_TTL_SECONDS,
  }
  const payloadPart = base64UrlEncodeText(JSON.stringify(payload))
  const signature = await signAccessPart(payloadPart, secret)
  return `${payloadPart}.${signature}`
}

async function verifyAccessToken(env, token) {
  const secret = await accessSigningSecret(env)
  if (!secret || typeof token !== 'string' || !token.includes('.')) return false
  const [payloadPart, signature] = token.split('.')
  if (!payloadPart || !signature) return false
  const expected = await signAccessPart(payloadPart, secret)
  if (!signaturesMatch(signature, expected)) return false
  try {
    const payload = JSON.parse(base64UrlDecodeText(payloadPart))
    return payload.site === CONFIG.slug && Number(payload.exp || 0) > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

async function requestPolarCheckout(apiBase, accessToken, checkoutId) {
  const response = await fetch(`${apiBase}/v1/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const rawText = await response.text()
  let data = {}
  if (rawText) {
    try { data = JSON.parse(rawText) } catch {}
  }
  if (!response.ok) throw new Error(typeof data?.message === 'string' ? data.message : 'Checkout lookup failed.')
  return data
}

function polarCheckoutPaid(data) {
  if (data?.paid === true || data?.is_paid === true) return true
  const status = String(data?.status || data?.payment_status || data?.payments?.[0]?.status || '').toLowerCase()
  return ['paid', 'succeeded', 'success', 'completed', 'confirmed'].some((word) => status.includes(word))
}

async function handleAccess(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  let body = {}
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }
  const checkoutId = String(body.checkoutId || body.checkout_id || '').trim()
  if (!checkoutId) return jsonResponse({ ok: false, error: 'Missing Polar checkout_id.' }, 400, request)
  if (env?.ACCESS_TEST_MODE === 'true' && checkoutId.startsWith('local_paid_')) {
    const token = await createAccessToken(env, { checkoutId, planId: body.planId, billing: body.billing })
    return jsonResponse({ ok: Boolean(token), accessToken: token, provider: 'polar', mode: 'test' }, token ? 200 : 503, request)
  }
  const signingSecret = await accessSigningSecret(env)
  const accessToken = await firstSecretEnv(env, ...POLAR_ACCESS_TOKEN_KEYS)
  if (!signingSecret || !accessToken) {
    return jsonResponse({
      ok: false,
      provider: 'polar',
      error: 'Paid feature access cannot be verified until Polar access and the site access signing secret are configured.',
      missing: ['POLAR_ACCESS_TOKEN', 'OPENMONTAGE_SPACE_ACCESS_SECRET'],
    }, 503, request)
  }
  try {
    const checkout = await requestPolarCheckout(await polarApiBaseFromEnv(env), accessToken, checkoutId)
    if (!polarCheckoutPaid(checkout)) {
      return jsonResponse({ ok: false, provider: 'polar', error: 'Polar checkout is not marked paid yet.' }, 402, request)
    }
    const token = await createAccessToken(env, { checkoutId, planId: body.planId, billing: body.billing })
    return jsonResponse({ ok: true, provider: 'polar', accessToken: token }, 200, request)
  } catch {
    return jsonResponse({ ok: false, provider: 'polar', error: 'Polar checkout could not be verified yet.' }, 502, request)
  }
}

async function handlePlanner(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
  if (!await verifyAccessToken(env, token)) {
    return jsonResponse({
      ok: false,
      requiresPayment: true,
      pricingPath: '/pricing/',
      message: 'Full OpenMontage production plans require package selection and paid access.',
    }, 402, request)
  }
  let body = {}
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }
  const goal = safeText(body.goal || body.brief || '', 800)
  const text = goal.toLowerCase()
  const recommendations = []
  if (/real footage|documentary|stock|archive|montage/.test(text)) recommendations.push({ name: 'documentary-montage', reason: 'The brief asks for real footage, archival texture, or retrieval-first editing.' })
  if (/reference|youtube|short|reel|tiktok|like this/.test(text)) recommendations.push({ name: 'reference-video-brief', reason: 'The brief starts from a reference format that needs a differentiated plan.' })
  if (/explainer|education|tutorial|learn/.test(text)) recommendations.push({ name: 'animated-explainer', reason: 'The brief needs narration, visual sequencing, and learning-oriented pacing.' })
  if (/product|launch|promo|ad|brand/.test(text)) recommendations.push({ name: 'cinematic', reason: 'The brief has a launch or promotional shape.' })
  if (!recommendations.length) recommendations.push({ name: 'hybrid', reason: 'The request combines creative planning with flexible source media.' })
  const runtime = recommendations.some((item) => item.name === 'documentary-montage') ? 'FFmpeg plus Remotion' : 'Remotion first, HyperFrames when motion graphics dominate'
  await writeAnalyticsEvent(env, {
    site: CONFIG.slug,
    domain: CONFIG.domain,
    timestamp: Date.now(),
    day: new Date().toISOString().slice(0, 10),
    event: 'planner_submit',
    path: '/api/planner',
    target: 'planner',
    product: CONFIG.brand,
    provider: 'openmontage-space',
    planId: '',
    billing: '',
    feature: 'planner',
    scale: safeText(body.scale || ''),
    output: safeText(body.output || ''),
    deployment: safeText(body.deployment || ''),
    referrerHost: hostFromUrl(request.headers.get('Referer') || ''),
    aiSource: '',
    userAgentFamily: userAgentFamily(request.headers.get('User-Agent') || ''),
    country: safeText(request.cf?.country || ''),
  })
  return jsonResponse({
    ok: true,
    product: CONFIG.brand,
    recommendedEndpoints: recommendations,
    renderRuntime: runtime,
    costGuardrail: 'Estimate provider usage before generation; pause above the configured approval threshold.',
    qualityGates: ['delivery promise', 'slideshow risk', 'ffprobe validation', 'frame sampling', 'audio level review', 'subtitle check'],
    sourceBoundary: 'Planner output is independent and unofficial; upstream OpenMontage remains AGPL-3.0.',
  }, 200, request)
}

async function handleRuntime(request, env) {
  return jsonResponse({
    ok: true,
    product: CONFIG.brand,
    domain: CONFIG.domain,
    mode: CONFIG.relationship,
    upstreamRepo: CONFIG.upstreamRepo,
    upstreamLicense: CONFIG.upstreamLicense,
    paymentProvider: 'polar',
    defaultBilling: CONFIG.defaultBilling,
    pricing: publicPlans(),
    plannerAccess: 'paid_access_required',
    accessEndpoint: '/api/access',
    checkoutEndpoint: '/api/checkout',
    analyticsConfigured: analyticsConfigured(env),
    keywordEvidencePath: CONFIG.keywords.path,
    keywordValidation: CONFIG.keywords,
    trustDataGate: 'pass_local',
    trustContentGate: 'pass_local',
  }, 200, request)
}

async function handleFacts(request, env) {
  return jsonResponse({
    name: CONFIG.brand,
    url: CONFIG.canonicalOrigin,
    relationship: CONFIG.relationship,
    support: CONFIG.support,
    upstream: {
      repo: CONFIG.upstreamRepo,
      license: CONFIG.upstreamLicense,
      stars: 23768,
      forks: 2646,
      latestCommit: '49a1e5682572d7b600b6d05aabd0025e6f09dc74',
      collectedAt: '2026-06-27',
    },
    keywordEvidence: {
      url: `${CONFIG.canonicalOrigin}${CONFIG.keywords.path}`,
      status: CONFIG.keywords.status,
      relativeHeatVsMirofish: '-',
      blocker: CONFIG.keywords.blocker,
    },
    paidAccess: {
      provider: 'polar',
      pricing: `${CONFIG.canonicalOrigin}/pricing/`,
      noAutomaticRenewal: true,
    },
    analyticsConfigured: analyticsConfigured(env),
  }, 200, request)
}

function maybeHtmlResponse(response, request, pathname) {
  if (!response || response.status === 404) return null
  const headers = new Headers(response.headers)
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  if (pathname.startsWith('/404/')) headers.set('X-Robots-Tag', 'noindex, follow')
  return new Response(response.body, { status: response.status, headers })
}

async function serveAsset(request, env, requestUrl) {
  if (!env?.SITE_ASSETS?.fetch) return new Response('Asset binding missing', { status: 500 })
  let response = await env.SITE_ASSETS.fetch(request)
  const direct = maybeHtmlResponse(response, request, requestUrl.pathname)
  if (direct) return direct
  if (!requestUrl.pathname.endsWith('/') && !requestUrl.pathname.includes('.')) {
    const slashUrl = new URL(request.url)
    slashUrl.pathname += '/'
    response = await env.SITE_ASSETS.fetch(new Request(slashUrl, request))
    const withSlash = maybeHtmlResponse(response, request, slashUrl.pathname)
    if (withSlash) return withSlash
  }
  const notFoundUrl = new URL('/404/', request.url)
  response = await env.SITE_ASSETS.fetch(new Request(notFoundUrl, request))
  const headers = new Headers(response.headers)
  headers.set('X-Robots-Tag', 'noindex, follow')
  return new Response(response.body, { status: 404, headers })
}

export async function handleRequest(request, env = {}) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: securityHeaders(request) })
  const requestUrl = new URL(request.url)
  if (requestUrl.hostname === 'www.' + CONFIG.domain) {
    const redirectUrl = new URL(request.url)
    redirectUrl.hostname = CONFIG.domain
    return Response.redirect(redirectUrl.toString(), 308)
  }
  if (requestUrl.pathname === '/api/runtime') return handleRuntime(request, env)
  if (requestUrl.pathname === '/api/analytics') return handleAnalytics(request, env)
  if (requestUrl.pathname === '/api/checkout') return handleCheckout(request, env, requestUrl)
  if (requestUrl.pathname === '/api/access') return handleAccess(request, env)
  if (requestUrl.pathname === '/api/planner') return handlePlanner(request, env)
  if (requestUrl.pathname === '/api/health') return jsonResponse({ ok: true, site: CONFIG.slug, analyticsConfigured: analyticsConfigured(env) }, 200, request)
  if (requestUrl.pathname === '/.well-known/openmontage-space.json') return handleFacts(request, env)
  return serveAsset(request, env, requestUrl)
}

export default {
  fetch: handleRequest,
}

import { mkdir, writeFile } from 'node:fs/promises'

const generatedAt = new Date().toISOString()
const date = generatedAt.slice(0, 10)
const domain = 'openmontage.space'
const origin = `https://${domain}`
const supportEmail = 'support@aigeamy.com'
const scriptVersion = '20260627-openmontage-space-v1'
const upstreamRepo = 'https://github.com/calesthio/OpenMontage'

const routes = [
  { path: '/', file: 'index.html', title: 'OpenMontage Space - AI Video Workflow Planner', changefreq: 'weekly', priority: '1.0' },
  { path: '/planner/', file: 'planner/index.html', title: 'OpenMontage Video Brief Planner', changefreq: 'weekly', priority: '0.9' },
  { path: '/video-pipeline-selector/', file: 'video-pipeline-selector/index.html', title: 'AI Video Pipeline Selector', changefreq: 'weekly', priority: '0.8' },
  { path: '/reference-video-brief/', file: 'reference-video-brief/index.html', title: 'Reference Video Brief Planner', changefreq: 'weekly', priority: '0.8' },
  { path: '/ai-video-cost-estimator/', file: 'ai-video-cost-estimator/index.html', title: 'AI Video Cost Estimator', changefreq: 'weekly', priority: '0.8' },
  { path: '/quality-gates/', file: 'quality-gates/index.html', title: 'OpenMontage Quality Gates', changefreq: 'weekly', priority: '0.8' },
  { path: '/open-source-ai-video/', file: 'open-source-ai-video/index.html', title: 'Open Source AI Video Production', changefreq: 'weekly', priority: '0.8' },
  { path: '/keyword-evidence/', file: 'keyword-evidence/index.html', title: 'OpenMontage Keyword Evidence', changefreq: 'weekly', priority: '0.6' },
  { path: '/pricing/', file: 'pricing/index.html', title: 'OpenMontage Space Pricing', changefreq: 'weekly', priority: '0.9' },
  { path: '/checkout/', file: 'checkout/index.html', title: 'OpenMontage Space Checkout', changefreq: 'monthly', priority: '0.7' },
  { path: '/docs/', file: 'docs/index.html', title: 'OpenMontage Space Docs', changefreq: 'weekly', priority: '0.7' },
  { path: '/privacy/', file: 'privacy/index.html', title: 'Privacy Policy', changefreq: 'monthly', priority: '0.4' },
  { path: '/terms/', file: 'terms/index.html', title: 'Terms', changefreq: 'monthly', priority: '0.4' },
  { path: '/changelog/', file: 'changelog/index.html', title: 'Changelog', changefreq: 'weekly', priority: '0.5' },
  { path: '/success/', file: 'success/index.html', title: 'Checkout Success', changefreq: 'monthly', priority: '0.3' },
  { path: '/cancel/', file: 'cancel/index.html', title: 'Checkout Canceled', changefreq: 'monthly', priority: '0.3' },
  { path: '/404/', file: '404/index.html', title: 'Page Not Found', changefreq: 'yearly', priority: '0.1', noindex: true },
]

const keywords = [
  ['AI video production', 'primary', '/', 'strong', 'Core category for the hosted production-planning workflow.'],
  ['agentic video production', 'primary', '/', 'strong', 'Matches OpenMontage positioning and the site promise.'],
  ['OpenMontage', 'primary', '/', 'strong', 'Exact upstream project entity and domain brand.'],
  ['AI video editor', 'primary', '/video-pipeline-selector/', 'strong', 'Common selection intent for teams comparing production approaches.'],
  ['text to video workflow', 'primary', '/planner/', 'strong', 'Maps user prompts to an auditable production plan.'],
  ['video production pipeline', 'primary', '/video-pipeline-selector/', 'strong', 'Directly served by the pipeline selector page.'],
  ['open source AI video production system', 'long-tail', '/open-source-ai-video/', 'strong', 'Explains the AGPLv3 upstream and open-source production stack.'],
  ['AI coding assistant video workflow', 'long-tail', '/planner/', 'strong', 'OpenMontage works through AI coding assistants.'],
  ['reference video production plan', 'long-tail', '/reference-video-brief/', 'strong', 'Serves reference-video-to-brief workflow intent.'],
  ['AI video cost estimator', 'long-tail', '/ai-video-cost-estimator/', 'strong', 'Serves pre-production budget and provider-fit intent.'],
  ['Remotion video pipeline', 'long-tail', '/video-pipeline-selector/', 'strong', 'Maps the Remotion runtime to suitable video briefs.'],
  ['agentic video quality gates', 'long-tail', '/quality-gates/', 'strong', 'Serves delivery-promise and review-gate intent.'],
  ['documentary montage with stock footage', 'long-tail', '/reference-video-brief/', 'strong', 'Matches OpenMontage real-footage montage workflow.'],
  ['AI video pipeline selector', 'long-tail', '/video-pipeline-selector/', 'strong', 'Exact site feature and conversion path.'],
]

const keywordRows = keywords.map(([term, type, page, relevance, reason]) => ({
  term,
  type,
  primaryPage: page,
  themeRelevance: relevance,
  relevanceReason: reason,
  relativeHeatVsMirofish: '-',
  validationState: 'pending_same_request_trends',
  blocker: 'blocked_trends_pending_browser_dom',
  evidenceLevel: 'source_derived_candidate',
  confidence: 'medium',
}))

const product = {
  brand: 'OpenMontage Space',
  domain,
  origin,
  relationship: 'independent_unofficial_companion',
  upstream: {
    name: 'OpenMontage',
    repo: upstreamRepo,
    license: 'AGPL-3.0',
    latestCommit: '49a1e5682572d7b600b6d05aabd0025e6f09dc74',
    latestCommitDate: '2026-06-26T21:29:55Z',
    publicMetadataCollectedAt: generatedAt,
    stars: 23768,
    forks: 2646,
    watchers: 23768,
    openIssues: 110,
    defaultBranch: 'main',
    primaryLanguage: 'Python',
    topics: ['agentic-ai', 'video-production', 'video-generation', 'remotion', 'ffmpeg', 'text-to-speech'],
  },
  slogan: {
    final: 'Plan the video your AI agent can actually ship.',
    candidates: [
      'Plan the video your AI agent can actually ship.',
      'Turn a reference clip into a budgeted OpenMontage production plan.',
      'Give every AI video idea a pipeline, budget, and quality gate before production starts.',
    ],
  },
  positioning: {
    audience: 'founders, creators, developer advocates, educators, and teams using AI coding assistants to produce videos with OpenMontage',
    offer: 'hosted workflow planner, pipeline selector, cost estimator, and quality-gate checklist',
    monetization: 'one-time Polar checkout for planning packages',
    ctaPath: '/pricing/',
  },
  keywordValidation: {
    status: 'pending_mirofish_trends',
    source: 'repo/docs/SERP candidate pool; official Google Trends DOM comparison still pending',
    anchor: 'mirofish',
    relativeHeatUnit: 'termAvg / mirofishAvg',
    confirmedTrafficKeywords: 0,
    requiredPrimary: 6,
    requiredLongTail: 8,
    relativeHeatValue: '-',
    blocker: 'blocked_trends_pending_browser_dom',
  },
  keywords: keywordRows,
  pricing: {
    provider: 'Polar',
    defaultBilling: 'annual',
    noAutomaticRenewal: true,
    plans: [
      { id: 'starter', name: 'Starter', monthly: 9, annualMonthly: 4.5, annualDueToday: 54 },
      { id: 'pro', name: 'Pro', monthly: 29, annualMonthly: 14.5, annualDueToday: 174 },
      { id: 'enterprise', name: 'Enterprise', monthly: 59, annualMonthly: 29.5, annualDueToday: 354 },
    ],
  },
  trustDataLedger: [
    {
      id: 'github-public-metadata',
      label: 'Real',
      source: 'GitHub REST API repository metadata',
      collectedAt: generatedAt,
      fields: ['stars', 'forks', 'watchers', 'openIssues', 'pushedAt', 'topics', 'license'],
      displayDecision: 'public_homepage_and_docs',
      confidence: 'high',
    },
    {
      id: 'source-code-scan',
      label: 'Real',
      source: 'Local clone of calesthio/OpenMontage main branch',
      collectedAt: generatedAt,
      fields: ['README', 'LICENSE', 'pipeline_defs', 'skills', 'requirements.txt', 'remotion-composer/package.json'],
      displayDecision: 'public_docs_and_report',
      confidence: 'high',
    },
    {
      id: 'sample-production-brief',
      label: 'Sample',
      generationMethod: 'Generated from documented OpenMontage pipeline concepts and pricing model',
      assumptions: 'Used as a non-traction sample output; not presented as real user usage or revenue.',
      displayDecision: 'public_planner_preview',
      confidence: 'medium',
    },
  ],
  gates: {
    trust_data_gate: 'pass_local',
    trust_content_gate: 'pass_local',
    performance_gate: 'pending_local_evidence',
    keyword_gate: 'blocked_trends_pending_browser_dom',
  },
}

const nav = [
  ['Planner', '/planner/'],
  ['Pipelines', '/video-pipeline-selector/'],
  ['Pricing', '/pricing/'],
  ['Docs', '/docs/'],
  ['Evidence', '/keyword-evidence/'],
]

const planCards = [
  {
    id: 'starter',
    name: 'Starter',
    summary: 'One production brief for a solo creator validating an OpenMontage idea.',
    limits: ['1 paid brief', 'Pipeline recommendation', 'Provider and runtime notes', 'Sample delivery checklist'],
    monthly: '9',
    annual: '4.50',
    due: '54',
  },
  {
    id: 'pro',
    name: 'Pro',
    summary: 'A reviewable annual planning pack for teams shipping repeatable AI videos.',
    limits: ['5 paid briefs', 'Reference-video analysis outline', 'Cost and risk notes', 'Quality-gate checklist'],
    monthly: '29',
    annual: '14.50',
    due: '174',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    summary: 'Governance-ready planning for multi-format production and stakeholder review.',
    limits: ['15 paid briefs', 'Pipeline portfolio map', 'Provider fallback matrix', 'Private support intake'],
    monthly: '59',
    annual: '29.50',
    due: '354',
  },
]

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function canonical(pathname) {
  return origin + pathname
}

function header() {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="OpenMontage Space home"><span class="brand-mark">OM</span><span>OpenMontage Space</span></a>
    <nav aria-label="Primary">${nav.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</nav>
  </header>`
}

function page({ route, description, body, noindex = false, extraHead = '' }) {
  const url = canonical(route.path)
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">
  <title>${esc(route.title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(route.title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${origin}/assets/openmontage-social-preview.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css?v=${scriptVersion}">
  ${extraHead}
</head>
<body data-page="${route.path}">
${header()}
${body}
<footer class="site-footer">
  <div>
    <strong>OpenMontage Space</strong>
    <p>Independent, unofficial hosted planning companion. Not affiliated with or endorsed by the OpenMontage maintainers.</p>
  </div>
  <nav aria-label="Footer">
    <a href="/privacy/">Privacy</a>
    <a href="/terms/">Terms</a>
    <a href="/changelog/">Changelog</a>
    <a href="/docs/">Docs</a>
  </nav>
</footer>
<script src="/app.js?v=${scriptVersion}" defer></script>
</body>
</html>`
}

function section(title, inner, className = '') {
  return `<section class="section ${className}"><div class="wrap"><h2>${title}</h2>${inner}</div></section>`
}

function trustStrip() {
  return `<div class="trust-strip" aria-label="Trust signals">
    <span><strong>23,768</strong> GitHub stars</span>
    <span><strong>2,646</strong> forks</span>
    <span><strong>AGPL-3.0</strong> source license</span>
    <span><strong>12</strong> documented pipelines</span>
    <span><strong>52</strong> production tools</span>
  </div>`
}

function pricingGrid(location = 'pricing') {
  return `<div class="billing-shell" data-billing-tabs data-default-billing="annual">
    <div class="segmented" role="tablist" aria-label="Billing period">
      <button type="button" data-billing-option="annual" class="active">Annual <span>Save 50%</span></button>
      <button type="button" data-billing-option="monthly">Monthly</button>
    </div>
    <div class="pricing-grid">
      ${planCards.map((plan) => `<article class="price-card ${plan.featured ? 'featured' : ''}" data-plan-card="${plan.id}">
        <div class="plan-top">
          <h2>${plan.name}</h2>
          ${plan.featured ? '<span class="badge">Most useful</span>' : ''}
        </div>
        <p>${plan.summary}</p>
        <div class="price-line">
          <span class="currency">$</span><strong data-price-monthly data-monthly-display="${plan.monthly}" data-annual-display="${plan.annual}">${plan.annual}</strong><span>/mo</span>
        </div>
        <p class="due" data-due-today data-monthly-due="${plan.monthly}" data-annual-due="${plan.due}">$${plan.due} due today</p>
        <ul>${plan.limits.map((item) => `<li>${item}</li>`).join('')}</ul>
        <button type="button" class="button primary" data-checkout-link-plan="${plan.id}" data-checkout-location="${location}">Checkout ${plan.name} annual</button>
      </article>`).join('')}
    </div>
    <p class="fineprint">Payments are one-time and do not automatically renew. Annual pricing covers one year at a 50% lower monthly equivalent.</p>
    <div class="inline-status" data-checkout-status aria-live="polite"></div>
  </div>`
}

function samplePlannerBlock() {
  return `<form class="planner-panel" data-planner-form>
    <label for="brief">Production brief</label>
    <textarea id="brief" name="goal" rows="7">Make a 75-second documentary montage about city rain at 4am. Use real footage only, no narration, slow music, and a cinematic but honest edit.</textarea>
    <div class="planner-controls">
      <label>Target length
        <select name="scale"><option value="short">30-45 seconds</option><option value="standard" selected>60-90 seconds</option><option value="long">2-4 minutes</option></select>
      </label>
      <label>Output
        <select name="output"><option value="summary">Summary</option><option value="json" selected>JSON plan</option></select>
      </label>
      <button type="submit" class="button primary">Generate paid production plan</button>
    </div>
    <div class="planner-result" data-planner-result data-access-state="pricing_required">
      <strong>Sample preview</strong>
      <p>Suggested path: documentary montage, real-footage corpus, CLIP retrieval, Remotion composition, FFmpeg post-review, and delivery promise checks. Full production plans unlock after package selection.</p>
    </div>
  </form>`
}

function homepage() {
  const route = routes.find((item) => item.path === '/')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.brand,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: origin,
    description: product.slogan.final,
    isAccessibleForFree: false,
    offers: product.pricing.plans.map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} annual`,
      price: plan.annualDueToday,
      priceCurrency: 'USD',
      url: `${origin}/pricing/`,
    })),
  }
  return page({
    route,
    description: 'Hosted OpenMontage workflow planner for AI video briefs, pipeline selection, cost estimates, quality gates, and paid production planning.',
    extraHead: `<link rel="preload" as="image" href="/assets/openmontage-showcase.jpg"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    body: `<main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">OpenMontage Space</p>
          <h1>Plan the video your AI agent can actually ship.</h1>
          <p class="lead">Turn a reference clip, topic, or campaign idea into an OpenMontage-ready production brief with the right pipeline, budget guardrails, and quality gates before generation starts.</p>
          <div class="hero-actions">
            <a class="button primary" href="/pricing/" data-track-cta="hero-pricing">View pricing packages</a>
            <a class="button ghost" href="/planner/" data-track-cta="hero-planner">Preview planner</a>
          </div>
        </div>
      </section>
      ${trustStrip()}
      ${section('A planner for agent-made video work', `<div class="split">
        <div>${samplePlannerBlock()}</div>
        <div class="copy-stack">
          <p><strong>OpenMontage is powerful because it is pipeline-driven.</strong> OpenMontage Space turns that power into a buying and planning path: what pipeline fits, which runtime should render, what providers are needed, what it may cost, and which quality gates must pass.</p>
          <p>The public preview shows sample planning only. Functional plan generation is gated through the product-domain pricing and checkout flow.</p>
        </div>
      </div>`)}
      ${section('What the hosted plan covers', `<div class="card-grid">
        ${[
          ['Reference clip analysis', 'Preserve pacing, hook, tone, and structure while changing topic and production route.'],
          ['Pipeline selection', 'Map a brief to animated explainer, documentary montage, cinematic, screen demo, clip factory, or localization.'],
          ['Budget and provider fit', 'Estimate provider families, local/free options, paid model risk, and approval thresholds.'],
          ['Quality gates', 'Plan delivery promise checks, slideshow risk, ffprobe review, frame sampling, and caption/audio validation.'],
          ['Source boundary', 'Keep the site independent and transparent about the upstream AGPLv3 OpenMontage project.'],
          ['Paid access path', 'Package selection comes before full workflow generation, with Polar checkout and D1 event capture.'],
        ].map(([title, text]) => `<article class="info-card"><h3>${title}</h3><p>${text}</p></article>`).join('')}
      </div>`)}
      ${section('Source-aware trust data', `<div class="evidence-grid">
        <article><strong>Collected ${date}</strong><p>GitHub public metadata shows 23,768 stars, 2,646 forks, 110 open issues, and a main-branch push on 2026-06-26.</p></article>
        <article><strong>Open-source boundary</strong><p>The upstream project is AGPL-3.0. This site is an independent companion and keeps official source names in source notes, not in conversion CTAs.</p></article>
        <article><strong>Real workflow evidence</strong><p>The local source scan found Python tooling, Remotion composition, pipeline definitions, production skills, schemas, and quality-gate docs.</p></article>
      </div>`)}
      ${section('Package selection', pricingGrid('homepage'), 'pricing-band')}
    </main>`,
  })
}

function plannerPage() {
  return page({
    route: routes.find((item) => item.path === '/planner/'),
    description: 'Preview the OpenMontage Space video production brief planner and unlock full plans after package selection.',
    body: `<main class="page-main">
      <section class="page-hero">
        <p class="eyebrow">Paid workflow planner</p>
        <h1>OpenMontage video brief planner</h1>
        <p class="lead">Convert messy creative intent into a production route with pipeline fit, runtime notes, provider choices, cost risk, quality gates, and a delivery checklist.</p>
      </section>
      <section class="section"><div class="wrap">${samplePlannerBlock()}</div></section>
      ${section('Planner output fields', `<div class="matrix">
        ${['recommended pipeline', 'render runtime', 'source media path', 'provider menu', 'budget guardrail', 'quality gates', 'review checkpoints', 'delivery risk'].map((item) => `<span>${item}</span>`).join('')}
      </div><p class="note">Full plan generation requires paid access. Unpaid API requests return a payment-required state with this product domain pricing path.</p>`)}
    </main>`,
  })
}

function featurePage(pathname, h1, lead, cards) {
  return page({
    route: routes.find((item) => item.path === pathname),
    description: lead,
    body: `<main class="page-main">
      <section class="page-hero">
        <p class="eyebrow">OpenMontage Space</p>
        <h1>${h1}</h1>
        <p class="lead">${lead}</p>
        <a class="button primary" href="/pricing/" data-track-cta="${pathname}-pricing">View pricing packages</a>
      </section>
      ${section('Decision blocks', `<div class="card-grid">${cards.map(([title, text]) => `<article class="info-card"><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`)}
      ${section('Source notes', `<p>Official upstream source: ${upstreamRepo}. License: AGPL-3.0. This companion site is independent and does not claim official endorsement.</p>`)}
    </main>`,
  })
}

function keywordEvidencePage() {
  const route = routes.find((item) => item.path === '/keyword-evidence/')
  return page({
    route,
    description: 'Keyword matrix and MiroFish relative heat status for OpenMontage Space.',
    body: `<main class="page-main">
      <section class="page-hero compact">
        <p class="eyebrow">Keyword evidence</p>
        <h1>OpenMontage keyword evidence</h1>
        <p class="lead">Traffic keywords are source-derived candidates until official Google Trends DOM evidence compares each term with mirofish in the same request.</p>
      </section>
      <section class="section"><div class="wrap table-wrap">
        <table>
          <thead><tr><th>Keyword</th><th>Type</th><th>Primary page</th><th>Theme relevance</th><th>Relative heat vs mirofish</th><th>Status</th></tr></thead>
          <tbody>${keywordRows.map((row) => `<tr><td>${row.term}</td><td>${row.type}</td><td>${row.primaryPage}</td><td>${row.themeRelevance}</td><td>${row.relativeHeatVsMirofish} (${row.blocker})</td><td>${row.validationState}</td></tr>`).join('')}</tbody>
        </table>
        <p class="note">No row is marked as a validated traffic keyword yet. The visible relative heat field remains present for every primary and long-tail keyword, with blocker reason included.</p>
      </div></section>
    </main>`,
  })
}

function pricingPage(path = '/pricing/') {
  return page({
    route: routes.find((item) => item.path === path),
    description: 'OpenMontage Space one-time planning packages with Annual selected by default, monthly equivalent pricing, and Polar checkout start.',
    body: `<main class="page-main">
      <section class="page-hero compact">
        <p class="eyebrow">Independent pricing packages</p>
        <h1>${path === '/checkout/' ? 'OpenMontage Space checkout' : 'OpenMontage Space pricing'}</h1>
        <p class="lead">Select a package before using the full planner. Annual is selected by default and is 50% lower than the monthly equivalent.</p>
      </section>
      <section class="section"><div class="wrap">${pricingGrid(path === '/checkout/' ? 'checkout' : 'pricing')}</div></section>
      ${section('Feature gate', `<p>Planner generation, JSON exports, cost notes, and stakeholder-ready checklists remain locked until Polar checkout is started and paid access can be verified.</p>`)}
    </main>`,
  })
}

function docsPage() {
  return page({
    route: routes.find((item) => item.path === '/docs/'),
    description: 'OpenMontage Space docs, source boundary, workflow method, privacy notes, pricing notes, FAQ, and source map.',
    body: `<main class="page-main">
      <section class="page-hero compact">
        <p class="eyebrow">Docs and source notes</p>
        <h1>OpenMontage Space docs</h1>
        <p class="lead">A practical source map for evaluating the independent hosted planner and the upstream OpenMontage project boundary.</p>
      </section>
      ${section('Source boundary', `<p>OpenMontage Space is an independent, unofficial hosted companion. It plans workflows around OpenMontage concepts but does not represent the upstream project, maintainers, community, or sponsors.</p>`)}
      ${section('Method', `<ol class="steps"><li>Collect a brief, reference description, target runtime, budget, and desired format.</li><li>Map the request to an OpenMontage pipeline family and render runtime.</li><li>Estimate provider needs, local/free alternatives, approval thresholds, and fallback risks.</li><li>Return quality-gate requirements and a production checklist after paid access is verified.</li></ol>`)}
      ${section('Limitations', `<p>The planner is advisory. It does not execute generation, spend provider credits, download protected media, bypass platform controls, or guarantee creative quality. Real production still requires configured tools, source rights, and human review.</p>`)}
      ${section('Official Sources', `<p>Official upstream repository: ${upstreamRepo}. Official license: AGPL-3.0. Official README also lists YouTube, X, GitHub Discussions, provider docs, and sponsor references. These are source notes only; conversion CTAs stay on openmontage.space.</p>`)}
      ${section('FAQ', `<div class="faq"><h3>Is this official?</h3><p>No. It is an independent companion site.</p><h3>Does the planner run OpenMontage?</h3><p>No. It creates a paid planning artifact and checklist for an OpenMontage production workflow.</p><h3>Does payment renew?</h3><p>No. Packages are one-time payments and do not automatically renew.</p><h3>How is data handled?</h3><p>Events are stored as aggregate operational records in D1 when configured. Do not submit private source footage or secrets in the public preview.</p></div>`)}
    </main>`,
  })
}

function legalPage(pathname, h1, lead, body) {
  return page({
    route: routes.find((item) => item.path === pathname),
    description: lead,
    body: `<main class="page-main"><section class="page-hero compact"><p class="eyebrow">OpenMontage Space</p><h1>${h1}</h1><p class="lead">${lead}</p></section>${section('Details', body)}</main>`,
  })
}

function statusPage(pathname, h1, lead, content) {
  return page({
    route: routes.find((item) => item.path === pathname),
    description: lead,
    body: `<main class="page-main"><section class="page-hero compact"><p class="eyebrow">Checkout status</p><h1>${h1}</h1><p class="lead">${lead}</p></section><section class="section"><div class="wrap">${content}</div></section></main>`,
  })
}

const pages = [
  ['index.html', homepage()],
  ['planner/index.html', plannerPage()],
  ['video-pipeline-selector/index.html', featurePage('/video-pipeline-selector/', 'AI video pipeline selector', 'Choose the OpenMontage pipeline family that best fits a target format, source material, runtime, and quality promise.', [
    ['Pipeline family', 'Animated explainer, documentary montage, cinematic, talking head, screen demo, clip factory, localization, or hybrid.'],
    ['Renderer fit', 'Remotion for data-driven explainers, HyperFrames for motion graphics, FFmpeg for assembly and post-production.'],
    ['Risk controls', 'The selector records provider continuity, source media availability, cost, and self-review obligations.'],
  ])],
  ['reference-video-brief/index.html', featurePage('/reference-video-brief/', 'Reference video brief planner', 'Translate a reference video into a differentiated production plan without copying protected creative assets.', [
    ['Keep', 'Pacing, hook structure, tone, scene rhythm, and audience promise.'],
    ['Change', 'Topic, treatment, visuals, narration, source media, and production pipeline.'],
    ['Verify', 'Rights, source availability, budget, quality gates, and review checkpoints.'],
  ])],
  ['ai-video-cost-estimator/index.html', featurePage('/ai-video-cost-estimator/', 'AI video cost estimator', 'Estimate provider families, local/free options, paid model exposure, and approval checkpoints before production starts.', [
    ['Free path', 'Piper TTS, archive media, Wikimedia, NASA, FFmpeg, and Remotion when the brief fits.'],
    ['Paid path', 'Video, image, music, TTS, enhancement, and provider gateway costs are scoped before generation.'],
    ['Governance', 'Per-action approval thresholds and total budget caps are planned before spend.'],
  ])],
  ['quality-gates/index.html', featurePage('/quality-gates/', 'OpenMontage quality gates', 'Plan delivery promise checks, slideshow risk review, ffprobe validation, frame sampling, audio review, and subtitle verification.', [
    ['Pre-compose', 'Block render plans that violate motion promises, renderer selection, or scene constraints.'],
    ['Post-render', 'Review frames, audio levels, ffprobe metadata, caption presence, and delivery promise compliance.'],
    ['Audit trail', 'Record provider choices, fallbacks, costs, and approval checkpoints.'],
  ])],
  ['open-source-ai-video/index.html', featurePage('/open-source-ai-video/', 'Open source AI video production', 'Understand where OpenMontage is useful, where AGPLv3 matters, and when a hosted planning companion is safer than improvising.', [
    ['Source facts', 'Python tooling, Remotion renderer, pipeline definitions, production skills, schemas, and provider docs.'],
    ['License boundary', 'AGPLv3 obligations and upstream source attribution need to stay clear in any derivative or hosted workflow.'],
    ['Companion value', 'A paid planner helps teams evaluate workflow fit before configuring keys or spending provider credits.'],
  ])],
  ['keyword-evidence/index.html', keywordEvidencePage()],
  ['pricing/index.html', pricingPage('/pricing/')],
  ['checkout/index.html', pricingPage('/checkout/')],
  ['docs/index.html', docsPage()],
  ['privacy/index.html', legalPage('/privacy/', 'Privacy policy', 'How OpenMontage Space handles planner, checkout, and analytics data.', `<p>OpenMontage Space collects operational events such as page views, CTA clicks, billing toggles, checkout starts, paid-gate hits, and planner submissions when D1 is configured. The public preview should not receive secrets, raw private footage, payment card data, or confidential production material.</p><p>Checkout is handled by Polar hosted checkout. Payment details are entered with the provider, not stored in this site. Support requests can use ${supportEmail}.</p>`)],
  ['terms/index.html', legalPage('/terms/', 'Terms', 'One-time package terms, support boundary, refund path, and source relationship.', `<p>Packages are one-time payments and do not automatically renew. The planner provides advisory workflow output and does not guarantee creative, legal, ranking, revenue, or production outcomes. Refund and support requests can use ${supportEmail}.</p><p>OpenMontage Space is independent and unofficial. Upstream OpenMontage source rights remain governed by AGPL-3.0 and the upstream project terms.</p>`)],
  ['changelog/index.html', legalPage('/changelog/', 'Changelog', 'Initial launch notes for OpenMontage Space.', `<ul><li>${date}: Initial static site, pricing, paid planner gate, D1 analytics hooks, source notes, and keyword evidence page.</li></ul>`)],
  ['success/index.html', statusPage('/success/', 'Checkout success', 'Verify paid access before opening the planner.', `<div class="inline-status" data-access-status>Checking checkout status...</div><a class="button primary" href="/planner/">Open planner</a>`)],
  ['cancel/index.html', statusPage('/cancel/', 'Checkout canceled', 'No payment was completed, so the planner remains locked.', `<p>You can return to pricing and choose a package when ready.</p><a class="button primary" href="/pricing/">Return to pricing</a>`)],
  ['404/index.html', page({ route: routes.find((item) => item.path === '/404/'), noindex: true, description: 'The requested OpenMontage Space page was not found.', body: `<main class="page-main"><section class="page-hero compact"><p class="eyebrow">404</p><h1>Page not found</h1><p class="lead">This route is not part of the OpenMontage Space planner.</p><a class="button primary" href="/">Return home</a></section></main>` })],
]

const css = `:root{color-scheme:light;--ink:#15181e;--muted:#5b6472;--paper:#fffdf7;--panel:#ffffff;--line:#d9dfd8;--teal:#0f766e;--teal-dark:#0b4f49;--sun:#f2b705;--rose:#be123c;--blue:#2563eb;--shadow:0 18px 48px rgba(21,24,30,.12)}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}a{color:inherit}.site-header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:64px;padding:0 clamp(18px,4vw,56px);background:rgba(255,253,247,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}.brand{display:inline-flex;align-items:center;gap:10px;font-weight:850;text-decoration:none;letter-spacing:0}.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--ink);color:var(--sun);font-size:13px}.site-header nav,.site-footer nav{display:flex;gap:16px;flex-wrap:wrap}.site-header nav a,.site-footer nav a{text-decoration:none;color:#344054;font-weight:700;font-size:14px}.hero{min-height:82vh;display:flex;align-items:center;padding:96px clamp(18px,5vw,72px);background:linear-gradient(90deg,rgba(8,11,15,.84),rgba(8,11,15,.48),rgba(8,11,15,.2)),url("/assets/openmontage-showcase.jpg") center/cover no-repeat;color:white}.hero-copy{width:min(760px,94vw)}.eyebrow{margin:0 0 12px;color:var(--sun);font-size:13px;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.hero h1,.page-hero h1{margin:0;font-size:clamp(42px,7vw,82px);line-height:.98;letter-spacing:0}.page-hero h1{font-size:clamp(36px,6vw,66px)}.lead{font-size:clamp(18px,2.2vw,24px);max-width:820px;color:inherit}.hero .lead{color:#f4f7fb}.hero-actions,.planner-controls{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:24px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:8px;border:1px solid var(--ink);text-decoration:none;font-weight:850;cursor:pointer;background:white;color:var(--ink)}.button.primary{background:var(--teal);border-color:var(--teal);color:white}.button.ghost{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.64);color:white}.trust-strip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;background:var(--line);border-block:1px solid var(--line)}.trust-strip span{background:#fff;padding:16px 18px;text-align:center;color:#475467}.trust-strip strong{display:block;color:var(--ink);font-size:22px}.section{padding:68px clamp(18px,5vw,72px)}.wrap{width:min(1120px,100%);margin:0 auto}.section h2{font-size:clamp(28px,4vw,44px);line-height:1.08;margin:0 0 24px;letter-spacing:0}.split{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:28px;align-items:start}.copy-stack{font-size:18px;color:#344054}.planner-panel{display:grid;gap:14px;padding:20px;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:var(--shadow)}label{font-weight:800}textarea,select{width:100%;margin-top:6px;border:1px solid #cbd5d1;border-radius:8px;padding:12px;font:inherit;background:white;color:var(--ink)}.planner-controls label{flex:1;min-width:180px}.planner-result,.inline-status{border:1px solid #cbd5d1;background:#f7faf8;border-radius:8px;padding:14px;color:#344054}.card-grid,.evidence-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.info-card,.evidence-grid article,.price-card{padding:20px;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:0 10px 28px rgba(21,24,30,.06)}.info-card h3,.price-card h2{margin:0 0 8px}.pricing-band{background:#eef7f4}.billing-shell{display:grid;gap:22px}.segmented{display:inline-flex;justify-self:center;padding:4px;border:1px solid var(--line);border-radius:8px;background:#fff}.segmented button{border:0;background:transparent;border-radius:6px;padding:10px 16px;font-weight:900;cursor:pointer}.segmented button.active{background:var(--ink);color:white}.segmented span{color:var(--sun);margin-left:6px}.pricing-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.price-card.featured{border-color:var(--teal);box-shadow:0 18px 48px rgba(15,118,110,.14)}.plan-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.badge{font-size:12px;background:#fff1b8;color:#664d03;padding:4px 8px;border-radius:999px;font-weight:900}.price-line{display:flex;align-items:baseline;gap:4px;margin:16px 0}.price-line strong{font-size:46px;line-height:1}.currency{font-size:20px}.due{font-weight:850;color:var(--teal-dark)}.fineprint,.note{color:var(--muted);font-size:14px}.page-main{min-height:70vh}.page-hero{padding:72px clamp(18px,5vw,72px) 40px;background:#172033;color:white}.page-hero.compact{min-height:auto}.matrix{display:flex;flex-wrap:wrap;gap:10px}.matrix span{padding:9px 12px;border-radius:8px;border:1px solid var(--line);background:white;font-weight:800}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;background:white;border:1px solid var(--line)}th,td{padding:12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{background:#f2f5f2}.steps{display:grid;gap:10px}.faq h3{margin:20px 0 4px}.site-footer{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:32px clamp(18px,5vw,72px);border-top:1px solid var(--line);background:#fff;color:#344054}.site-footer p{max-width:620px;margin:6px 0 0}@media(max-width:860px){.site-header{position:relative;align-items:flex-start;flex-direction:column;padding-block:12px}.hero{min-height:78vh}.trust-strip,.split,.card-grid,.evidence-grid,.pricing-grid{grid-template-columns:1fr}.hero h1,.page-hero h1{font-size:40px}.section{padding-block:44px}.site-footer{flex-direction:column}.button{width:100%}.segmented{width:100%;display:grid;grid-template-columns:1fr 1fr}.price-line strong{font-size:38px}}`

const appJs = `const state={billing:'annual'};function q(s,r=document){return r.querySelector(s)}function qa(s,r=document){return Array.from(r.querySelectorAll(s))}function track(event,data={}){fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,path:location.pathname,...data})}).catch(()=>{})}function setBillingMode(mode){state.billing=mode;qa('[data-billing-tabs]').forEach(shell=>{qa('[data-billing-option]',shell).forEach(btn=>btn.classList.toggle('active',btn.dataset.billingOption===mode));qa('[data-price-monthly]',shell).forEach(node=>{node.textContent=mode==='annual'?node.dataset.annualDisplay:node.dataset.monthlyDisplay});qa('[data-due-today]',shell).forEach(node=>{const due=mode==='annual'?node.dataset.annualDue:node.dataset.monthlyDue;node.textContent='$'+due+' due today'});qa('[data-checkout-link-plan]',shell).forEach(btn=>{const card=btn.closest('[data-plan-card]');const name=card?q('h2',card).textContent:btn.dataset.checkoutLinkPlan;btn.textContent='Checkout '+name+' '+mode;btn.dataset.checkoutBilling=mode})})}async function startCheckout(button){const status=q('[data-checkout-status]');button.disabled=true;if(status)status.textContent='Starting Polar checkout...';track('checkout_start',{planId:button.dataset.checkoutLinkPlan,billing:state.billing,target:'polar'});try{const res=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({planId:button.dataset.checkoutLinkPlan,billing:state.billing,location:button.dataset.checkoutLocation||location.pathname})});const data=await res.json();if(!res.ok||!data.checkoutUrl){if(status)status.textContent=data.error||'Checkout is not configured yet.';button.disabled=false;return}if(status)status.textContent='Opening Polar hosted checkout...';window.location.href=data.checkoutUrl}catch{if(status)status.textContent='Checkout could not start. Please try again.';button.disabled=false}}async function submitPlanner(form){const result=q('[data-planner-result]',form);const formData=new FormData(form);track('paid_gate_hit',{feature:'planner'});result.textContent='Checking paid access...';try{const res=await fetch('/api/planner',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+(localStorage.getItem('openmontageSpaceAccessToken')||'')},body:JSON.stringify(Object.fromEntries(formData.entries()))});const data=await res.json();if(res.status===402){result.innerHTML='<strong>Pricing required</strong><p>'+data.message+'</p><a class="button primary" href="'+data.pricingPath+'">View pricing packages</a>';return}if(!res.ok){result.textContent=data.error||'Planner unavailable.';return}result.innerHTML='<strong>Production plan</strong><pre>'+JSON.stringify(data,null,2)+'</pre>'}catch{result.textContent='Planner request failed.'}}async function verifyAccess(){const status=q('[data-access-status]');if(!status)return;const params=new URLSearchParams(location.search);const checkoutId=params.get('checkout_id')||params.get('checkoutId');if(!checkoutId){status.textContent='No checkout id was returned yet.';return}try{const res=await fetch('/api/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({checkoutId,planId:params.get('planId')||'pro',billing:params.get('billing')||'annual'})});const data=await res.json();if(data.accessToken){localStorage.setItem('openmontageSpaceAccessToken',data.accessToken);status.textContent='Paid access verified. The planner is unlocked on this browser.'}else{status.textContent=data.error||'Checkout is not verified yet.'}}catch{status.textContent='Access verification failed.'}}document.addEventListener('click',event=>{const cta=event.target.closest('[data-track-cta]');if(cta)track('cta_click',{target:cta.dataset.trackCta});const billing=event.target.closest('[data-billing-option]');if(billing){setBillingMode(billing.dataset.billingOption);track('billing_toggle',{billing:state.billing})}const checkout=event.target.closest('[data-checkout-link-plan]');if(checkout)startCheckout(checkout)});document.addEventListener('submit',event=>{const form=event.target.closest('[data-planner-form]');if(form){event.preventDefault();submitPlanner(form)}});document.addEventListener('DOMContentLoaded',()=>{setBillingMode('annual');track('page_view',{referrer:document.referrer||''});verifyAccess()});`

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#15181e"/><path fill="#f2b705" d="M15 18h8l8 16 8-16h8v28h-7V30L34 46h-6l-6-16v16h-7z"/></svg>`

const manifest = {
  name: 'OpenMontage Space',
  short_name: 'OM Space',
  start_url: '/',
  display: 'standalone',
  background_color: '#fffdf7',
  theme_color: '#0f766e',
  icons: [{ src: '/favicon.svg', sizes: '64x64', type: 'image/svg+xml' }],
}

const robots = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.filter((route) => !route.noindex).map((route) => `  <url><loc>${origin}${route.path}</loc><lastmod>${date}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`).join('\n')}\n</urlset>\n`
const llms = `# OpenMontage Space\n\nOpenMontage Space is an independent, unofficial hosted workflow planner for OpenMontage video production briefs.\n\nCanonical site: ${origin}/\nPricing path: ${origin}/pricing/\nPlanner path: ${origin}/planner/\nSupport: ${supportEmail}\nRelationship: independent unofficial companion, not endorsed by OpenMontage maintainers.\nUpstream source note: ${upstreamRepo} under AGPL-3.0.\n\nKey facts collected ${date}:\n- GitHub stars: 23768\n- Forks: 2646\n- Open issues: 110\n- Main branch latest cloned commit: 49a1e5682572d7b600b6d05aabd0025e6f09dc74\n- Core promise: Plan the video your AI agent can actually ship.\n\nPaid access:\nThe functional planner is gated behind package selection and Polar checkout verification. Unpaid planner API requests return a payment-required response.\n`

async function writePublic(file, contents) {
  const url = new URL(`../public/${file}`, import.meta.url)
  await mkdir(new URL('.', url), { recursive: true })
  await writeFile(url, contents)
}

for (const [file, contents] of pages) await writePublic(file, contents)
await writePublic('styles.css', css)
await writePublic('app.js', appJs)
await writePublic('favicon.svg', favicon)
await writePublic('site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`)
await writePublic('robots.txt', robots)
await writePublic('sitemap.xml', sitemap)
await writePublic('llms.txt', llms)
await writePublic('product.json', `${JSON.stringify(product, null, 2)}\n`)
await writePublic('BingSiteAuth.xml', '<?xml version="1.0"?><users><user>94D388E2CA0B71EC5A04D17A6A46E444</user></users>\n')
await writePublic('590a3ab02487cffe4cfd55b0df769f65.txt', '590a3ab02487cffe4cfd55b0df769f65\n')

console.log(`Generated ${pages.length} pages for ${product.brand}.`)

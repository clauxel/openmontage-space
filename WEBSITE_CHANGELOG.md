# Website Changelog

## 2026-06-27

- Created the initial OpenMontage Space website scaffold for `openmontage.space`.
- Added static SEO/GEO pages, pricing, checkout, docs, keyword evidence, privacy, terms, changelog, success/cancel, 404, sitemap, robots, llms.txt, Product/SoftwareApplication schema, and visual assets.
- Added Cloudflare Worker API for runtime facts, D1 analytics, Polar checkout start, paid planner gate, access token verification, facts JSON, and asset serving.
- Added local validation and preview scripts.
- Completed Google Trends same-request keyword validation with `mirofish` as the anchor: 6 primary and 8 long-tail keywords now expose `relativeHeatVsMirofish` evidence on the keyword page and runtime API.

Verification:

- `npm test` passes locally.
- Cloudflare Worker routes, DNS, HTTPS, D1 analytics, Polar checkout start, GSC sitemap submission, Bing verification/submission, IndexNow, and browser flow checks have production evidence.

Follow-ups:

- Continue post-launch search iteration and patrol evidence updates.

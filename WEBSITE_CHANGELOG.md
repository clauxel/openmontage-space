# Website Changelog

## 2026-06-27

- Created the initial OpenMontage Space website scaffold for `openmontage.space`.
- Added static SEO/GEO pages, pricing, checkout, docs, keyword evidence, privacy, terms, changelog, success/cancel, 404, sitemap, robots, llms.txt, Product/SoftwareApplication schema, and visual assets.
- Added Cloudflare Worker API for runtime facts, D1 analytics, Polar checkout start, paid planner gate, access token verification, facts JSON, and asset serving.
- Added local validation and preview scripts.

Verification:

- Pending local `npm test`.
- Pending Codex built-in browser verification.
- Pending Cloudflare/DNS/HTTPS/Polar/Search deployment evidence.

Follow-ups:

- Create or bind the production D1 database and replace the pending database id in `wrangler.toml`.
- Create Polar checkout links or product ids and bind secret names only.
- Run production deployment, DNS, HTTPS, GSC/Bing/IndexNow, and browser click verification.

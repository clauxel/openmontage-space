# OpenMontage Space

Independent, unofficial hosted workflow planner for teams evaluating OpenMontage video production pipelines.

The public site is generated into `public/` and served by a Cloudflare Worker. It includes:

- Static SEO/GEO pages with one H1, canonical URL, Open Graph URL, sitemap, robots, and llms.txt.
- Annual/monthly pricing controls with Annual selected by default and 50% annual discount math.
- A paid planner gate that returns `402` until Polar checkout access is verified.
- D1 analytics hooks for page views, CTA clicks, pricing toggles, checkout starts, paid-gate hits, planner submissions, and AI/referral classification.
- Trust data and trust content for the OpenMontage upstream source boundary.

OpenMontage Space is not an official OpenMontage property. Official source information is kept in source notes and docs copy rather than in primary CTAs.

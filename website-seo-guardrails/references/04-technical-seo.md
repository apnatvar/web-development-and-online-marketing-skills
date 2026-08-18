# Technical SEO

## Crawl and response layer

- Serve stable HTTPS with valid DNS/TLS and adequate capacity.
- Return `200` only for real pages; `301`/`308` for permanent moves; `302`/`307` for temporary moves; `404`/`410` for absent content; and genuine `5xx` for server failures.
- Avoid soft 404s, redirect chains/loops, blanket home redirects, blocked CSS/JS, bot-only failures, and cloaking.
- Ensure important content and links appear in rendered HTML. Server rendering/prerendering reduces dependence on bot JavaScript execution.
- Use crawlable `<a href>` links; do not depend on clicks, forms, fragments, or client events for discovery.

## Robots and index controls

Use robots.txt to control crawling, not to remove indexed URLs or choose canonicals. Use meta robots or `X-Robots-Tag` for `noindex` on crawlable resources. Protect private data with authentication, not robots.txt. Check CDN/WAF and crawler-specific rules for accidental conflicts.

## Canonicals

Use one self-referential absolute HTTPS canonical on indexable pages. Redirect nonpreferred protocols/hosts consistently. Align internal links, sitemaps, hreflang, structured data, and redirects. Never point unrelated pages to one canonical or declare conflicting canonicals in HTML, headers, JavaScript, and sitemap.

## XML sitemaps

Include only canonical indexable URLs that return success. Use absolute URLs, accurate substantive `lastmod`, UTF-8, and a root-level sitemap or sitemap index. One sitemap is limited to 50,000 URLs or 50 MB uncompressed. Split by page family when it improves diagnosis. Omit `noindex`, redirects, errors, parameters, staging, and alternate duplicates. Submission is a hint, not a guarantee.

## URL spaces, facets, and pagination

Use stable human-readable URLs and consistent parameter order. Decide which filters deserve landing pages; block or `noindex` unbounded facets/sorts as appropriate. Return 404 for nonsensical empty combinations. Provide sequential `<a href>` pagination and avoid fragment-only pages.

## Mobile, accessibility, and performance

Maintain content/metadata parity across responsive views. Use semantic HTML, keyboard access, labels, contrast, alt text, captions, and non-obstructive interstitials. Measure field Core Web Vitals at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 are “good” thresholds. Lab scores diagnose but do not replace field data.

## International

Use separate stable URLs per language/region, visible single-language content, reciprocal valid `hreflang` clusters, an `x-default` when useful, and a canonical within the same language. Do not force IP/language redirects that hide variants from users or crawlers.

## Migrations

Inventory old URLs and signals; create one-to-one mappings; verify old/new Search Console properties; preserve verification files; update canonicals, hreflang, sitemaps, links, feeds, analytics, and structured data; deploy permanent redirects; keep them long enough; ensure capacity; monitor logs/indexing/traffic; and return 404/410 for content with no replacement. Avoid combining domain, CMS, design, URL, and content changes without necessity.

## Release tests

Test representative pages from every template and state: published, noindex, paginated, filtered, missing, redirected, localized, media, and structured-data variants. Crawl both preproduction and production, but prevent staging indexation through authentication.

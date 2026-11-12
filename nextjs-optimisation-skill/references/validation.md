# Testing and Validation

[Back to index](../index.md)

## Layered validation

1. Data/schema tests: uniqueness, route relationships, required fields, indexability cohorts, stable IDs.
2. Component/interaction tests: navigation, deferred loading, analytics deduplication, accessible controls.
3. Static checks: TypeScript and ESLint.
4. Production build: route generation, static/dynamic status, framework warnings.
5. Rendered HTML audit: titles, canonicals, robots, H1 count, JSON-LD parsing, URL uniqueness.
6. Browser checks: responsive behavior, keyboard, reduced motion, loading, hydration, network.
7. Live checks: redirects, canonical host, robots, sitemap, verification assets, cache headers, analytics, webmaster tools, IndexNow.

Choose representative route classes and intentional noindex cohorts. A validator that assumes every prerendered route is indexable will generate false failures after a curated-indexing redesign. Treat a large sudden mismatch count as evidence that either the implementation or the expectation model is stale; inspect both before changing code.

Tests should encode policy near the data that owns it. Examples: all sitemap entries have substantive dates; noindex pages are excluded; indexed profiles belong to an editorial allowlist; graph IDs are unique/stable; visible FAQ and schema agree; package scripts reference existing utilities.

Avoid snapshotting entire generated pages when focused semantic assertions provide clearer failures. Never weaken a validator solely to make a build green.

## Interpret live and search evidence

Label source inspection, local build output, direct deployed responses, cached search extractions and Search Console observations separately. Passing local metadata checks does not establish deployment or indexing; a cached extraction does not prove the current release is serving old copy. For an important unindexed URL, inspect the last crawl, crawled HTML and Google-selected canonical as well as its live status, headers and content. State missing access rather than certifying the entire path from repository evidence.

An intentional, relevant permanent redirect excluded as "Page with redirect" is expected; verify its final destination instead of trying to eliminate the report entry. "Crawled - currently not indexed" is a separate observation, not proof of a technical defect or spam. Diagnose access and canonical signals before attributing it to content; evaluate distinct usefulness and exposure if those signals are sound. Do not add noindex, robots blocks, removals or broad redirects solely to make report totals look clean. See [Google's report definitions](https://support.google.com/webmasters/answer/7440203).

Related: [SEO](seo.md), [Performance](performance.md), [Sitemap and indexing](sitemap-indexing.md), and [Pre-deployment checklist](../checklists/pre-deployment.md).

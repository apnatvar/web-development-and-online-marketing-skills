# SEO knowledge sources

Last source review: 2026-07-22

Only source-backed statements belong in `current-practices.md`. Prefer the specific product/standard owner over summaries and vendor blogs.

## Reviewed authoritative sources

| Key | Source | Scope | Reviewed | Status |
|---|---|---|---|---|
| S1 | [Google Search Essentials](https://developers.google.com/search/docs/essentials) | Eligibility, technical requirements, spam policies | 2026-07-22 | Verified |
| S2 | [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) | Crawl, organization, titles, snippets, images, content myths | 2026-07-22 | Verified |
| S3 | [Influencing title links](https://developers.google.com/search/docs/appearance/title-link) | Page title guidance and title-link generation | 2026-07-22 | Verified |
| S4 | [Control snippets and meta descriptions](https://developers.google.com/search/docs/appearance/snippet) | Snippet generation and descriptions | 2026-07-22 | Verified |
| S5 | [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Sitemap limits, URLs, placement | 2026-07-22 | Verified |
| S6 | [Introduction to robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) | Crawl controls and limitations | 2026-07-22 | Verified |
| S7 | [Robots meta and X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) | Indexing and serving directives | 2026-07-22 | Verified |
| S8 | [Canonical URL methods](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Redirect, canonical, and sitemap signals | 2026-07-22 | Verified |
| S9 | [General structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | Technical and quality eligibility | 2026-07-22 | Verified |
| S10 | [Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Formats, validation, Google/schema.org distinction | 2026-07-22 | Verified |
| S11 | [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Rendering, metadata, links, content | 2026-07-22 | Verified |
| S12 | [Localized page versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | `hreflang` and locale variants | 2026-07-22 | Verified |
| S13 | [Google image SEO best practices](https://developers.google.com/search/docs/appearance/google-images) | Discoverability, alt text, responsive images | 2026-07-22 | Verified |
| S14 | [Understanding page experience](https://developers.google.com/search/docs/appearance/page-experience) | Page experience and ranking caveats | 2026-07-22 | Verified |
| S15 | [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) | LCP, INP, CLS and 75th percentile | 2026-07-22 | Verified |
| S16 | [W3C WCAG overview](https://www.w3.org/WAI/standards-guidelines/wcag/) | WCAG versions and W3C recommendation status | 2026-07-22 | Verified |
| S17 | [W3C headings tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/) | Heading structure and skipped levels | 2026-07-22 | Verified |
| S18 | [Schema.org documentation](https://schema.org/docs/documents.html) | Structured-data vocabulary | 2026-07-22 | Verified |
| S19 | [Lighthouse overview](https://developer.chrome.com/docs/lighthouse) | Categories and diagnostic role | 2026-07-22 | Verified |
| S20 | [Lighthouse metric variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) | Sources of lab variance | 2026-07-22 | Verified |
| S21 | [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Content quality and intended audience | 2026-07-22 | Verified |
| S22 | [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) | Local business markup and review cautions | 2026-07-22 | Verified |
| S23 | [Lighthouse package](https://www.npmjs.com/package/lighthouse) | Current CLI version and Node requirement | 2026-07-22 | Verified at 13.4.1 |

## Review rules

1. Open the source itself; a search-result summary is not a completed review.
2. Record sources that were actually read, even when no knowledge text changes.
3. Prefer Google Search Central for Google-specific behavior, Chrome/Lighthouse/web.dev for measurement, schema.org for vocabulary, and W3C for accessibility standards.
4. Add non-official sources only when they provide necessary evidence not available from the owner, and label the evidence level.
5. Flag inaccessible or ambiguous recommendations instead of silently carrying them forward.

## Review log

### 2026-07-22

- Reviewed S1–S23 for initial version 2026.07.22.
- Recorded Lighthouse 13.4.1 and Chrome 150 as the reproducibility baseline.
- Explicitly rejected fixed character counts, exact-one-h1 ranking claims, word-count targets, direct E-E-A-T-factor claims, duplicate-content penalty claims, and `llms.txt` SEO claims.

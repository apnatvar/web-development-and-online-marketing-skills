# Repository Adaptation

[Back to index](../index.md)

This skill is intentionally project-agnostic. Never transplant example names, routes, URLs, dates, bot lists, product taxonomy, analytics IDs, schema claims, or script names.

## Discovery sequence

1. Read repository instructions and package scripts.
2. Identify Next.js version, router(s), deployment target, rendering configuration, and content sources.
3. Find metadata, canonical URL helpers, JSON-LD components, sitemap/robots generation, redirects, image/font configuration, analytics/consent code, and performance tests.
4. Map route cohorts: public/indexed, public/noindex, authenticated/private, generated, editorial, utility, and API.
5. Search git history and local documents for deliberate reversals or rejected experiments.
6. Read installed framework docs before using version-sensitive APIs.

## Resolve conflicts

Prefer current verified behavior and tests, then current framework docs, newer deliberate changes, rendered output, and finally older notes. A newer decision does not win merely by date: confirm that it was intentional and still matches the business/content model.

Extract the principle rather than the implementation. For example:

- a centralized entity helper becomes “reuse stable canonical IDs,” not a copied URL fragment;
- an editorial allowlist becomes “index only independently useful profiles,” not a copied slug list;
- a deferred quiz becomes “load heavy below-fold interactions near the viewport,” not a required component name;
- route-local GSAP becomes “isolate optional motion and preserve semantic fallback,” not a GSAP mandate;
- an npm publisher becomes “notify after deployment from trusted release tooling,” not a fixed command.

## Knowledge gaps

Record facts that require external access or measurement: field Core Web Vitals, webmaster indexing/citations, consent-platform configuration, analytics property settings, CDN redirects/caching, deployment environment, and editorial verification. Do not fill them with assumptions.

Related: [Anti-patterns](anti-patterns.md), [Validation](validation.md), and [Audit-page checklist](../checklists/audit-page.md).

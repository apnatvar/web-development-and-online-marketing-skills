# Next.js Optimisation Knowledge Base

This index routes work to focused guidance. Start with [SKILL.md](SKILL.md), then open only the relevant documents.

## Discovery and meaning

- [SEO](references/seo.md) — search intent, metadata, canonicals, internal links, content quality.
- [AI search](references/ai-search.md) — agent accessibility, attribution, machine-readable summaries, limitations.
- [Structured data](references/structured-data.md) — graph design, stable IDs, truthfulness, entity relationships.
- [Sitemap and indexing](references/sitemap-indexing.md) — inclusion policy, freshness, noindex cohorts, robots.
- [IndexNow](references/indexnow.md) — developer-run post-deployment publishing workflow.

## Architecture and delivery

- [Page architecture](references/page-architecture.md) — route purpose, semantic structure, shared content, client boundaries.
- [Rendering](references/rendering.md) — static/dynamic decisions, Server Components, Suspense, route handlers.
- [Performance](references/performance.md) — measurement, Core Web Vitals, CSS containment, third-party cost.
- [Bundles](references/bundles.md) — dependency and import discipline, code splitting, analysis.
- [Prefetching](references/prefetching.md) — automatic, disabled, and intent-based policies.
- [Images and media](references/images-media.md) — LCP, responsive sizing, lazy loading, remote media, video.
- [Animations](references/animations.md) — progressive enhancement, GSAP, reduced motion, cleanup.
- [Accessibility](references/accessibility.md) — semantics, keyboard, motion, loading states, visual checks.
- [Analytics](references/analytics.md) — consent, event taxonomy, privacy, deduplication, verification.
- [Validation](references/validation.md) — tests, builds, rendered audits, live checks, stale validators.

## Decisions and cautions

- [Anti-patterns](references/anti-patterns.md) — rejected and reverted approaches with reasons.
- [Repository adaptation](references/repository-adaptation.md) — infer local conventions and resolve historical conflicts without hard-coding one project.

## Checklists

- [New page](checklists/new-page.md)
- [Audit an existing page](checklists/audit-page.md)
- [Performance audit](checklists/performance-audit.md)
- [Pre-deployment](checklists/pre-deployment.md)

## Evidence hierarchy

When sources disagree, prefer: current verified implementation and tests; current bundled Next.js documentation; newer deliberate commits; rendered production output; older audit notes; generic advice. Record unresolved conflicts as knowledge gaps instead of silently guessing.

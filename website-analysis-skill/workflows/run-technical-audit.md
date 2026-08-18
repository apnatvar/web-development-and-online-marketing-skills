# Run a technical audit

Load `knowledge/technical/*` and `knowledge/seo/current-practices.md`.

1. Inspect local source/routes/configuration or deployed responses/rendered HTML.
2. Check status/redirects, crawlability, robots, sitemap, index directives, canonicals, metadata, headings, semantics, JSON-LD, internal/broken links, images, mobile output, and observable security headers.
3. Run the standardized Lighthouse workflow for every selected served URL.
4. Use Playwright/CDP/Axe only when available and relevant for rendered states, interactions, responsive behavior, console/network evidence, or added accessibility coverage.
5. Correlate Lighthouse indicators with concrete resources/elements/tasks. Do not infer an exact public code cause.
6. Label deterministic, relatively stable, variable-performance, and environment-dependent evidence.
7. Provide file/line/framework guidance for local repositories. Do not modify code unless the user asks for implementation.

If Lighthouse or a served local URL is unavailable, stop for the missing requirement unless the user accepts a clearly labeled partial audit.

# Pre-deployment Checklist

[Back to index](../index.md)

- [ ] Review `git diff` and preserve unrelated work.
- [ ] Run focused tests, typecheck, lint, and the production build.
- [ ] Compare the production route table and prerender count with the intended publishing/indexing cohort; investigate accidental route explosions or new dynamic routes.
- [ ] Verify cache/revalidation policy, middleware matchers, function regions, scheduled work, image-transformation scope, and provider-specific configuration against current documentation.
- [ ] Confirm compute reductions preserve freshness, authorization, personalization, preview fidelity, and rollback behavior.
- [ ] Run rendered SEO/schema validation and investigate expectation mismatches.
- [ ] Spot-check representative static, dynamic, indexed, noindex, service, product, article, course, and directory routes.
- [ ] Verify canonical host, redirect behavior, `robots.txt`, sitemap, and key/verification files.
- [ ] Confirm sitemap contains every intended indexable route, excludes noindex routes, and uses substantive dates.
- [ ] Confirm structured-data IDs and entity references are stable across route graphs.
- [ ] Test keyboard, mobile layout, reduced motion, loading states, and media failure behavior.
- [ ] Verify analytics/consent ordering, script uniqueness, sanitized parameters, and no duplicate page views.
- [ ] Deploy before notifying IndexNow.
- [ ] Preview the deployed sitemap or explicit canonical URL list, then publish via the developer-run command.
- [ ] Record manual console/webmaster/analytics work that cannot be completed in the repository.

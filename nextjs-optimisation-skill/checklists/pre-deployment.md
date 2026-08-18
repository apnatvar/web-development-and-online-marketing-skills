# Pre-deployment Checklist

[Back to index](../index.md)

- [ ] Review `git diff` and preserve unrelated work.
- [ ] Run focused tests, typecheck, lint, and the production build.
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

# IndexNow Publishing

[Back to index](../index.md)

## Architecture

Keep notification outside the hosted Next.js application. Use a developer/CI-invoked script with an npm command; do not expose a public server route that can be abused to submit arbitrary URLs or keys.

The utility should:

- load the key from a local key file or environment configuration;
- mask secrets in preview output;
- accept explicit canonical URLs and optionally the deployed sitemap;
- require HTTPS and the canonical origin;
- reject queries, fragments, credentials, and foreign origins;
- deduplicate URLs and batch at the protocol limit;
- return nonzero on fetch/API failure;
- publish only after the changed pages are live.

## Preferred release workflow

1. Deploy the change.
2. Verify the canonical URLs and sitemap on production.
3. Preview the exact payload.
4. Submit only new or materially changed canonicals when practical.
5. Record rejection details and retry only after correcting the cause.

Prefer dedicated npm scripts such as `indexnow:preview` and `indexnow:publish`, with the underlying utility also able to accept focused canonical URL arguments. Discover and follow the repository's actual names.

Avoid ambiguous npm argument placement: package-manager flag parsing can consume or reorder options and accidentally bypass preview mode. Prefer a dedicated preview script or an explicit preview environment variable, and inspect its masked output before publishing.

IndexNow acceptance means the endpoint accepted the notification, not that a URL was indexed or ranked.

Related: [Sitemap and indexing](sitemap-indexing.md), [SEO](seo.md), [Analytics](analytics.md), and [Pre-deployment checklist](../checklists/pre-deployment.md).

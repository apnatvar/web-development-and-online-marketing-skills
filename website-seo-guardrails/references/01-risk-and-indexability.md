# Risk and Indexability

## Indexability is earned

Approve an indexable URL only when all are true:

- it serves a real audience need consistent with the site's purpose;
- it has unique primary value, not just a changed keyword, location, product name, or template field;
- it is complete, accurate, maintained, and attributable where trust matters;
- users and crawlers can reach it through crawlable internal links;
- it returns the intended status and meaningful rendered HTML;
- its canonical, robots state, sitemap state, and hreflang cluster agree;
- it is not substantially duplicative of a stronger page;
- the owner can explain why it deserves to appear independently in search.

Word count alone never proves quality. A concise tool can be valuable; a long generated page can be thin.

## Red-flag families

Review before indexing:

- generated course lessons with repeated structures and shallow variation;
- tool/directory profiles that restate vendor descriptions without first-hand testing;
- glossaries where each page is only a definition;
- city/service combinations without local evidence, staff, availability, or distinct service detail;
- internal search, tags, filters, sorts, calendars, session URLs, and tracking parameters;
- AI-generated blogs covering unrelated trends or query variants;
- copied manufacturer, feed, affiliate, marketplace, or syndicated text;
- comparison pages without a disclosed method and firsthand evidence;
- expired offers, unavailable products, empty categories, and placeholder pages;
- private, staging, preview, account, cart, checkout, and admin routes.

## Action definitions

- `index`: self-canonical, crawlable, in sitemap, internally linked, maintained.
- `noindex-follow`: useful to visitors but not independently search-worthy; omit from sitemap and keep crawlable until engines process the directive.
- `merge`: consolidate overlapping value into a stronger canonical page and redirect retired URLs when appropriate.
- `redirect`: permanent one-to-one replacement; never mass-redirect unrelated URLs to home.
- `remove`: return `404` or `410` when no replacement exists; update links and sitemaps.
- `hold`: keep unpublished/authenticated until content and evidence pass review.

Do not block a URL in robots.txt when Google must crawl it to see `noindex`. Do not use robots.txt or removal tools as canonicalization mechanisms.

## Inventory fields

Track: URL, page family, template, status, final URL, index directive, Google-selected canonical, declared canonical, sitemap, hreflang, title, description, H1, word/value notes, last substantive update, inbound internal links, depth, organic clicks/impressions, backlinks, conversions, owner, and decision.

## Indexability safeguards

- Keep generated-but-public lessons out of the index until substantive editorial rewrites.
- Index only allowlisted tool profiles with first-hand usage, editorial review dates, and meaningful standalone guidance.
- Keep product-adjacent or templated blogs `noindex` unless they become independent informational articles.
- Remove glossary architectures when definitions do not justify separate landing pages.
- Test that every `noindex` URL is absent from the sitemap and every sitemap URL is canonical HTTPS.
- Validate built HTML for titles, a clear H1, one canonical, expected indexability, and parseable JSON-LD.

## Emergency triage

For sudden loss, compare deploy/migration dates with Search Console and analytics; inspect representative URLs; check manual actions/security issues; verify DNS, TLS, CDN/WAF, response codes, robots, meta/X-Robots, canonicals, redirects, rendering, sitemap, and server logs. Preserve evidence and roll back a clearly destructive release when authorized.

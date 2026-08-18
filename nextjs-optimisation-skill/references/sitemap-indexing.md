# Sitemap, Robots, and Indexing

[Back to index](../index.md)

## Inclusion policy

Include a route when it is canonical, publicly accessible, indexable, and independently useful. Exclude redirects, errors, authenticated/private routes, duplicates, and intentional noindex cohorts. Generate sitemap entries from the same typed registries/allowlists that drive route metadata so policies cannot drift silently.

Curated indexability is preferable to mass publication:

- generated or template-heavy lessons can stay accessible inside a course but noindex until rewritten;
- tool profiles should be indexable only after maintained editorial guidance is present;
- product-support articles can be noindex while standalone informational articles are indexed;
- inline glossary definitions can serve users without generating dozens of thin routes.

## Freshness

Every sitemap entry should have a defensible `lastModified` value. Prefer content-owned dates such as publication, editorial review, or substantive route change. A coordinated release date may be shared by routes changed for that release, including a next-day date before the planned deployment. Never use `new Date()` on every build or refresh dates without content changes.

Do not add `priority` or `changeFrequency` merely because the API supports them; they are not substitutes for editorial evidence.

## Robots

Use robots rules deliberately and keep the sitemap discoverable. Explicit crawler entries can document policy, but repeated `allow: /` entries do not create ranking benefits. Ensure no infrastructure/CDN rule contradicts the generated file. Understand that robots blocking prevents crawling, whereas meta/X-Robots noindex requires crawlers to fetch the page.

## Validation

Compare generated route cohorts, metadata robots, sitemap output, internal links, and built HTML. Validate the production `robots.txt` and sitemap after deployment because host redirects, caches, and platform configuration are outside unit tests.

Related: [SEO](seo.md), [IndexNow](indexnow.md), [AI search](ai-search.md), and [Validation](validation.md).

# Technical SEO and Page Meaning

[Back to index](../index.md)

## Objective requirements

- Return crawlable, meaningful initial HTML with a successful canonical response.
- Use one canonical HTTPS URL, one useful title, one descriptive H1, and a consistent robots directive.
- Give images meaningful alt text when informative and empty alt text when decorative.
- Use real anchor links for navigation and expose important pages through a human hierarchy.
- Keep redirects, metadata, sitemap entries, and internal URLs on the same canonical host.

Use root metadata for true site defaults and route metadata for route meaning. Inspect inheritance/merge behavior in the installed Next.js version; nested objects such as Open Graph can be replaced rather than deeply merged. Use dynamic metadata only when route data determines the result, and share the same validated record with visible content and schema. Canonicalize genuine parameter variants; redirect retired or mistaken URLs when users and signals should move permanently; use noindex for accessible pages that should not enter search; exclude every intentional noindex route from the sitemap.

## Strategic decisions

Indexing is earned by independent usefulness. A route can be valid and still belong behind `noindex` when it is generated, repetitive, discovery-only, an internal utility, or subordinate to a stronger canonical page. Noindex cohorts should be explicit in data/model code and tested.

Titles should describe the page's specific promise. Avoid boilerplate that makes every rendered title too long. An absolute title can prevent a global brand template from damaging already complete editorial headlines.

Descriptions should explain the page, not list keywords. Keywords can guide editorial coverage but are not a substitute for clear language, evidence, or internal relationships.

## Coherence test

For each route, compare:

1. visible H1 and opening copy;
2. title and description;
3. canonical and robots;
4. sitemap inclusion and `lastModified`;
5. internal-link labels and breadcrumbs;
6. structured-data type and main entity.

A mismatch usually indicates an architectural problem, not a metadata-only problem.

## Content boundaries

- Company pages explain identity, history, legal facts, people, and operating context.
- Differentiation pages explain how the company works differently, without repeating company facts.
- Service pages describe a performed capability and engagement model.
- Product pages describe a product or configurable base; use `Product` only when that is truthful.
- Articles answer an editorial question and should not masquerade as product pages.
- FAQ content must be visible and useful; schema does not guarantee a rich result.

## Validation

Parse built HTML for missing/duplicate canonicals, titles, H1s, invalid JSON-LD, and unintended noindex. Treat rigid title-length thresholds as safeguards rather than ranking laws. Verify live redirects and canonical host consolidation after deployment.

Related: [Structured data](structured-data.md), [Sitemap and indexing](sitemap-indexing.md), [AI search](ai-search.md), and [Page architecture](page-architecture.md).

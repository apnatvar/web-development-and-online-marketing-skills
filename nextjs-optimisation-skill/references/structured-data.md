# Structured Data and Entity Graphs

[Back to index](../index.md)

## Stable graph design

Centralize canonical entity IDs instead of constructing them ad hoc:

```ts
const organizationId = `${origin}/#organization`
const websiteId = `${origin}/#website`
const pageId = (path: string) => `${absoluteUrl(path)}#webpage`
const serviceId = (path: string) => `${absoluteUrl(path)}#service`
const productId = (path: string) => `${absoluteUrl(path)}#product`
```

Use exactly the same ID wherever the entity appears. Reference a shared entity with `{"@id": organizationId}` instead of copying a slightly different Organization object into every route. IDs should be absolute, canonical, stable through deploys, and specific to entity type.

## Relationships

- WebSite `publisher` → Organization.
- WebPage `isPartOf` → WebSite and `about`/`mainEntity` → the route's entity.
- Organization `founder` → public Person when verified.
- Person `worksFor` → Organization and `sameAs` → verified personal profiles.
- Service `provider` and Product `brand`/seller → Organization as appropriate.
- Article author → Person when public authorship is real; publisher → Organization.
- BreadcrumbList items → visible canonical hierarchy.

Choose types from the actual subject: Organization and WebSite for site identity; WebPage subtypes for page purpose; Person for public authorship/leadership; Service for performed work; Product for genuine products; SoftwareApplication for real software; Article or BlogPosting for editorial pages; BreadcrumbList for visible hierarchy; FAQPage only for visible eligible questions and answers; Offer for real commercial terms. Collection pages may use ItemList when their visible items and URLs match.

## Truthfulness rules

Schema describes the page; it does not create facts. Use `Service` for implementation work without a purchasable product. Use `Product` for a genuine product/configurable product entity. Offers require real visible commercial information. A zero-dollar foundation/base must not be represented as the full implementation price. Never invent ratings, reviews, results, attendance modes, availability, or FAQ entries.

Dates must match visible editorial history. Keep `dateModified` equal to publication until a substantive revision occurs. Do not update timestamps merely because a build ran.

## Graph construction

Prefer one JSON-LD `@graph` per route when several entities relate. Encode safely using the repository's established JSON-LD component/pattern, and never interpolate untrusted text into executable markup. Validate JSON syntax, entity IDs, canonical URLs, and visible/schema agreement in built HTML.

Rich-result eligibility and rich-result display are separate from schema validity. Optimize for an accurate knowledge graph, not a badge in a test tool.

Related: [SEO](seo.md), [Page architecture](page-architecture.md), [AI search](ai-search.md), and [Validation](validation.md).

# Anti-patterns and Reverted Approaches

[Back to index](../index.md)

These are general lessons recovered from implementations that were removed, narrowed, or superseded.

## Discovery

- Mass-generated glossary, lesson, tool, or article routes can create thin/repetitive indexing footprints. Keep useful content inline or noindex until independently edited.
- A dedicated pricing route is not inherently required. If it duplicates product/service commercial information, consolidate into the pages where the offer is explained.
- Repeating full company facts on a differentiation page weakens both intents; separate identity from method.
- Invented numeric offers, ratings, founders, or outcomes are worse than missing rich-result fields.
- Updating all sitemap dates on every build manufactures freshness.

## Performance

- Global smooth scrolling and animation engines make ordinary pages pay for one showcase experience.
- Repeated decorative SVG/markup can add payload without meaning or trust.
- Multiple icon systems and broad component barrels defeat tree-shaking discipline.
- Putting large directories, FAQ banks, or detailed product data into shared client navigation inflates every route.
- Disabling every prefetch or splitting every component optimizes a metric without respecting navigation experience.
- Priority/preload on many images competes with the actual LCP resource.

## Analytics and publishing

- Custom page-view tracking can duplicate automatic history tracking.
- Parallel consent state can conflict with the deployed consent platform.
- Outbound booking clicks must not be labeled completed conversions.
- Hosted IndexNow submission endpoints increase abuse/key risk; release tooling should run from a trusted developer or CI context.
- Package-manager argument ambiguity can turn a supposed preview into a real command; provide dedicated safe scripts.

## Process

- Old audit reports can preserve decisions that later became invalid. Reconcile them with current code, tests, and newer commits.
- Passing tests do not prove live redirects, analytics administration, indexing, citation, or Core Web Vitals.
- A failing validator does not automatically prove production is wrong; its expectation model can lag intentional architecture.

Related: [Repository adaptation](repository-adaptation.md), [Validation](validation.md), [Performance](performance.md), and [SEO](seo.md).

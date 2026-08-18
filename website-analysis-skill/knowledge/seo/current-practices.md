# SEO current practices

Knowledge version: 2026.07.22  
Last verified: 2026-07-22

Use this module for technical and combined audits. For copy-only audits, read only the metadata date unless search-intent analysis needs a specific section. Source keys refer to `sources.md`.

## Evidence labels

- **Official requirement**: A documented technical eligibility rule, explicit directive behavior, structured-data policy, or normative web standard.
- **Widely accepted best practice**: Strong, source-supported guidance that usually helps users, crawling, interpretation, or maintainability but is not a universal ranking requirement.
- **Optional recommendation**: Useful only for relevant site types, scale, or goals.
- **Speculative or unverified**: Unsupported, context-free, or algorithm-speculation claims. Do not report these as facts.

## Official requirements and documented behavior

### Crawlability and basic eligibility

- Google Search eligibility requires that Googlebot is not blocked, the page works (normally an HTTP 200 response), and the page contains indexable content. Eligibility does not guarantee crawling, indexing, serving, or ranking. [S1]
- Public content must be reachable without credentials if it is intended to appear in public search. Password protection is appropriate for confidential content. [S1] [S7]
- Resources needed to understand the page, including important CSS and JavaScript, should not be blocked from the crawler. [S2] [S11]

### Indexability and robots directives

- `noindex` in a supported robots meta tag or `X-Robots-Tag` tells Google not to index the resource, but the crawler must be allowed to fetch the directive. [S7]
- `robots.txt` controls crawling, not reliable removal from search. A disallowed URL can still be indexed from external signals. Do not use robots.txt to protect confidential data. [S6]
- Page-level directives and HTTP headers must not accidentally conflict with the intended indexing state. [S7]

### Structured data eligibility

- Structured data must describe the page it appears on, represent visible and truthful content, use a supported format, and include the required properties for the intended Google rich-result feature. Hidden, misleading, irrelevant, or fabricated markup can lose eligibility or trigger a manual action. [S9] [S10]
- Valid syntax does not guarantee a rich result. Schema.org describes the vocabulary; Google Search documentation is definitive for Google feature eligibility. [S9] [S18]

### International annotations

- When `hreflang` is used, each language version must identify itself and the alternates with fully qualified URLs; reciprocal annotations are required for pairs Google is expected to use. `x-default` can identify a fallback. [S12]

### Accessibility standards

- When conformance is claimed, evaluate against the chosen WCAG version and level. W3C encourages WCAG 2.2 as the latest WCAG 2 standard. Automated tests cannot establish full conformance. [S16]

## Widely accepted best practices

### Crawlability

- Keep important pages reachable through ordinary `<a href>` links and a logical navigation structure. Do not depend only on search forms, gestures, or client state for discovery. [S2]
- Return accurate status codes. Use 404/410 for removed content, 200 for successful content, and redirects only when a meaningful destination exists.
- Check production rendering, not only source templates. A crawler and a user should receive the essential content and resources.

### Indexability

- Decide which page types should appear in search; align robots meta directives, canonicals, sitemap membership, authentication, and HTTP status with that decision.
- Confirm important URLs with Search Console URL Inspection where access is available. A static audit cannot confirm that Google selected the page for indexing.

### Page titles

- Give every indexable page a unique, descriptive, concise `<title>` that accurately matches its content. Avoid vague titles, keyword stuffing, obsolete text, and excessive boilerplate. Google may form title links from titles, headings, prominent text, links, and other sources. [S3]
- Review length at actual display widths; there is no official fixed character limit. Treat length thresholds as editorial review triggers, not pass/fail ranking rules. [S3]

### Meta descriptions

- Provide a unique, accurate page summary where a controlled snippet candidate is useful. Google primarily creates snippets from page content and may use a meta description when it better describes the page. Do not promise that Google will display it. [S4]
- Avoid duplicated, generic, keyword-stuffed, or fabricated descriptions.

### Canonicalisation and duplicate content

- Consolidate duplicate or substantially similar URLs when this helps users and crawling. Redirects and `rel="canonical"` are strong signals; sitemap inclusion is weaker. Signals should agree. [S8]
- Prefer a self-referential canonical on canonical pages when templates can reliably emit it. Do not use robots.txt for canonicalisation. [S8]
- Duplicate content is not automatically a spam violation or a generic “penalty,” but unnecessary duplicates can confuse users and waste crawling. [S2]

### Heading hierarchy and semantic structure

- Use a clear primary visible heading and semantic headings that reflect content organization. Choose heading levels by nesting, not visual size. Skipped levels can confuse assistive-technology navigation. [S2] [S17]
- Multiple `<h1>` elements are not documented as a Google penalty. Audit them for clarity, title-link consistency, and accessibility rather than inventing a ranking violation. [S2] [S3]
- Use landmarks and native HTML controls so users and tools can understand the page structure.

### Internal linking

- Link related pages with descriptive anchor text and ensure important pages are not orphaned. Use links to express useful site relationships, not to manufacture keyword patterns. [S2]
- Repair internal 404/410 destinations and avoid unnecessary redirect chains. Keep navigation usable with keyboard and on mobile.

### Structured data

- Use the most specific applicable schema.org type and only Google-supported feature markup when a search feature is a goal. Prefer maintainable JSON-LD where suitable. [S9] [S10] [S18]
- Validate syntax locally, then validate Google feature rules and monitor deployed rich-result reports. Keep marked-up facts consistent with visible content. [S9]

### Image SEO

- Use discoverable HTML image elements, meaningful nearby text, accurate alt text for informative images, empty alt text for decorative images, descriptive filenames where practical, and high-quality responsive assets. Do not keyword-stuff alt text. [S13]
- Set intrinsic dimensions or aspect ratios, right-size images, and compress them to support speed and layout stability.

### Mobile usability

- Use responsive layouts, a correct viewport, legible text, usable touch targets, and content/functionality equivalent to desktop. Important metadata and structured data should remain present in the mobile rendering. [S11]
- Test representative narrow viewports and orientation changes; a desktop screenshot or one Lighthouse score is insufficient.

### Page experience and Core Web Vitals

- Assess overall experience: Core Web Vitals, secure delivery, mobile display, intrusive interstitials, distracting ads, and clear main content. There is no single page-experience score or guarantee of ranking improvement. [S14]
- Current stable Core Web Vitals are LCP, INP, and CLS. At the 75th percentile of field page views, “good” thresholds are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1. [S15]
- Prefer field data for real-user conclusions. Lab data is diagnostic. Use multiple standardized Lighthouse runs and medians for comparison because hardware, network, server, page, and third-party variance remain. [S19] [S20]

### Accessibility considerations relevant to search and use

- Provide text alternatives, programmatic labels, logical headings, keyboard operation, visible focus, sufficient contrast, declared language, and meaningful link text. These primarily protect users; do not turn every accessibility requirement into an unsupported direct ranking claim. [S16] [S17]
- Treat Lighthouse/Axe findings as a partial automated sample and add manual review.

### Redirects

- Use permanent redirects for lasting URL moves and temporary redirects only for genuinely temporary changes. Link and sitemap directly to final canonical URLs.
- Avoid chains, loops, mass redirects to irrelevant pages, and client-only redirects when an HTTP redirect is available.

### Sitemap practices

- Include canonical, indexable, important absolute URLs. A sitemap is a discovery signal, not an indexing guarantee. Root placement gives the broadest default scope. [S5]
- A single sitemap is limited to 50 MB uncompressed or 50,000 URLs; use sitemap indexes beyond those limits. Keep `lastmod` truthful when supplied. [S5]
- Small, fully linked sites may not need a sitemap, but one can still simplify monitoring.

### JavaScript-rendered content

- Google renders JavaScript with a recent Chrome, but rendering adds processing and can fail when resources, APIs, or interactions prevent content access. Make essential content, titles, links, canonicals, and directives reliably available in the rendered HTML. [S11]
- Prefer server rendering, static generation, or progressive enhancement when it materially improves reliability; do not prescribe a framework architecture without repository evidence.
- Do not hide important content behind user interaction when crawlers and first-time users need it.

### International SEO

- Use distinct, crawlable locale URLs when localized pages are needed. Keep each page in one primary language, localize visible content and metadata, and use `hreflang` only for genuine alternatives. [S12]
- Do not auto-redirect solely from presumed language/location in a way that blocks users or crawlers from other variants. Give users a selector.

### Content quality, search intent, and helpful content

- Create content primarily for an intended audience, with a clear site purpose, useful original information or analysis, sufficient answers for the visitor’s goal, and transparent sourcing or responsibility where relevant. [S21]
- Match the page type and promise to the intended query: informational pages should answer; commercial pages should explain the offer and evidence; transactional pages should make the next step clear.
- There is no universal minimum word count. Add material because it helps the visitor, not to reach a length target. [S2]

### Trust and evidence

- Support consequential claims with verifiable evidence appropriate to the topic: sources, named authors/responsible organizations, methodology, policies, genuine customer proof, or accurate business details.
- E-E-A-T is not a standalone ranking factor. Do not invent author credentials, statistics, certifications, reviews, or results to “improve SEO.” [S2] [S21]

### Local SEO where relevant

- Keep real business name, address/service area, contact details, hours, and landing-page information accurate and consistent across owned properties.
- Use `LocalBusiness` structured data only for real applicable locations and follow current required/recommended properties. Do not fabricate reviews or aggregate ratings. [S22]
- Local visibility cannot be confirmed from the website alone; Google Business Profile state, prominence, proximity, reviews, and Search Console/analytics require external evidence.

## Optional recommendations

- Add structured data only for truthful, supported page entities and useful eligible features; absence is not automatically an error. [S9]
- Add image/video/news sitemap extensions only when those assets and discovery needs justify them.
- Use `hreflang` only when genuine alternate locale pages exist. [S12]
- Add a sitemap to a small site when it improves deployment checks or Search Console monitoring, not because every site is required to have one. [S5]
- Add Organization or LocalBusiness markup when the entity and visible page facts support it. [S22]

## Speculative or unverified advice to reject

- “A perfect Lighthouse score guarantees higher rankings.” False; Lighthouse is diagnostic and page experience has no single score guarantee. [S14] [S19]
- “Titles must be exactly 50–60 characters” or “meta descriptions must be exactly 150–160 characters.” Unsupported as universal requirements; display truncation varies. [S3] [S4]
- “Every page must have exactly one h1 for Google.” Unsupported as a Google ranking rule; use a clear outline for users and semantics. [S2] [S17]
- “Longer content ranks because word count is a ranking factor.” Unsupported; usefulness and intent matter more than a target count. [S2] [S21]
- “E-E-A-T is a direct ranking factor that can be added to a page.” Incorrect framing. [S2]
- “Duplicate content always causes a penalty.” Incorrect; duplication can be inefficient and confusing without being a manual-action violation. [S2]
- “Meta keywords, LSI keywords, keyword density, or keyword-rich domains are required.” Unsupported or explicitly de-emphasized. [S2]
- “`llms.txt` improves Google rankings or AI citations.” Unverified. Do not audit it as an SEO requirement unless authoritative platform documentation establishes a relevant use.
- Unannounced algorithm changes, correlation studies, and vendor scoring rules are not official facts. Label them as hypotheses and keep them out of severity calculations unless independently verified.

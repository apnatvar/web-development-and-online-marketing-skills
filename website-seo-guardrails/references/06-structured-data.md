# Structured Data

## Decision gate

Add markup only for a currently supported search feature or a clear entity-understanding purpose. It must describe visible page content, use the most specific appropriate type, contain accurate current fields, and live on the page it describes. JSON-LD is generally preferred by Google, but correct content matters more than format.

## Common patterns

- Home/about: `Organization` and `WebSite` with stable IDs and verified identity/contact/sameAs data.
- Hierarchy: `BreadcrumbList` matching visible navigation.
- Editorial: `Article`/`BlogPosting` with real headline, dates, image, author, and publisher.
- Products: `Product` plus genuine `Offer`, availability, shipping/returns where supported; use merchant listings only where purchase is possible.
- Local: the correct `LocalBusiness` subtype with real address, hours, phone, and location pages.
- Courses, videos, events, software/apps, datasets, recipes, jobs, and other types: use only when the page and offering meet feature-specific requirements.

Do not assume every schema.org type creates a Google rich result. FAQ rich-result visibility is restricted; markup may be valid but not displayed.

## Red flags

Never add fake reviews/ratings, fabricated prices or availability, nonexistent jobs/events/courses, self-serving reviews where prohibited, hidden content, irrelevant types, sitewide page-specific markup, stale dates, or organization claims that cannot be verified. Structured data must not contradict visible text.

## Testing

Parse every JSON-LD block, validate with Schema Markup Validator when useful, run Google's Rich Results Test for supported features, inspect live/indexed pages in Search Console, and test dynamic output. Treat successful validation as eligibility only—not a display guarantee.

# New Page Checklist

[Back to index](../index.md)

## Purpose and indexing

- [ ] Define the page's distinct audience, intent, and primary action.
- [ ] Confirm it is not duplicating an existing route.
- [ ] Decide `index` or `noindex` from independent editorial value, not route count.
- [ ] Choose one canonical production URL and link it from a relevant hierarchy.

## Architecture

- [ ] Keep content in a Server Component and add the smallest possible client islands.
- [ ] Prefer static generation unless request-time or per-user state is essential.
- [ ] Use semantic landmarks, one descriptive H1, logical headings, and real links/buttons.
- [ ] Make essential content readable without animation or client hydration.

## Discovery

- [ ] Add a unique title, useful description, canonical, robots policy, Open Graph, and social image where appropriate.
- [ ] Add only structured data that matches visible facts and reuse stable entity IDs.
- [ ] Add breadcrumb data when the hierarchy is visible.
- [ ] Include the route in the sitemap only if indexable; give it an evidence-backed modification date.
- [ ] Update AI-facing summaries/data only when the route changes public business knowledge.

## Loading and interaction

- [ ] Configure hero media for LCP; size and lazy-load below-fold media.
- [ ] Avoid automatic prefetch in bulk link collections; preserve prefetch for likely next actions.
- [ ] Defer heavy below-fold interaction and provide an accessible fallback/loading state.
- [ ] Respect reduced motion and clean up observers/listeners/animation contexts.

## Verification

- [ ] Add focused tests for metadata, indexing, schema, and behavior.
- [ ] Run typecheck, lint, focused tests, build, and rendered-output validation.
- [ ] Check mobile/desktop layout, keyboard flow, reduced motion, and no-JavaScript content.
- [ ] After deployment, verify canonical response, sitemap visibility, and submit the changed canonical through IndexNow if appropriate.

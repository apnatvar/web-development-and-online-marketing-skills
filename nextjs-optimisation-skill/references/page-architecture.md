# Page Architecture

[Back to index](../index.md)

## Model the page before styling it

Define the route's purpose, unique content, hierarchy, and next action. Keep identity/company content, differentiation, services, products, documentation, editorial content, and utilities in distinct information roles. Shared facts can come from one data source without duplicating whole sections across routes.

Use semantic HTML first: header, navigation, main, article/section, headings, lists, links, buttons, forms, and footer. A visually complex experience should still expose coherent source order and readable server-rendered text.

## Boundaries

Default to server-rendered components. Move the smallest interactive leaf behind `"use client"`. Do not pass large data structures into a global client shell when a server component can render most of the interface.

Good client islands include search/filter controls, dialogs, progress, quizzes, analytics listeners, and optional storytelling. Keep metadata, article copy, service/product facts, cards, and navigation structure on the server when possible.

## Shared data

Create typed registries for repeated route facts and derive metadata, sitemap entries, JSON-LD, navigation, and tests from them. Avoid multiple hand-maintained copies of canonical paths, product names, authors, dates, or indexing status.

For large directories, separate compact listing/preview data from detailed records so a homepage, footer, or card grid does not import an entire dataset. Route-specific modules can be dynamically loaded when only one category is needed in the browser.

## Progressive enhancement

Interactive and animated layers must enhance an already understandable document. Preserve stable layout while deferred code loads. When JavaScript fails or reduced motion is requested, users should retain the content and actions—not an empty stage.

## Route patterns

- Homepage: state the proposition early, establish primary audiences/capabilities, expose high-value paths, and avoid importing full downstream datasets.
- Company/about: identity, legal/operating context, people, credibility, and contact path; keep differentiation content distinct.
- Service: problem, audience, scope, process, commercial model, evidence, related capabilities, and a concrete CTA.
- Product/software: what it is, intended user, capabilities, limitations, pricing/offer when real, screenshots/evidence, support model, and CTA.
- High-intent landing page: one intent, clear match between acquisition promise and H1, objections/evidence, and minimal distraction without creating an orphan.
- Blog index: editorial grouping and crawlable article links without loading every article body in the client.
- Article: clear authorship/publisher, publication/revision dates, readable article structure, citations/related links, and an editorial—not disguised commercial—purpose.
- Tools/directories: useful filters as enhancement, server-rendered discovery, curated profile indexability, compact list data, and stable category paths.
- Courses: clear course/module/lesson hierarchy; keep template-heavy lessons accessible within learning flows but index only independently substantive pages.

Related: [SEO](seo.md), [Rendering](rendering.md), [Accessibility](accessibility.md), and [Animations](animations.md).

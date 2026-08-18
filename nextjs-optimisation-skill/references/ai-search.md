# AI Search Visibility

[Back to index](../index.md)

## What is reliable

AI search systems benefit from the same foundations as search and accessibility: public crawl access, server-rendered text, clear authorship and publisher relationships, stable URLs, factual entity graphs, descriptive headings, citations/links, and coherent internal architecture.

Allowing a crawler does not guarantee retrieval, grounding, citation, ranking, or model training. Distinguish user/search agents from training crawlers when explaining policy. For example, OAI-SearchBot supports search discovery, ChatGPT-User represents user-initiated retrieval, and GPTBot relates to model training; these policies can differ. Verify current vendor documentation before changing rules. Choose policies from the site's goals rather than copying a fixed bot list.

## Useful machine-readable surfaces

- `robots.txt` with deliberate policies and sitemap discovery.
- `sitemap.xml` containing only canonical indexable routes and meaningful dates.
- `/llms.txt` as a useful but experimental orientation file, not a prerequisite for Google AI visibility or a replacement for web pages.
- public AI documentation and a stable public business-information endpoint when they expose already-public facts.
- JSON-LD graphs connecting WebPage, WebSite, Organization, Person, Service/Product, article, breadcrumb, and other visible entities.

Keep public AI surfaces synchronized with visible pages. Do not expose private MCP operations, credentials, internal instructions, or customer data. Authenticated/request-sensitive MCP endpoints should remain dynamic and access controlled; public descriptive endpoints can be static and cacheable.

## Content practices

- Answer concrete questions in ordinary language.
- State who publishes and authors the material.
- Separate verified facts from claims or opinions.
- Use stable names for services and products across prose, navigation, data, and schema.
- Maintain useful update dates only after substantive changes.
- Prefer a small set of authoritative pages over scaled near-duplicates.

## What not to claim

Do not promise optimisation “for ChatGPT, Claude, DeepSeek, and all agents” as a guaranteed outcome. Report instead that the site is technically accessible and well structured for compliant crawlers, then name remaining platform-dependent factors: recrawl timing, engine policies, external authority, query relevance, and citation selection.

Related: [SEO](seo.md), [Structured data](structured-data.md), [Rendering](rendering.md), and [Accessibility](accessibility.md).

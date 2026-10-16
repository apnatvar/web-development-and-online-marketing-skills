---
name: nextjs-business-marketing-site
description: Plan, build, improve, and maintain Next.js business and marketing websites using evidence-based decisions for architecture, accessibility, SEO, content, forms, security, performance, and release quality. Use for new marketing sites, redesigns, audits, migrations, and website delivery workflows; adapt to the project's installed framework and business brief.
---

# Next.js Business Marketing Site

Deliver a usable, truthful, discoverable website with an appropriate maintenance cost. This skill is a decision guide, not a visual template or a requirement to introduce every feature it describes.

## Decision priority

Distinguish three classes in plans, recommendations, and implementation:

1. **Required for the applicable surface:** correct HTTP behavior, accurate public facts, protected secrets and personal data, accessible interactions, working navigation/contact, and consistent publication/indexation signals. Identify the requirement or failure it addresses.
2. **Evidence-dependent improvement:** rendering, caching, code splitting, search strategy, page consolidation, conversion changes, and performance work. Establish the actual problem, choose a proportionate intervention, and identify how to verify it. Do not call an unmeasured improvement proven.
3. **Optional direction:** visual identity, typography style, animation, page composition, editorial tone, and vendor choices. Present applicable options and criteria without prescribing a subjective winner.

Explicit user instructions and the receiving project's contributor rules govern scope and authorization. A reference example does not authorize deletion, a URL/indexation change, a dependency installation, a publication, or an external message. Existing authorization is sufficient; do not add repetitive confirmation gates.

## Begin with the actual project

Read its contributor instructions, package manifest/lockfile, relevant installed Next.js documentation, and existing implementation before editing. If the installed release does not ship documentation, use official documentation matched to that release. Infer neither API behavior nor framework conventions from a different release. Locate the canonical origin, business/content sources, route families, shared layout, navigation, forms, deployment configuration, and relevant tests. Inspect working-tree changes and preserve other work.

For a new site, establish audience, offer, verifiable evidence, intended markets, primary visitor task, contact destination, ownership, and publication state. Use [workflow-and-agent-collaboration.md](references/workflow-and-agent-collaboration.md) for research, planning, delegation, implementation, and decision records. Use [rapid-first-website.md](references/rapid-first-website.md) for deliberately small first versions and shortcuts with clear limits.

For a concrete choice, find its question in [decision-guide.md](references/decision-guide.md), then read the relevant detailed reference. Load only the references needed for the current task.

## References by task

| Task | Read |
| --- | --- |
| Repository organization, content registries, reusable modules, dependencies and maintenance | [Project structure and maintenance](references/project-structure-and-maintenance.md) |
| Business brief, audience, page purpose, services/products, journey, experimentation | [Strategy and information architecture](references/strategy-and-information-architecture.md) |
| Headings, main-site copy, CTAs, proof, pricing, factual claims | [Main-site copywriting](references/main-site-copywriting.md) |
| Search intent, metadata, canonicals, schema, robots, sitemaps, feeds, discovery | [SEO and discoverability](references/seo-and-discoverability.md) |
| Articles, guides, comparisons, hypothetical cases, sources, editorial/publishing states | [Editorial content](references/editorial-content.md) |
| Headers/navigation, mobile layout, typography, spacing, accessibility, animation including GSAP/CSS view/sticky | [Design system and responsive layout](references/design-system-and-responsive-layout.md) |
| Server/client boundaries, dynamic loading, fonts/images, FCP/LCP/CLS/INP, caching and compute | [Rendering and performance](references/rendering-and-performance.md) |
| Forms, Telegram, Google Forms alternatives, secrets, API abuse, consent, response security headers | [Security and privacy](references/security-and-privacy.md) |
| 404/410/redirects, method/media handling, migration and actual HTTP verification | [HTTP errors and migrations](references/http-errors-and-migrations.md) |
| Agent-readable HTML/Markdown, content negotiation, public APIs/OpenAPI, MCP boundaries | [Agent-facing interfaces](references/agent-facing-interfaces.md) |
| Test architecture, deterministic visual checks, CI, production isolation, deployment/rollback | [Testing and release](references/testing-and-release.md) |
| Why a pattern was retained/reversed, evidence limits, keeping decisions current | [Lessons and evidence](references/lessons-and-evidence.md) |
| Primary documentation and optional external skills | [Sources and optional skills](references/sources-and-optional-skills.md) |

## Finish proportionately

Make a bounded, reviewable change, update the existing source of truth and affected invariants, and verify at the layer where it can fail. Follow the project's verification budget. When the user requests one pre-commit run, consolidate the applicable checks and repeat only to address discovered failures or meaningful new changes; otherwise choose verification proportionate to the change. A documentation-only edit does not require an application build.

Report the behavior changed, checks actually performed, remaining limitations, and publication/deployment state. Source inspection, passing tests, a local build, a live response, field performance, and business results are different evidence. Never substitute one for another. Keep private research and screenshots local; retain reusable code/tests/instructions in source control and exclude development artifacts from served output.

## Creator

Created by [Brownsmith Dynamics](https://brownsmithdynamics.com). The guidance is general; supply each project's identity, preferences, policies, and operating details at use time.

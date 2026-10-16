# Decision guide

Use these answers to choose a starting point, then read the linked reference for the mechanism and verification. “Required” means applicable correctness, security, accessibility or publication behavior. “Conditional” needs project evidence. “Optional” describes a product/style choice without a preferred aesthetic or vendor.

## Objective requirements first

| Repeated question | Answer and verification | Detail |
| --- | --- | --- |
| What should every page communicate consistently? | Its actual purpose, public facts, publication state and canonical identity; align visible content, metadata, schema and discovery records. | [SEO](seo-and-discoverability.md) |
| Does a custom 404 design prove missing URLs work? | No. Request nonexistent static/dynamic paths and verify status, headers and representation; streamed framework responses need special attention. | [HTTP](http-errors-and-migrations.md) |
| What happens to a deleted page? | Relevant replacement: permanent redirect. No equivalent: genuine 404 or deliberate 410. Keep retirement signals crawlable; exclude old sources from current sitemap. | [HTTP](http-errors-and-migrations.md) |
| Can robots.txt remove old URLs or protect private data? | It controls crawling. It cannot supply a sitemap noindex directive or authenticate visitors. Use actual response/indexing controls or access control as appropriate. | [SEO](seo-and-discoverability.md), [HTTP](http-errors-and-migrations.md) |
| Can every public directory/guide record be indexed? | Public access and search indexability are separate. Index only intentionally reviewed, independently useful canonical content; avoid accidental search/facet/draft explosions. | [Architecture](strategy-and-information-architecture.md) |
| Where do business facts and contact information belong? | In a maintained authoritative source reused by pages and derived formats; protect against stale duplicates and private-data exposure. | [Architecture](strategy-and-information-architecture.md), [Agent interfaces](agent-facing-interfaces.md) |
| What must work before optional animation? | Readable content, keyboard/focus, labels, navigation, reduced-motion behavior, touch input and usable reflow. | [Design](design-system-and-responsive-layout.md) |
| How should a mobile menu behave? | Use correct disclosure/dialog semantics for the interaction; support Escape where applicable, focus handling, background behavior and scroll restoration. Test short screens and orientation changes. | [Design](design-system-and-responsive-layout.md) |
| How do we fix horizontal overflow? | Find the element/constraint first: min-content widths, long tokens, grid/flex shrink, images, hidden-heading rules, fixed controls or sticky offsets. Clipping the whole page can hide the defect. | [Design](design-system-and-responsive-layout.md) |
| How should a form report success? | Only according to its verified processing/delivery contract. Handle provider failure/timeout, validation, pending state and duplicate risk honestly. | [Security/forms](security-and-privacy.md) |
| Can the browser call Telegram with the bot token? | Keep provider secrets and configured destinations server-side. Validate bounded requests before delivery, use timeouts and abuse controls, and disclose data handling. | [Security/forms](security-and-privacy.md) |
| Is a honeypot/origin check enough against spam? | Neither authenticates a client. Use controls proportional to abuse, and distinguish process-local throttling from distributed enforcement. | [Security/forms](security-and-privacy.md) |
| Do consent-denied storage signals mean zero tracking requests? | Provider behavior differs. Describe and test storage, cookieless requests, withdrawal and replay masking separately. | [Security/privacy](security-and-privacy.md) |
| Should every API error return the main HTML error page? | Use JSON errors in defined API surfaces, correct statuses and safe stable error details; preserve page-format errors for page URLs. | [HTTP](http-errors-and-migrations.md) |
| How does Accept-based Markdown avoid cache mix-ups? | Correct negotiation plus Vary/cache-key separation on all relevant responses, preservation of framework navigation, and production HTTP verification. | [Agent interfaces](agent-facing-interfaces.md) |
| Does adding Vary enable Markdown? | No. Verify the served Content-Type and nonempty body for each representation, including errors, HEAD and conditional responses. | [HTTP](http-errors-and-migrations.md) |
| Can public source include tests and research screenshots? | Keep reproducible tests/configuration versioned; private research and captures local. Served assets/runtime must exclude development material. CLI upload ignores do not filter a Git checkout. | [Release](testing-and-release.md) |
| Should a package command call an ignored local-only script? | If documented/shared/CI behavior depends on it, make the implementation reproducible from the repository or clearly distinguish an optional local tool. | [Release](testing-and-release.md) |
| Are successful tests proof of deployment/security/ranking? | They establish asserted behavior under their harness. State source, local runtime, deployed HTTP, field and business evidence separately. | [Workflow](workflow-and-agent-collaboration.md) |

## Conditional engineering and business choices

| Question | Decision criteria and verification | Detail |
| --- | --- | --- |
| Server or client component? | Render public content on the server; put browser state/interaction in a narrow client boundary. Verify serializable props and transitive imports. | [Performance](rendering-and-performance.md) |
| Static or request-time rendering? | Identify what actually varies per request, required freshness, build cardinality and current framework caching mode. Keep request data from making unrelated routes dynamic. | [Performance](rendering-and-performance.md) |
| Should a heavy feature load dynamically? | Defer optional code when it removes meaningful eager work; retain useful HTML and stable loading states. Measure chunks, delay and interaction cost. | [Performance](rendering-and-performance.md) |
| What fixes LCP/FCP? | Identify the real element and delay: server, blocking CSS, discovery/transfer, fonts or paint. A headline can be LCP. Do not preload everything. | [Performance](rendering-and-performance.md) |
| How do we improve INP? | Profile real interactions and long main-thread work. Initial bundle size alone cannot establish responsiveness. | [Performance](rendering-and-performance.md) |
| What prevents CLS? | Reserve geometry for media/embeds/async notices and changing text; inspect font metrics and late insertions in the actual layout. | [Performance](rendering-and-performance.md) |
| Do we need a CMS? | Editing frequency, roles, draft/review, localization and scale versus a typed registry's simplicity and deployment requirements. | [Rapid first site](rapid-first-website.md) |
| Is optimized image delivery always cheaper? | Weigh transfer and LCP benefit against transformation/cache cost and already-sized/vector/animated assets. Verify actual formats and responsive selection. | [Performance](rendering-and-performance.md) |
| Should all links prefetch? | A few likely routes and a large low-intent link collection have different costs. Measure requests and navigation latency before custom intent loading. | [Performance](rendering-and-performance.md) |
| Will smaller Markdown reduce server compute? | It may reduce transfer; runtime HTML fetch/conversion adds work on misses. Compare source generation, caching, warm/cold costs and parity. | [Agent interfaces](agent-facing-interfaces.md) |
| Should we add MCP/OpenAPI/llms.txt? | Only for a useful maintained public capability. Define data/side effects, contracts and ownership; format presence cannot guarantee recommendations or citations. | [Agent interfaces](agent-facing-interfaces.md) |
| More pages or a stronger existing page? | Distinct intent, useful evidence, overlap, visitor task and maintenance capacity. Protect functioning intent and URLs during consolidation. | [Architecture](strategy-and-information-architecture.md) |
| Rewrite positioning or observe an experiment? | Follow the accepted brief, experiment window, query/visitor evidence and business outcomes; corrections need not reopen identity. | [Architecture](strategy-and-information-architecture.md) |
| What is credible proof? | Attribute observed evidence; label proposed examples and forecasts. A technical implementation is not a measured customer outcome. | [Copy](main-site-copywriting.md), [Editorial](editorial-content.md) |
| How do comparison articles earn their place? | A specific decision, comparable inputs/tasks, original analysis, dated capabilities/cost assumptions and clear limitations. | [Editorial](editorial-content.md) |
| How much QA is enough? | Select meaningful checks at the failure layer; batch according to risk and user budget. Review known failures without implying a full clean bill. | [Release](testing-and-release.md) |
| Is a dependency patch acceptable? | Reproduce the installed-version defect, prefer supported fixes, constrain/version-guard any necessary patch, verify real HTTP and define removal. | [HTTP](http-errors-and-migrations.md) |

## Optional directions, without a prescribed winner

| Choice | Options and criteria | Detail |
| --- | --- | --- |
| Typography and visual identity | Solid/outline display type, editorial or geometric faces, restrained or expressive graphics: choose through the brief, readability, content fit and testing. | [Design](design-system-and-responsive-layout.md) |
| Animation | Static composition, small control feedback, CSS transitions/view timelines, sticky layouts or scoped GSAP sequences. Match communication needs and capability; preserve accessibility and fallback behavior. | [Design](design-system-and-responsive-layout.md) |
| Page composition and density | Cards, prose, comparison tables, diagrams, split columns or a single narrative. Evaluate task completion, reading order, phone fit and meaningful whitespace. | [Design](design-system-and-responsive-layout.md), [Copy](main-site-copywriting.md) |
| CTA language and contact channel | Choose accurate action labels and available channels appropriate to the audience. No universal WhatsApp/email/call ordering or button style. | [Copy](main-site-copywriting.md) |
| Form vendor/backend | Hosted responder link, embed, dedicated form service, server-to-Telegram, or durable application storage: compare access, privacy, operations and delivery needs. | [Security/forms](security-and-privacy.md) |
| Editorial voice and length | Use the project's brief, reader task, factual precision and reading context. Do not copy another brand's quotas, forbidden-word list or target read time. | [Editorial](editorial-content.md) |

When no objective winner exists, say so and describe the conditions that would favor each option. When a standard or actual failure supplies an answer, state that requirement before discussing style.

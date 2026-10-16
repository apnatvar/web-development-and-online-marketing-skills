# Lessons, reversals, and evidence limits

This reference preserves reusable decision patterns without a project's private history, business identity, internal URLs, exact messages, audit identifiers or implementation-specific values. Read the relevant technical reference before implementing a pattern. These are reasons to inspect a choice, not proof that one site's result transfers to another.

## Objective invariants that survive redesign

1. A useful visible page, its metadata, schema, canonical and publication/indexation signals must agree.
2. Secret data and privileged operations must not cross a public client/data boundary.
3. Real status codes, representation headers and method behavior matter independently of page presentation.
4. People must be able to understand and operate essential content through the input/access needs in scope, with stable responsive geometry.
5. Contact success, privacy notices, analytics controls and operational handling must describe actual behavior.
6. Test/deployment/measurement claims must identify the layer and conditions observed.
7. Public reusable guidance must be portable; private research and subjective project choices stay in project context.

## Approaches to reconsider and what replaces them

| Tempting approach | Failure or limit to look for | General response | Classification |
| --- | --- | --- | --- |
| Ship all page interactions as a global client application | Ordinary content inherits optional code, providers and data payloads | Identify actual browser behavior and narrow client boundaries; inspect route chunks | Evidence-dependent architecture |
| Site-wide scroll/animation runtime | Cost and changed input/anchor behavior on pages that gain no value | Compare native behavior and scoped enhancement; retain runtime only where its use justifies it | Optional effect; measurable engineering cost |
| Full-card hover transformations/color swaps | False click affordance, changing contrast, distracting reading, sticky touch states | Keep affordances accurate and controls accessible; choose among static surfaces or scoped effects | Required semantics/contrast; optional appearance |
| Reveal content only after a scroll animation runs | Invisible content after unsupported feature, disabled JS, reduced motion or failed initialization | Make readable static state the fallback; enhance supported contexts | Required resilience/accessibility |
| Sticky/pinned sections without height/offset analysis | Unreachable content, obscured focus, nested-scroll traps, blank regions | Account for actual header/viewport/content geometry and disable/simplify where needed | Required usability when feature exists |
| Tight display typography copied into every role | Clipped text, excessive wrapping, unreadable outlines or inconsistent hierarchy | Test readability and reflow by role; leave stylistic treatment open | Required readability; optional style |
| Global CSS selector to fix one layout | Hidden headings, other templates or special containers become wider/broken | Trace selector/cascade and component responsibility; protect intentional hidden/scroll states | Required correctness |
| Hide overflow to make the audit pass | Offscreen content remains inaccessible | Diagnose intrinsic size, position or shrink constraints first | Required content access |
| Arbitrarily preload images/fonts/routes | Resource contention and extra transfer | Prioritize the actual critical resource; measure response and paint | Evidence-dependent performance |
| Treat an H1 LCP delay as an image problem | Image changes cannot address the text/font/render delay | Inspect the actual LCP element and timing breakdown | Required diagnosis; conditional remedy |
| Call a small local timing a speed win | Different caches, stubs, hardware or observation windows explain result | Compare equivalent conditions and separate lab, field and outcome claims | Required evidence precision |
| Generate an indexable URL for each record | Thin, duplicate or maintenance-heavy pages and excessive build work | Separate useful directory access from curated indexable content | Conditional architecture/indexation |
| Solve weak growth by adding keyword lists/metadata fields | Metadata expansion creates no substantive reader value | Investigate query/page fit, useful content, authority and enquiry outcomes | Evidence-dependent strategy |
| Put Product/Offer markup on every commercial concept | Schema claims a concrete product/offer the page does not actually provide | Model the real visible entity/service and disclose price/scope accurately | Required structured-data truth |
| Rewrite successful informational pages into sales pages | Existing intent and reader usefulness are lost | Preserve the answer and connect relevant commercial/proof paths contextually | Evidence-dependent editorial choice |
| Publish multiple synonyms of a positioning article | Repetition without distinct usefulness | Give experiments distinct questions and observe them against business goals | Evidence-dependent content strategy |
| Frequent core-positioning rewrites | Outcomes cannot be attributed; identity drifts with every review | Record the accepted strategy and revisit trigger; separate corrections and optional experiments | Business choice with measurement needs |
| Confuse advertising rejection with Search spam action | Wrong diagnosis leads to irrelevant remediation | Identify the actual product, report, policy and evidence first | Required factual diagnosis |
| Redirect every deleted page home or block its crawl | Irrelevant destinations and unread removal signals | Relevant final redirect or genuine deletion response; keep signals observable | Required HTTP/SEO handling |
| Add a machine format to improve an audit score | Stale facts, invented parallel content or a contract nobody maintains | Define a real consumer and shared source; omit unsupported surfaces | Conditional product choice |
| Add Vary only at source code level | Framework/CDN overwrites it or ignores cache variation | Request each representation through the actual serving path | Required cache correctness when negotiated |
| Runtime Markdown conversion as an automatic compute saving | First request still renders/fetches/converts and cold misses repeat | Separate transfer, conversion, cache invalidation and source-generation costs | Evidence-dependent optimization |
| Honeypot plus per-process limiter as complete form protection | Direct clients and multi-instance traffic bypass intended cap | Bound input, validate delivery and use deployment-wide controls when required | Required threat-appropriate controls |
| Success UI before checking provider output | Visitors believe a lost request was received | Check provider contract and model timeout uncertainty/duplicate risk | Required truthful workflow |
| Treat a consent UI as privacy certification | Provider requests/storage differ from visible labels | Verify actual defaults, storage, withdrawal and disclosures | Required factual alignment; legal scope external |
| Ignore tests/scripts to reduce deployment size | Fresh clone/CI loses commands and regression coverage | Track reusable development inputs; inspect served output separately | Required reproducibility |
| Call .vercelignore a filter for Git integration | Build checkout still contains tracked material | Distinguish CLI upload, build environment and runtime/served output | Required deployment precision |
| Test exact text/classes instead of meaningful behavior | Intentional edits fail while real defects survive | Preserve invariant/contract checks, update stale expectations only after review | Conditional QA design |
| Trust a custom layout checker without fixtures | False positives/negatives give misleading confidence | Include intentional good/bad examples and calibrated exclusions | Required confidence for that checker |
| Treat agent counts/token totals as labor savings | Parallel/idle time and counterfactual estimates get conflated | Label elapsed time, summed runtime, API-equivalent cost and human effort separately | Required claim precision |

## Options that must remain open

Palette, serif/mono/sans selection, outline headings, ASCII illustrations, card compositions, border radius, animation character, contact channel order, copy voice, reading-time targets, specific industry focus and geography are project choices. A useful skill can show implementation constraints and comparison criteria without adopting a brand's preferred answer. An option may fail an objective constraint such as contrast or reachability; fix or reject that implementation without declaring the entire style universally wrong.

Third-party platforms are also choices. A hosted form, Telegram inbox, CMS, static registry, booking link, analytics provider or animation runtime needs an owner and a reason. Compare capability, access, data handling, delivery reliability, maintenance and cost. Do not install a catalog of services to make a small website look complete.

## What this guidance does not establish

No reconstructed history can recover an unrecorded decision or prove why a user preferred a visual. Retained code shows implementation, and reports show only their stated tests/conditions. This skill does not claim a measured ranking, conversion, accessibility-conformance or security outcome for any originating project. Security guidance supplies controls and review questions, not certification; current obligations and platform capabilities require current authoritative sources.

When applying a lesson, record the present project's question and evidence, not the fact that a previous site made a similar change. Revisit decisions after a framework/provider upgrade, new content scale, changed user need, observed failure or comparable outcome evidence. Preserve the general invariant and replace outdated mechanics.

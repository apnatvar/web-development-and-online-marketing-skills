# PageSpeed Insights and manual review

Use this checklist for a requested performance audit or performance-sensitive release. Read [Rendering and performance](rendering-and-performance.md) for implementation choices. Select checks for the affected routes and follow the project's verification budget; this is not a requirement to run every audit after every edit.

## Establish the measurement

Record the deployed URL and version, date, mobile/desktop strategy, Lighthouse version and reported throttling. Use representative route families, including the affected interactive route; a homepage result does not cover the entire site. Distinguish an actual PSI report from a local Lighthouse run or source inspection.

In PSI, record whether CrUX describes the URL or the origin, its trailing 28-day window, and whether field data is unavailable. Missing samples are not a pass or failure. Keep that field history separate from the current lab run; a new release cannot instantly replace it. See [About PSI](https://developers.google.com/speed/docs/insights/v5/about).

Use the actual report's audit names: Lighthouse versions can rename or replace audits. Insights and diagnostics identify investigation targets, not additive guaranteed savings. The performance score is calculated from metrics, not a count of resolved suggestions. Follow [performance scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring).

## Inspect performance findings manually

These are human investigations of automated findings, distinct from Lighthouse's formal manual audits below. Use the [current Performance Insights index](https://developer.chrome.com/docs/performance/insights) to find the applicable audit.

| Area | Inspect and decide |
| --- | --- |
| Document latency and TTFB | Inspect redirects, HTML wait time, server/cache behavior and compression in the waterfall. Find the actual request-time work before changing rendering or caching. Keep private output out of shared caches. |
| FCP and first-screen usefulness | Review the filmstrip and initial HTML: what first becomes visible, and when can the visitor read the main message? Inspect blank loading shells, blocking CSS and fonts. FCP is diagnostic, with a good field threshold of 1.8 seconds at p75; it is not a Core Web Vital. See [FCP](https://web.dev/articles/fcp). |
| Actual LCP element | Identify it separately on mobile and desktop; it may be a headline. Break LCP into TTFB, resource-load delay, transfer duration and render delay. Fix the dominant phase rather than automatically compressing an image. See [LCP optimization](https://web.dev/articles/optimize-lcp). |
| LCP discovery and priority | Confirm an important image is discoverable in initial HTML, appropriately sized and not lazy-loaded. Inspect request initiator and priority. Avoid preloading unrelated assets or hiding main content behind animation or hydration. |
| Render-blocking requests | Follow the critical CSS/script chain and inspect what is needed for first paint. Remove unused work or defer optional work. Critical-CSS inlining is an advanced option, not a default requirement. See [render-blocking requests](https://developer.chrome.com/docs/performance/insights/render-blocking). |
| Dependency chains and connection hints | Inspect serial request chains and critical origins. Add a preconnect/preload only for a demonstrated need; check that it is used and does not compete with more important work. See [network dependency tree](https://developer.chrome.com/docs/performance/insights/network-dependency-tree). |
| JavaScript and chunks | Use the workflow below to inspect initial, shared and deferred code, duplicate modules, payloads and execution. Smaller transfer alone does not establish faster paint or interaction. |
| Images | Inspect selected source, rendered dimensions, transfer size, format, compression and below-fold loading. Reserve geometry and check quality/crop. Verify actual browser selection rather than assuming an image component optimized it. See [image delivery](https://developer.chrome.com/docs/performance/insights/image-delivery). |
| Fonts | Inspect requested families, subsets and weights, preload scope, text visibility during download and fallback metrics. Check the headline transition for shifts. See [font display](https://developer.chrome.com/docs/performance/insights/font-display). |
| Main thread, TBT and INP | Trace script evaluation, long tasks and expensive handlers. Exercise menus, forms and search. Lab TBT helps diagnose blocking but is not field INP or proof of interaction quality. See [TBT](https://web.dev/articles/tbt). |
| DOM, layout and paint | Inspect costly elements and repeated layout reads/writes during scroll or interaction. Reduce measured layout/paint work before introducing virtualization or removing useful content. See [forced reflow](https://developer.chrome.com/docs/performance/insights/forced-reflow). |
| CLS | Inspect the trace's shift sources during loading and later interactions, including fonts, embeds, notices and async results. Reserve space and keep loading states stable. A short navigation trace may miss later shifts; see [CLS](https://web.dev/articles/optimize-cls). |
| Third parties | Attribute network and execution cost by provider; inspect consent-denied and consent-granted states. Defer optional features while keeping required interactions and consent behavior correct. See [third parties](https://developer.chrome.com/docs/performance/insights/third-parties). |
| Repeat visits and caching | Inspect cache headers, content encoding and repeat-navigation requests. Use long-lived immutable caching for versioned assets where supported; keep HTML/data freshness and privacy explicit. Investigate back/forward-cache failures if reported. See [cache lifetimes](https://developer.chrome.com/docs/performance/insights/cache). |

## Review Next.js chunks deliberately

1. Inspect the production route's network requests and a bundle analyzer or Lighthouse Treemap. Separate compressed transfer size from parsed code and execution time; include HTML and RSC payloads, not only JavaScript files.
2. Trace large modules to their import owners. Check shared layouts, client boundaries, icon/chart/animation packages, duplicate dependency versions and oversized serialized props. A heavy optional route should not burden unrelated routes.
3. Record [Coverage](https://developer.chrome.com/docs/devtools/coverage) while loading and using relevant controls. Initially unused code may be required later; do not delete it solely because it was unused during navigation.
4. Remove verified dead imports, narrow boundaries and split genuinely optional features. Use [Duplicated JavaScript](https://developer.chrome.com/docs/performance/insights/duplicated-javascript) to investigate repeated modules. Avoid arbitrary chunk-count or kilobyte targets: splitting everything can create request waterfalls and a slow first interaction.
5. Confirm which chunks actually defer and what happens on first use, client navigation and repeat visits. Retain useful server HTML, stable fallbacks and error recovery. Follow installed Next.js/bundler docs; do not apply webpack-specific configuration to a different bundler.

## Complete Lighthouse's manual audits

The current [Lighthouse configuration](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/default-config.js) includes these accessibility manual audit IDs. Confirm the list against the version in the actual report; upstream main may differ from PSI. Record pass, fail, not applicable or not checked with evidence.

| Audit ID | Human check |
| --- | --- |
| focusable-controls | Reach each control by keyboard with visible focus. |
| interactive-element-affordance | Controls visibly communicate their purpose and current state. |
| logical-tab-order | Tab order follows a coherent task sequence. |
| visual-order-follows-dom | Reading and focus order agree with the visual presentation. |
| focus-traps | Users can leave components; modal focus containment releases correctly. |
| managed-focus | Opening, closing and updating UI moves/restores focus appropriately. |
| use-landmarks | Landmarks support navigating the page's regions. |
| offscreen-content-hidden | Inactive content is appropriately hidden from assistive technology. |
| custom-controls-labels | Custom controls have meaningful accessible names. |
| custom-controls-roles | Custom controls expose appropriate roles, states and behavior. |

Use keyboard and a screen reader for relevant journeys, including menus/dialogs and form errors. A visual review or automated test alone cannot mark screen-reader behavior checked. Manual checks do not contribute to the automated [accessibility score](https://developer.chrome.com/docs/lighthouse/accessibility/scoring); a score of 100 is not full accessibility verification.

For SEO, the [structured-data manual audit](https://developer.chrome.com/docs/lighthouse/seo/structured-data) requires separate validation. Use the linked validators where applicable and confirm the markup describes visible facts; validity does not guarantee rich results. Follow [SEO and discoverability](seo-and-discoverability.md) for broader checks.

Also inspect narrow-screen reflow, zoom, touch controls, media crop and the working contact journey. These supplemental usability checks are not all formal Lighthouse manual audits. Never submit real contact data or trigger external delivery merely to complete a score checklist.

## Report and verify proportionately

For each finding, record route/state, metric or audit, trace/request/element evidence, proposed intervention and a suitable verification. Mark unavailable checks explicitly. Prioritize actual user delay and task failures over chasing 100.

When benchmarking is in scope, agree a bounded comparable before/after sample set, compare distributions or medians and disclose variability. Run checks within the user's budget; repeat only for failures or meaningful changes. Keep reports/traces local and ignored. A checklist update requires documentation validation, not a website performance run.

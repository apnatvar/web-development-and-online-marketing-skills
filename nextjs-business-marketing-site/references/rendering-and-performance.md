# Rendering and performance

Use this reference when building or reviewing a marketing site for loading speed, responsiveness, visual stability, static rendering, code splitting, data payloads, caching, or third-party code. Optimize the visitor’s experience and measured bottlenecks. Do not treat dependency reduction, smaller bundles, local timing, or Lighthouse scores as proof that field Core Web Vitals improved.

Classify guidance as:
- **Correctness and privacy invariants:** route output is correct, secrets and private data never enter client bundles or shared caches, and required behavior works.
- **Evidence-dependent optimization:** rendering mode, code splitting, cache policy, prefetch, font/image priority, and third-party timing should address an observed cost and be measured under comparable conditions.
- **Optional implementation direction:** animation, visual loading treatment, and vendor/tool choices are selected for the project’s needs; they do not have a universal winner.

## Start by locating the delay

Performance is a chain, not one number. Record the route, device class, network/CPU conditions, cache state, consent state, and build/deployment version for every comparison. Separate measurements for a representative content page, a high-interaction page, and a large catalog. Do not compare a warm cache on one run with a fresh cache on another, or mix a localhost result with production field data.

For a slow route, determine whether the bottleneck is server response, render-blocking CSS, discovery or priority of the largest contentful element, image/font transfer, client JavaScript, main-thread work, third-party scripts, or layout instability. Use browser performance traces and network waterfalls to locate the cost. Use production field data for real visitor outcomes and controlled lab tests to reproduce a diagnosis. Core Web Vitals targets guide user experience; they do not guarantee rankings or conversions.

| Metric | Current “good” threshold | What it tells you |
| --- | --- | --- |
| LCP | 2.5 seconds or less at the 75th percentile | Loading of the main visible content |
| INP | 200 milliseconds or less at the 75th percentile | Responsiveness across qualifying interactions |
| CLS | 0.1 or less at the 75th percentile | Visual stability |

Segment field results by device class and evaluate the 75th percentile. See [web.dev Web Vitals](https://web.dev/articles/vitals) for definitions and current thresholds. FCP (First Contentful Paint) is a useful diagnostic for when the browser first paints text, images, canvas, or other non-white content, but it is not a Core Web Vital and the reference does not set an FCP pass threshold. A fast FCP does not mean that the main promise is readable or that the page is ready.

LCP tracks when the largest visible text block or image is rendered. A headline can be the LCP element on a text-led hero; do not assume an image is always the target.

For LCP, separate the time before the HTML response, the delay before the LCP resource is discovered, the resource’s transfer duration, and the delay between transfer completion and paint. An image hidden in CSS or inserted after JavaScript runs can be discovered late. A web font needed to render a headline can also affect when the text becomes the LCP element. Follow the [web.dev LCP optimization guide](https://web.dev/articles/optimize-lcp) and inspect the actual LCP element and its resource timing before changing priorities.

INP concerns the full interaction lifecycle during a visit: input delay, event-handler work, and time for the next visual update. Test the controls people use, especially search, filtering, menus, calculators, and large forms. Keep handlers small, avoid long synchronous work on the main thread, and split or defer expensive computation where it is actually needed. A small initial bundle does not guarantee responsive interaction if one click triggers heavy work.

CLS measures unexpected visual movement. Reserve space for media, embeds, asynchronous notices, fonts, and dynamic content. Avoid injecting late content above what the visitor is reading. Next.js Image and explicit dimensions or aspect-ratio help allocate image space, but do not prevent layout shifts caused by unrelated content or font metrics. See [web.dev CLS guidance](https://web.dev/articles/optimize-cls), [INP guidance](https://web.dev/articles/optimize-inp), and [FCP](https://web.dev/articles/fcp).

## Render stable content on the server

For mostly informational marketing routes, server-rendered content and static output are often suitable when content is known or changes on a predictable schedule. In the App Router, pages and layouts are Server Components by default. Keep secrets, private records, authorization checks, and server-only data access on the server; never pass secrets or another user’s private data into client props, static output, or a shared cache. Make interactive client boundaries only where behavior needs them, and pass a narrow serializable view model rather than a server object graph. Choose a different rendering strategy when the product requires request-specific output or the current framework’s constraints make static rendering unsuitable.

A client boundary is a shipping boundary. A large client component can pull its imports and transitive dependencies into client JavaScript, and props crossing the boundary become part of the rendered client payload. Avoid putting the entire page under the use client directive just to enable one interaction. Avoid importing a large icon, chart, search, or animation library into a root layout when only one route uses it.

Static output reduces request-time work and gives the browser useful HTML early, but build-time computation still has a cost. Large generated datasets, route enumeration, content transforms, image processing, and metadata generation can slow the build or create oversized output. Keep data that is only needed for server filtering on the server. If the client needs search, ship the smallest purpose-built index and result subset that preserves the interaction. Do not import an entire multi-megabyte directory into a shared component and then treat its transfer as the baseline for every route.

### Keep separate performance budgets

| Budget | What grows it | What to measure |
| --- | --- | --- |
| Build work and route cardinality | Static route generation, content transforms, image processing, metadata generation | Build duration, peak memory, generated route count, output size, and failures at production-scale content volume |
| Server request work | Request-time data access, rendering, personalization, API work | TTFB, request CPU/time, backend calls, concurrency, and cache hit rate |
| Browser transfer and execution | HTML, client JavaScript, data payloads, CSS, fonts, images, third-party scripts | Per-route bytes, discovery/priority, parse/execute time, long tasks, and main-thread availability |
| Cache freshness and invalidation | Revalidation interval, tag/path invalidation, deployment cache behavior | Staleness window, invalidation scope, rebuild/refetch work, and whether user-specific data can cross boundaries |

These costs interact, but optimizing one can move work into another. Pre-rendering more routes may increase build time while lowering request-time work. Client-side search may move data transfer and computation to the browser. Longer cache lifetimes may reduce requests but leave stale content; broad invalidation may trigger unnecessary regeneration. Record the freshness requirement and data ownership before choosing cache scope. Never share personalized or secret-bearing output across users to improve cache hit rate.

For dynamic pages, identify exactly what depends on the request. Keep the stable shell and reusable data cacheable where the current framework supports it, while request-specific values remain request-time. In Next.js 16, cache behavior depends on whether Cache Components are enabled; read the installed version’s current App Router caching documentation before changing cache directives or route behavior. Do not copy Pages Router rules, older Next.js defaults, or a previous project’s cache assumptions into an App Router codebase.

Streaming and Suspense can expose a stable shell while slower data resolves, but a loading boundary should be truthful and stable, not a blank screen for content that could be rendered immediately. Check the actual initial HTML and browser behavior; a Server Component is not automatically cheap if it performs expensive synchronous work.

## Isolate optional client code

Consider dynamic imports for client components and libraries that are optional, heavy, or needed only after an explicit interaction. A map, rich editor, large search engine, charting library, video player, or complex motion controller may qualify. Compare the initial bundle savings with added requests, loading delay, fallback behavior, and interaction timing. Preserve useful HTML and behavior before an optional feature loads, and keep its loading state dimensionally stable to avoid CLS.

Dynamic imports do not make server-rendered page data disappear, and a Server Component dynamically importing another Server Component does not automatically defer all server work. Check the framework’s current behavior. Do not disable server rendering for a component merely because it has a small browser-only enhancement. Use client-only rendering only when the component truly depends on browser APIs and a server-rendered fallback is not appropriate.

If decorative animation code is optional, defer it until the experience is relevant and motion is allowed when the expected savings justify the added loading and initialization path. An intersection observer is one possible trigger. Check chunk output and a performance trace to confirm what was deferred and whether initialization creates visual delay or layout change; the code change alone does not prove faster LCP or INP.

Remove unused dependencies and duplicate UI implementations when the repository confirms they have no callers. This reduces maintenance and may reduce install/build/client costs. Verify the actual route chunk and transitive import graph before attributing a user-visible benefit. Replacing one icon package with another is not automatically a meaningful field speedup if both are tree-shaken similarly.

## Images, fonts, CSS, and browser priority

Identify the likely LCP element first. If it is an image, make the source discoverable in initial HTML, use a responsive source and accurate sizes, reserve its aspect ratio, and do not lazy-load it when it is the LCP image. Prioritize only the image that is genuinely important in the first viewport. Preloading many images competes for bandwidth and makes priority hints less useful. Lazy-load below-the-fold media. Verify in DevTools that the browser selected the expected size and priority.

For text-led heroes, confirm which font the browser actually needs to paint the headline. Use the framework’s font system or local font files to avoid unnecessary external font connections and reduce layout shift. Keep font families, weights, and subsets to those used. A font defined in the root layout can be preloaded for every route in that layout; a rarely used display face may belong in a narrower layout or page. font-display: swap can show fallback text quickly, but large metric differences between fallback and final font can still move content. Check the rendered transition and font metrics.

Avoid using a CSS background for meaningful content imagery when an image element would improve discovery, responsive sizing, alternative text, and intrinsic dimensions. A CSS background can be appropriate for decoration; ensure it does not contain the only copy of important information. Give images a precise alt description when informative and empty alt when decorative.

Keep critical CSS small when measurement shows it contributes to rendering delay. CSS animation is not automatically faster than JavaScript; layout and paint cost depend on the properties and affected elements. Transform and opacity can often be composited, but profile the target device and inspect filters, shadows, large layers, and continuous effects. content-visibility: auto can reduce offscreen layout/paint work for long pages, but it does not reduce network transfer or JavaScript execution. Give skipped sections an appropriate intrinsic size and verify anchors, find-in-page, accessibility tree behavior, and scroll position. Use it only where browser support and content structure make it safe.

## Third-party code and navigation prefetch

Third-party analytics, advertising, chat, embeds, and consent tools can add network requests, JavaScript, main-thread work, and privacy considerations. Load them only when configured and when consent permits. Choose a script strategy based on when the feature is needed; lazyOnload is suitable for non-critical analytics work, not a feature the visitor needs before interacting. A consent bootstrap may need to run early to establish defaults, but do not make all third-party tags early by association. Test with and without consent and with the relevant configuration present.

Next.js Link prefetching can make navigation feel faster by downloading route data before click, while spending bandwidth and server resources in advance. It is a tradeoff, not a global good or bad. Keep useful defaults for a small set of likely destinations. For long directories, search results, or a mobile menu that exposes many routes at once, consider disabling automatic prefetch for those links or prefetching only after an explicit intent signal. Compare requests and navigation latency in production builds. Do not build a custom prefetch system unless measurement justifies its maintenance and accessibility cost.

Native scrolling is a low-dependency option that preserves browser behavior. A smooth-scrolling library may be appropriate for a guided experience; scope it to the relevant page, preserve native input and anchor behavior where possible, respect reduced motion, and measure its cost. CSS scroll timelines can progressively enhance an illustration with a static fallback; essential content must not depend on JavaScript or support for a new CSS feature to become visible.

## Measure and report honestly

A useful performance report states the URL/build and device or viewport; whether the run was local or deployed, cold or warm, throttled or unthrottled; whether remote images, analytics, ads, or consent were enabled; which metric and LCP element were recorded; the sample size; whether the result is field data, a Lighthouse run, or a custom browser benchmark; and the comparison baseline.

Do not call a localhost Playwright timing a Lighthouse score or production Core Web Vital. A one-second observation window may miss later layout shifts; a fresh browser context without CPU/network throttling is not representative of a constrained phone; stubbing analytics and remote images removes costs those resources may add in production. Report such runs as narrow local observations and state their limits. Do not claim that SEO or accessibility fixes improved speed when a controlled before/after comparison shows no change. Do not promise conversion or ranking effects from a technical score.

Use Lighthouse or PageSpeed Insights for repeatable lab diagnosis and field data (such as CrUX or Search Console) to understand real-user performance. Run multiple samples and compare medians or distributions rather than selecting the best run. Inspect LCP breakdown, long tasks, network priority, and layout-shift sources. Test representative routes separately: the homepage, a text-heavy article, a media-heavy page, an interactive form/search route, and a large catalog. Do not optimize the unusual large route by making every ordinary route worse.

## Evidence boundaries

Treat implementation changes as hypotheses until a relevant measurement confirms the result. Removing a smooth-scroll library, shrinking a shared chunk, delaying a script, or moving animation code behind an observer can reduce a particular cost, but none by itself proves faster FCP/LCP, better INP, or lower CLS. Compare the same route and conditions before and after. Record cases where a score does not change; that prevents attributing a later result to an unrelated edit.

A local browser benchmark can be useful for regressions and route comparisons, but document its scope. Loopback latency, unthrottled CPU, stubbed remote images and analytics, short observation windows, and no before/after baseline can produce impressive-looking numbers that do not represent real visitors. Call them local observations, disclose the setup, and do not equate them with Lighthouse, CrUX, or production Core Web Vitals.

Large catalogs may be genuine route-specific exceptions. Measure their transfer, computation, and interaction separately. Keep the route’s unusual data volume from contaminating a shared client bundle or becoming the assumed baseline for the rest of the site.

## Next.js version discipline

Next.js APIs and defaults change over time. Before implementing a change, check the package manifest and lockfile, confirm the resolved Next.js and Node.js runtime versions actually installed, and read the relevant App Router guide shipped in node_modules/next/dist/docs for that installation. Follow its version-specific warnings; do not assume documentation for another release applies. For example, Image priority and preload behavior has changed across versions. Cross-check the official [Image](https://nextjs.org/docs/app/api-reference/components/image), [Font](https://nextjs.org/docs/app/api-reference/components/font), [Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading), [Prefetching](https://nextjs.org/docs/app/guides/prefetching), and [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) documentation. For Next.js 16 caching, verify whether Cache Components are enabled and use the matching [caching guide](https://nextjs.org/docs/app/guides/caching-without-cache-components) or [Cache Components guide](https://nextjs.org/docs/app/getting-started/partial-prerendering).

## References

- [web.dev: Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [web.dev: Optimize Interaction to Next Paint](https://web.dev/articles/optimize-inp)
- [web.dev: Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls)
- [web.dev: First Contentful Paint](https://web.dev/articles/fcp)
- [web.dev: Animations and performance](https://web.dev/articles/animations-and-performance)
- [web.dev: Content visibility](https://web.dev/articles/content-visibility)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)

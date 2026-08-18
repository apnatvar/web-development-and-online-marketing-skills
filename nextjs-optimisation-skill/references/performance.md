# Performance and Core Web Vitals

[Back to index](../index.md)

## Measure first

Use field Core Web Vitals when available and controlled lab tests for diagnosis. Record device/throttling, route, build mode, cache state, consent state, and run count. Compare representative route classes; an animated landing page, article, authenticated tool, and large directory have different baselines.

- LCP: identify the actual element, response timing, discovery/preload, resource size, and render delay.
- INP: identify the interaction, long task, hydration, state update, or third-party work.
- CLS: identify unsized media, font swaps, injected UI, delayed ads/embeds, and unstable placeholders.

Do not claim improvement from code inspection alone.

## High-leverage sequence

1. Remove unused global work and accidental client boundaries.
2. Fix LCP media/font discovery and responsive transfer size.
3. Split/defer heavy below-fold or route-specific UI.
4. control link prefetch volume.
5. isolate animation and third-party cost.
6. consider CSS rendering containment for genuinely below-fold sections.

`content-visibility: auto` can skip offscreen rendering, but pair it with a realistic `contain-intrinsic-size` to reduce layout jumps. Apply selectively and test find-in-page, anchor navigation, sticky elements, screenshots, and browser support.

## Third parties

Inventory analytics, ads, consent managers, chat, embeds, and tag managers. Load each library once, at the latest safe strategy. Test before/after consent and with configuration absent. Third-party scripts can dominate INP and network contention even when the application bundle is small.

## Reporting

Report baseline and after values, affected routes, environment, code/payload evidence, and tradeoffs. If only architectural improvements are verified, say that and recommend field follow-up.

Related: [Bundles](bundles.md), [Rendering](rendering.md), [Animations](animations.md), [Images and media](images-media.md), and [Prefetching](prefetching.md).

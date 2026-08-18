# Animation and Scroll Storytelling

[Back to index](../index.md)

Animation is an enhancement, not the content architecture. Render semantic copy, headings, links, and imagery first; let motion change presentation only after the client is ready.

## Load policy

- Keep animation code route-local.
- Dynamically import a heavy engine only when the animated region approaches the viewport or the experience is eligible.
- Gate cinematic/pinned work by appropriate viewport size and `prefers-reduced-motion: no-preference`.
- Use CSS for small transitions where it is sufficient.
- Avoid site-wide smooth-scroll runtimes unless measured user value outweighs accessibility, input, and bundle costs.

## Lifecycle

Scope selectors to a component root. Track cancellation while asynchronous imports resolve. Disconnect IntersectionObserver/ResizeObserver, remove listeners, revert media contexts, kill triggers/timelines, and restore DOM state on cleanup. Refresh scroll measurements only when layout changes require it.

Pinned and scrubbed stories need careful mobile and keyboard testing. Ensure source order remains logical, focus is never trapped offscreen, deep links still work, and the non-animated layout is complete. Decorative scroll-scrub video should have a poster, no eager preload, and no assistive-technology noise.

## Decision rule

Retain distinctive animation when it supports comprehension and measured performance is acceptable. Reduce or remove it when it obscures content, causes motion discomfort, blocks input, shifts layout, or imposes global cost. Do not remove a valuable route-specific experience merely from speculative bundle concern; measure its route separately.

Related: [Performance](performance.md), [Bundles](bundles.md), [Images and media](images-media.md), and [Accessibility](accessibility.md).

# Link Prefetching

[Back to index](../index.md)

Prefetch is a prioritization policy, not a universal on/off switch. Its exact defaults differ by Next.js version and router; read the installed docs.

## Keep automatic prefetch for

- primary navigation and likely next steps;
- a small number of high-intent cards;
- flows where instant transition materially improves completion.

## Disable or delay for

- large directories, tag clouds, footer sitemaps, pagination grids, or dozens of low-intent links;
- expensive routes unlikely to be visited;
- constrained mobile connections where speculative work competes with LCP.

An intent-prefetch wrapper can begin with `prefetch={false}` and restore framework prefetch on hover, keyboard focus, or touch intent. Preserve event handlers, refs, link semantics, and keyboard behavior. Touch signals are noisy; test on real mobile hardware.

Do not disable prefetch everywhere to make one waterfall look quieter. Compare initial request count, transferred bytes, and subsequent navigation latency across representative routes.

Related: [Performance](performance.md), [Bundles](bundles.md), and [Page architecture](page-architecture.md).

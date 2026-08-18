# Performance Audit Checklist

[Back to index](../index.md)

- [ ] Choose representative route classes; do not generalize from the animated homepage or a large directory.
- [ ] Capture comparable lab data and consult field data when available.
- [ ] Identify the LCP element, CLS sources, and long tasks/interactions affecting INP.
- [ ] Compare mobile and desktop, cold and warm navigation, and consent/script states.
- [ ] Inspect Server/Client Component boundaries and hydration scope.
- [ ] Run bundle analysis and inspect route-specific chunks, not dependency size in isolation.
- [ ] Remove unused dependencies/components and narrow barrel imports.
- [ ] Verify image `sizes`, preload/priority, formats, dimensions, and lazy loading.
- [ ] Verify font families, subsets, weights, fallback behavior, and preload scope.
- [ ] Inspect prefetch volume on headers, footers, cards, directories, and mobile navigation.
- [ ] Defer below-fold heavy UI and route-specific data without hiding meaningful HTML.
- [ ] Load animations only where used; gate by viewport/reduced motion and clean up.
- [ ] Inspect analytics, ads, CMP, embeds, and other third parties separately.
- [ ] Re-run the same measurement and report numbers, environment, tradeoffs, and uncertainty.

# Performance audit guidance

Load only for technical or combined audits.

## Measurement order

1. Record environment and standardized Lighthouse settings.
2. Run three cold-cache Lighthouse tests per page and aggregate medians.
3. Identify the measured element/resource/task behind a failing metric.
4. Separate lab diagnostics from field Core Web Vitals.
5. Recommend the smallest change that removes the verified bottleneck.

## Interpretation

- Treat LCP, CLS, TBT, load timing, and category scores as variable performance measurements.
- Treat network/server timing, third-party responses, and cache behavior as environment-dependent.
- Never use TBT as if it were field INP. Use TBT to find blocking work; use field INP for real-user interaction conclusions.
- Do not prioritize by Lighthouse point loss alone. Consider visible delay, conversion path, breadth, confidence, and effort.

## Repair map

- LCP: identify the LCP element; reduce server/render delay; make the resource discoverable; avoid lazy-loading the LCP image; right-size/compress it.
- CLS: reserve media/embed/ad space; stabilize font metrics; avoid late content above existing content.
- Long tasks/TBT: reduce hydration and bundle size; split tasks; delay non-essential work; profile rather than guessing.
- Render blocking: shorten critical chains; load non-critical CSS/scripts later; avoid indiscriminate preloads.
- Images: emit dimensions, responsive candidates, accurate `sizes`, and appropriate formats/quality.
- Fonts: subset, limit families/weights, preload only critical faces, use a deliberate display strategy, and test fallback metrics.
- Caching/compression: use fingerprinted immutable assets and safe HTML revalidation; enable Brotli/gzip for compressible responses.

Always state what was measured, what remains a likely cause, and how the user can verify the repair.

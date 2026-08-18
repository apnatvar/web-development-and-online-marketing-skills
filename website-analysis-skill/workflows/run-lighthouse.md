# Run standardized Lighthouse

Read `config/lighthouse-baseline.json` and use `config/lighthouse.config.cjs` unchanged for comparable runs.

1. Confirm Lighthouse 13.4.1 and Chrome/Chromium are available. Record exact runtime versions and warn when they differ from the baseline major/version.
2. Use mobile viewport 412×823 at device scale factor 1.75, simulated throttling, 4× CPU slowdown, 150 ms RTT/request latency, 1638.4 Kbps download, 750 Kbps upload, and cold storage reset.
3. Measure performance, accessibility, best practices, and SEO.
4. Run three times per page. Keep every LHR JSON separately.
5. Compute the median for category scores, audit scores, and numeric metrics with `scripts/calculate-medians.mjs`.
6. Keep the median summary separately from the editorial report.
7. Treat HTML/metadata rule results as deterministic where appropriate, many accessibility/best-practice results as relatively stable, performance timings as variable, and server/network/third-party behavior as environment-dependent.

Never call standardized throttling perfectly deterministic. Use field CrUX/RUM at the 75th percentile for real-user Core Web Vitals conclusions.

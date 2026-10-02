# Server Build and Deployment Compute

[Back to index](../index.md)

Optimise the work a deployment performs, not only the bytes a browser receives. Treat total cost as several interacting budgets:

`build work + deployed artifact size + request compute + cache churn + transformations + background work + telemetry + transfer`

A change can move cost between budgets. Static generation removes repeated request work but can make every deployment regenerate thousands of pages. Disabling image transformation removes transformation and cache-write work but can increase transfer and LCP time. State which budget is expected to fall and which may rise.

## Establish a server-side baseline

Use provider usage data when available and inspect a production build locally. Record:

- build duration, route count, prerender count, and unusually slow route families;
- static, revalidated, streamed, and request-rendered route classes;
- function invocation count, duration, memory, cold starts, bundle size, and region;
- cache hit, miss, stale, revalidation, and invalidation behavior;
- image transformations, cache reads/writes, qualities, widths, formats, and source families;
- middleware/proxy invocations, scheduled jobs, webhooks, log volume, and outbound API calls.

Do not infer runtime behavior from source syntax. Next.js caching and route configuration change between versions. Read the installed framework documentation, inspect the generated route table/artifacts, and verify representative deployed responses.

## Control route cardinality before micro-optimising

Build cost is often `number of generated routes × work per route`. Look for dynamic segments backed by large datasets, nested parameter products, locale multiplication, tag/category archives, filters expressed as paths, and duplicated metadata/data reads.

- Prerender stable, valuable, intentionally published pages—not every record that could technically render.
- For a large searchable catalogue, keep all records in the directory but generate detail pages only for editorially reviewed, indexed, contractual, or demonstrably high-demand records. Return a real 404 for unpublished detail paths when that is the intended contract.
- When every detail URL must exist, consider on-demand generation or revalidation rather than rebuilding the full corpus. Accept that the first request can be slower and that cache capacity/invalidation now matter.
- Avoid generating crawlable combinations for sort, filter, pagination, and faceted state unless each route has independent user value. Query-state or client filtering can prevent combinatorial builds, but must not hide content that needs an indexable page.
- Generate shared indexes once. Do not parse a large file, fetch the same CMS collection, or calculate the same graph independently for every route when version-compatible request/build memoization or a publishing-time artifact can share the result.

Do not reduce the prerender cohort solely to make a build chart smaller. Static pages may be the best choice for predictable latency, resilience, crawlability, and traffic spikes.

## Keep stable work out of request execution

- Keep public pages, metadata, sitemaps, feeds, manifests, and read-only data endpoints static or deliberately revalidated when their inputs allow it.
- Locate calls to cookies, headers, authentication, request search parameters, uncached data, and other request-bound APIs. Keep them below the smallest possible boundary so they do not make a shared layout or route family dynamic.
- Cache expensive deterministic reads at the correct layer: per-render memoization prevents duplicate work inside one render; a framework/data cache can reuse work across requests; a CDN can prevent the function from running at all. These are not interchangeable.
- Prefer publishing-triggered invalidation when updates are event-driven. Very short time-based revalidation can create steady background regeneration even when content never changed.
- Prevent cache-key explosion. Do not vary cached output on incidental headers, raw query strings, tracking parameters, or unbounded user input.
- Never cache personalized, authorized, tenant-sensitive, or rapidly changing data under a shared key. A compute saving is not worth a data leak or stale transaction.

## Reduce function and request amplification

- Inspect the actual traced/deployed function contents. Keep large datasets, build tools, optional adapters, browser packages, and unrelated SDKs out of request bundles. A dependency that is server-only can still increase cold-start and deployment work.
- Import heavy conditional capabilities only in the branch that uses them. Do not split tiny hot-path modules merely to improve a bundle report.
- Narrow middleware or proxy matchers. A root matcher can bill and add latency for static assets, image requests, health checks, and routes that do not need authentication, localization, or rewriting.
- Avoid sequential or repeated calls to the same upstream. Parallelise independent reads within upstream limits; batch compatible reads; cache safe results; and move non-user-visible fan-out to a queue or publishing workflow.
- Reuse database, HTTP, and SDK clients at module scope only when the runtime and library support concurrent reuse. Never keep request identity or mutable user state in process globals; modern serverless instances may handle concurrent requests.
- Put functions close to the stateful data source rather than reflexively close to every user. Multi-region execution can increase database latency, connection counts, cache fragmentation, replication requirements, and consistency risk.
- Keep CPU-heavy conversion, crawling, media work, search indexing, email fan-out, and AI calls off the synchronous response when the user does not need the result immediately. Background work must be idempotent, observable, retry-safe, and bounded.
- Do not recompress assets or generate invariant files inside a request when the build, object store, CDN, or source pipeline can do it once.

## Spend transformations where they return value

Image optimisation is a workload with cache reads, writes, transformations, and transfer consequences.

- Preserve responsive optimisation for large owned product media, user uploads, and likely LCP images where format and width negotiation materially reduce bytes.
- Consider `unoptimized` or direct asset delivery for already-sized editorial images, very small files, SVGs, animated formats, or a trusted upstream image CDN. Apply it per source/use case rather than globally.
- Limit configured widths, qualities, formats, local patterns, and remote patterns to real design requirements. Every unnecessary combination can create another transform/cache variant.
- Prefer stable versioned local assets when the file is part of the product and changes only with deployments. Prefer upstream transformation when the upstream already produces the exact responsive variants and caching contract the site needs.
- Verify the generated HTML and network URLs. A component name does not prove whether the deployment platform transformed the image.

Do not bypass optimisation for large responsive photography without measuring transfer and LCP. Lower platform compute can become higher bandwidth, slower pages, and more end-user energy use.

## Make builds reproducible and incremental

- Cache dependency and compiler artifacts only through mechanisms supported by the build platform. Include lockfiles and configuration in cache invalidation; a fast poisoned cache is worse than a clean build.
- Avoid network-dependent build inputs when a pinned local asset is appropriate. Local fonts and versioned schemas improve reproducibility, but create an update and licensing responsibility.
- Move expensive content normalization, search-index generation, or media derivation to a publishing step when its source changes far less often than application code. Commit or store the artifact only when the repository's source-of-truth policy permits it.
- In a monorepo, skip deployments for provably unaffected changes using the provider's supported affected-project mechanism. Include shared packages, lockfiles, configuration, content sources, and code generation in the dependency boundary.
- Keep previews representative enough to catch failures. Sampling content or skipping expensive integrations can save preview compute, but production-only differences must be explicit and tested elsewhere.
- Do not add custom build-output machinery merely to outperform framework defaults. It increases maintenance and can bypass framework/platform guarantees; use it only with measured need and owned expertise.

## Scheduled work, logs, and invisible spend

- Consolidate compatible scheduled jobs and process bounded batches instead of invoking one function per item. Avoid synchronized schedules that stampede the same database or API.
- Make webhooks authenticate early, deduplicate before expensive work, and return quickly when processing can continue safely in the background.
- Sample high-volume success telemetry and retain detailed error traces where they help diagnosis. Remove debug logs from hot paths and avoid logging large request/response bodies, secrets, or personal data.
- Set timeouts and retry limits for outbound calls. Retries without idempotency or a dead-letter path can multiply both cost and side effects.
- Delete unused cron routes, preview hooks, analytics relays, image variants, and legacy redirects only after verifying they have no remaining callers or contractual purpose.

## Decision table

| Change | Primary saving | Reason not to use it |
| --- | --- | --- |
| Prerender only a curated detail-page cohort | Build time and artifacts | Non-generated pages may lose guaranteed low latency or cease to exist |
| Generate long-tail pages on first request | Deployment build work | Cold first request, runtime/cache cost, invalidation complexity |
| Make a route fully static | Invocations and request duration | Incorrect for personalized, authorized, or always-current data |
| Increase cache lifetime or use event invalidation | Origin work and regenerations | Staleness or missed invalidation can be worse than cost |
| Narrow middleware matchers | Invocations and latency | Excluded routes may miss required auth, locale, headers, or redirects |
| Shrink function traces and lazy-load rare SDKs | Cold start, upload, memory | More chunks/branches and delayed first use can complicate reliability |
| Place compute beside the database | Query latency and duration | Users far from that region may see more network latency |
| Use multiple compute regions | User-to-function latency | More connections, cache fragmentation, replication and consistency work |
| Bypass selected image transformations | Transform/cache operations | Larger transfers and weaker responsive delivery |
| Restrict image widths, qualities, and formats | Variant count and cache churn | Too few variants can waste bytes or reduce visual quality |
| Move work to queues or publishing time | Synchronous duration and timeout risk | Eventual completion, retries, monitoring, and idempotency become mandatory |
| Cache build/compiler artifacts | Build duration | Incorrect invalidation can produce stale or broken deployments |
| Skip unaffected monorepo deployments | Build and preview usage | An incomplete dependency graph can silently skip required releases |
| Reduce success-log volume | Ingestion, storage, and serialization | Less evidence during intermittent incidents |

## Verification

After changes, compare the same representative build and traffic conditions. Confirm:

1. intended routes still exist, index, redirect, or 404 correctly;
2. build route count and static/dynamic classifications match the publishing policy;
3. cache headers and provider cache status behave across miss, hit, stale, and invalidation;
4. authenticated or personalized responses never enter a shared cache;
5. function regions, bundles, middleware matchers, scheduled work, and retries match the design;
6. image URLs show the expected transformed or direct-delivery path;
7. freshness, first-request latency, transfer size, and observability did not regress beyond the accepted trade-off;
8. provider usage is compared after enough real traffic to distinguish a structural saving from a warm-cache accident.

Related: [Rendering](rendering.md), [Performance](performance.md), [Bundles](bundles.md), [Images and media](images-media.md), [Validation](validation.md), and [Pre-deployment checklist](../checklists/pre-deployment.md).

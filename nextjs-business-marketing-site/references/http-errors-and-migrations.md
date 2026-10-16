# HTTP errors, representations, and URL migrations

Return HTTP semantics that match the route outcome. A polished error page does not make a missing route a 404, and a redirect is not useful unless it points to a working destination.

## Choose the status before the presentation

Use 404 when a path does not identify a current resource. Use 410 only when a resource is deliberately and permanently gone and that distinction serves a real lifecycle need. A custom not-found component controls presentation; verify the status and headers through the actual response path. In streaming frameworks, a not-found decision reached after response headers have been sent may legitimately render the not-found UI with status 200 and a noindex signal. If a consumer, crawler, API contract, or migration requires a real 404, resolve existence before streaming begins and test the status explicitly; do not infer status from the visible page. For unknown dynamic slugs, reach the framework’s not-found path instead of returning an empty shell.

When a page moves, redirect directly to its final canonical destination. Avoid chains and broad rules that send unrelated unknown paths to the homepage. Keep current canonical pages in the sitemap and remove retired sources. Leave retired source URLs crawlable so search engines can observe the redirect or deleted status; robots blocking prevents them from seeing the response. For a deleted page without a replacement, return 404 or a deliberately selected 410, with an appropriate noindex signal. Do not redirect unrelated content merely to avoid a not-found response.

## Method and error semantics

For an unsupported method, return 405 with an Allow header. Expose OPTIONS only when its behavior is defined; support HEAD with the same status and relevant headers as GET but no body. Return API-shaped errors from API namespaces and HTML errors from page namespaces. Unknown API routes should return JSON 404s rather than falling through to an HTML page. Use stable machine-readable codes, a human-readable message, and a safe next step. Avoid stack traces, internal URLs, credentials, and provider response bodies.

If a response varies by Accept or another request header, include the matching Vary value. Do not use shared caching for a private or personalized response. Test status, Content-Type, headers, and body together; status-only checks can miss a wrong representation or cache leak.

## HTML and Markdown negotiation

When one URL serves HTML and Markdown, treat the formats as representations of the same resource:

- Parse Accept media ranges, specificity, q-values, q=0 exclusions, wildcards, and ties. Respect explicit exclusions and define the server’s deterministic tie preference; one reasonable policy honors an explicit Markdown request when equally preferred. Absent or generic wildcard Accept can retain the browser’s HTML experience.
- Put Vary: Accept on HTML, Markdown, error, and conditional responses that can differ by Accept. Ensure the CDN cache key respects it before enabling shared caching. If that cannot be established, prefer private/no-store behavior.
- Keep RSC, router prefetch, and segment-navigation requests on their framework path. Do not rewrite them as page content.
- Overwrite any internal negotiation marker supplied by the caller. An external request must not force a special error route or bypass routing.
- Ensure normal pages, assets, and redirects survive the fallback. Run the fallback after ordinary routes and redirects, then check real and missing dynamic routes through HTTP.
- A Markdown missing-page response should have status 404, Markdown Content-Type, Vary: Accept, and noindex. Preserve the HTML error response for HTML clients.
- A direct Markdown representation endpoint should accept a registered same-site path, not an arbitrary URL. Fetch from a trusted deployment origin, never a caller-supplied URL, Host, or forwarded-host header. Do not forward cookies or authorization. Bound source response bytes and fetch duration, handle redirects explicitly, and require a successful HTML response.
- Parse the HTML without executing scripts. Remove navigation, scripts, decorative or implementation-only nodes, controls, and unsafe links; retain meaningful text, including intentionally screen-reader-only text, tables, links, sources, and code. Do not treat every visually hidden node as meaningless; preserve accessible names and instructions that are part of the user-facing content. Forms should point the visitor to the interactive HTML page. Client-only behavior cannot be represented as server-rendered prose.

Cache generated Markdown separately from HTML and validate the path before using it as a cache key. ETags and conditional requests can reduce repeat transfer. A framework data cache can reduce repeated conversion after a fill, but the first request still fetches and converts the source page. Confirm final Vary and cache behavior over HTTP through the actual hosting path.

## Framework-specific header workarounds

If a framework version or adapter overwrites response headers, reproduce the issue against the installed runtime and verify current upstream behavior before patching dependencies. Compare the local Node/Edge path with production. Any patch should be narrow, version- and source-guarded, fail on unexpected changes, have an owner and removal condition, and be covered by production HTTP assertions. Do not copy a workaround from one project into a starter as a general Next.js requirement. Recheck it after framework upgrades.

## Migration verification

Maintain a current list of redirects from the application configuration and separately retain historical paths that are important to keep retired. Browser HTTP checks should verify each applicable source returns the intended permanent status and exact Location, and that internal targets work. Keep external destinations in a separate live check because local tests cannot establish availability of a third-party provider.

Also verify representative missing routes, dynamic slug families, retired API routes, and deleted pages. Assert noindex where required, keep old paths outside the sitemap, and confirm crawlers are allowed to request redirect and deleted sources. Avoid freezing an old total number of paths into a test; inventories evolve as site architecture changes.

A local production build can expose framework routing and header behavior but cannot establish CDN cache keys, external destinations, or provider-level response transformations. Repeat focused checks after deployment and state which layer was observed.

## Primary references and maintenance

Check current framework documentation for the installed version before relying on route, streaming, or header behavior. The relevant primary references include [Next.js not-found convention](https://nextjs.org/docs/app/api-reference/file-conventions/not-found), [Next.js notFound function](https://nextjs.org/docs/app/api-reference/functions/not-found), [Next.js loading and streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading), and [HTTP Semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

Keep framework and security-sensitive dependencies on maintained versions. When a concrete concern arises, inspect the affected package and runtime, review the vendor’s security advisories, and run a scoped vulnerability check appropriate to the dependency and lockfile. Do not make a blanket scanner run an automatic release gate without a defined risk model, ownership, and response process; report what was checked and what it can establish.

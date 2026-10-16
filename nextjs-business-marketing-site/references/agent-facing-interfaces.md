# Agent-facing website interfaces

Machine-readable interfaces should expose a small, intentional view of the business and remain consistent with the human site. Treat them as public product surfaces: decide the audience, data, side effects, cache behavior, and maintenance owner before adding formats or endpoints.

## Discovery and public data

A useful discovery path can connect a concise llms.txt, sitemap, human-readable API documentation, OpenAPI, and structured public-business information. Keep facts and canonical links consistent across them. Build representations from shared data where practical so offers, contact options, names, and URLs do not drift.

Expose only information intentionally published on the website. Exclude private CRM data, contact submissions, drafts, analytics records, credentials, and internal editorial notes. Separate read-only public facts from operations that trigger side effects. A contact submission sends personal information to a configured provider; document this clearly, link human visitors to the contact page, and do not present it as an autonomous lead-generation action.

An unauthenticated API contract means the described endpoints are public. It is not a template for privileged operations. Document methods, stable operation identifiers, request/response schemas, formats, pagination, limits, statuses, errors, and retry expectations. Explain rate-limit scope, Retry-After, CORS behavior, origin checks, and provider outages accurately. A per-process in-memory cap is not a global quota.

Keep the docs and implementation in parity. Validate the OpenAPI document with a parser, validate response bodies against schemas and formats, compare documented operations to implemented routes, and request representative operations from a local production server. Also test unknown routes and unsupported methods. Source tests can check generated paths and metadata; only HTTP tests observe the served status, headers, and body for that build.

## Contract stability and safe retries

Treat public schemas as compatibility promises. When operations change, update examples, API docs, discovery files, tests, and clients together. Prefer additive optional fields when meaning stays stable; provide a migration path for breaking changes. Define deterministic ordering and bounded pagination so responses cannot grow without limit.

Describe retry behavior for every side-effecting operation. A timeout can leave a caller unsure whether a request was processed. For any operation that delivers a message, creates a record, or otherwise mutates state, consider idempotency keys and duplicate handling before encouraging automatic retries. Return Retry-After only when the server provides a meaningful wait and document the actual enforcement scope. Keep GET safe and read-only; do not hide a write behind GET or an agent-specific format. Cap response size for directories that may grow.

Make cache behavior explicit. Public stable facts may be cacheable; private, personalized, or contact-related responses generally should not be shared. Include Vary when representations depend on request headers. Do not assume every CDN honors every arbitrary Vary key.

## Markdown as a representation

Markdown should represent the public server-rendered page, not invent a parallel content source. Parse Accept with media specificity, q-values and exclusions. Define a deterministic preference on ties, such as honoring explicitly requested text/markdown when equally preferred; retain HTML for absent/generic browser requests and preserve framework navigation. Use the same canonical page data and preserve useful headings, links, tables, sources, and code. Remove navigation duplication, scripts, genuinely hidden implementation content, controls and unsafe URLs; preserve meaningful accessible text such as screen-reader-only labels when it contributes to the public content. Turn interactive forms into links to the HTML page instead of implying the Markdown can submit them.

Constrain conversion to registered public paths. Select the source origin from trusted deployment configuration rather than caller input or forwarded host values. Do not forward cookies or authorization. Require the expected HTML status and type, use a timeout and byte cap, and handle redirects deliberately. Treat returned HTML as untrusted data: parse without script execution and filter link and media protocols.

Keep Markdown cache keys bounded to known paths and trusted origin. Use ETags where useful, and keep representation-specific responses private unless the cache layer is confirmed to key by Accept. Remember that a cache hit may save future work but cannot remove first-request fetch and conversion cost. Verify the final Content-Type, Vary, status, and cache headers through the deployment path.

## Contact tools and human handoff

An agent-facing interface should guide a person to the appropriate public contact route and state uncertainty when information is absent. Do not invent prices, availability, case studies, products, or capabilities. Keep the contact action clearly user-directed and preserve the same consent, privacy notice, spam controls, and provider disclosures as the human form.

Do not claim an MCP server, plugin, or tool is public based only on an article, source code, roadmap, or private deployment. Verify that its endpoint is reachable, identify its current protocol and version, understand authentication, and test its actual responses. A website instruction file is not itself a deployed agent runtime. Avoid readiness-score chasing; prioritize accurate facts, discoverability, stable schemas, safe side effects, and useful handoff.

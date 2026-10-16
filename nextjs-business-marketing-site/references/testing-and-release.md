# Testing, QA, and release evidence

Choose checks that answer a concrete question at the layer where a failure can occur. Unit tests can prove a validator’s behavior; they cannot prove that a router, proxy, CDN, or external provider returns the expected response. Label evidence as source-level, local production build, deployed HTTP observation, or provider observation.

## Layered verification

- **Unit and component tests:** cover input schemas, boundary values, rate-limit windows, consent transitions, storage fallbacks, accessible controls, and generated public data. Use controlled clocks and mocked providers. Assert important non-events, such as invalid input never triggering delivery.
- **Contract tests:** parse OpenAPI, validate representative response bodies against the intended JSON Schema dialect, check methods/media types/required headers, and compare advertised operations with implemented routes.
- **Production HTTP checks:** build the application, start that build on loopback, disable outbound delivery credentials, wait for readiness, make focused requests, and stop child processes in cleanup even on failure. Check status, Content-Type, Vary/cache headers, body, ETag/304, HEAD, redirects, unknown API paths, unsupported methods/Allow, and malformed or oversized form bodies. Require loopback so a valid contact test cannot reach production.
- **Browser and migration checks:** test user-visible interactions and actual HTTP routes against a local production build. Derive redirect checks from current configuration, verify status and Location, and confirm internal targets respond. Check representative unknown dynamic routes and deleted URLs for true 404/noindex behavior.
- **Build and source hygiene:** keep tests, fixtures, QA docs, reusable runners, and required test configuration available to clean clones. Keep generated reports, screenshots, traces, research notes, and temporary build copies ignored. Check runtime imports so tests and local tools do not enter the served application.

A local production build is useful for framework routing and rendering; it cannot prove CDN behavior, public DNS, external redirects, or provider configuration. Run focused post-deployment requests through the real hostname when a change depends on those layers.

## Contact-flow checks

Cover media type, declared and streamed size, UTF-8 byte counting, invalid JSON and schema cases, origin mismatch, honeypot behavior, missing provider configuration, provider rejection/timeout, successful delivery, normalized contact-key limits, Retry-After, and safe error output. Never put real credentials or real customer payloads in fixtures. The HTTP test runner should blank delivery secrets and reject non-loopback targets.

For Telegram delivery, test with a mocked upstream response and synthetic form data. Verify the fixed destination comes from server configuration, a successful result is required before returning success, and the token and message content do not enter logs. Test timeout and ambiguous-delivery behavior without retrying against the live provider. Keep a separate, manually controlled smoke check with a synthetic message if an actual credential path needs validation.

For Google Forms, verify the published responder link in a signed-out browser, not the editor URL. If embedded, test the frame at phone and desktop widths, the direct fallback, keyboard access, and page performance. Confirm the form’s own response permissions and retention settings with the owner. Avoid treating an undocumented POST endpoint as a reliable integration to test.

## Consent, headers, and cache checks

For consent, cover the pending default, lookup timeout/failure, unknown region, saved accept/reject, expiry and future timestamps, storage denial, session fallback, cross-tab updates, withdrawal, known-cookie cleanup, and provider calls. Check execution order so consent defaults precede optional tags. These tests do not establish legal sufficiency or live provider project settings.

For headers and negotiated representations, check the body and headers together for HTML, Markdown, JSON, redirects, 404/410, and 304. Test Accept q-values, wildcard and exclusion behavior, HEAD, framework navigation bypass, spoofed internal markers, and cache variation. Then inspect deployed headers and CDN behavior; source configuration alone cannot establish the effective policy.

## Release and reproducibility

Build the exact candidate from a clean checkout and use the installed framework documentation for its version when routing or adapter behavior changes. Confirm required environment variables are server-side secrets. Check contact delivery, analytics consent, privacy copy, redirects, true 404s, and representative security headers through the deployed hostname. Report which environment and behavior were observed and which checks remain unavailable.

Keep build and upload paths distinct. A CLI ignore file can exclude files from a CLI upload; a Git-integrated deployment still clones tracked source. Keep tests and development instructions out of public assets and production runtime imports, while preserving tracked tests and scripts that package commands or CI actually call. Search scripts, workflows, docs, and install hooks before removing a locally ignored utility.

Framework patches should not be copied into a reusable starter as defaults. If a header or routing bug requires a dependency patch, reproduce it on the installed version and deployment adapter, check upstream behavior, pin the exact source assumptions, fail on version/source drift, test the final HTTP response, and write down an owner and removal condition. Review after upgrades and remove when no longer needed.

Have a rollback path for changes that can interrupt leads, break canonical URLs, or mis-handle consent. Avoid repeated live submissions or automatic retries that can duplicate external messages. Do not claim the entire suite passed from selected tests or a single report. Keep reports local, omit machine-specific paths and personal data from public documentation, and state the scope of the evidence plainly.

## Deterministic visual and interaction QA

Choose representative routes and states from the actual site rather than taking one homepage screenshot. Cover relevant combinations of route, viewport, theme, and motion preference, including open and closed navigation, validation and submission states, search results or empty states, and a long article or guide with its table of contents. Keep the matrix small enough to run reliably and expand it when a changed feature adds a meaningful state.

Make runs reproducible: pin the browser/runtime and fonts, use synthetic fixture content, set storage and consent explicitly, control the clock where dates matter, and stub network responses that would otherwise vary. Wait for an explicit readiness condition such as fonts loaded, images settled, and application state ready; do not rely on a blind fixed sleep. Keep realistic external-network performance checks separate from deterministic layout checks so a third-party delay does not make geometry results nondeterministic.

Capture console errors, page errors, and failed assets, then classify known optional failures separately from broken site behavior. Measure objective regressions: horizontal overflow, clipped text, unexpected overlap, fixed or sticky elements covering content, table-of-contents links reaching the intended section, dialogs and menus opening and closing accessibly, and interactive targets remaining usable. Exclude legitimate local scrolling containers and screen-reader-only content from simplistic overflow or visibility rules. Record affected route, state, viewport, and element in findings. A visual difference alone is not a defect when it reflects an intentional style choice.

Prove the auditor itself with paired fixtures: a deliberately broken page that should trigger each important rule and a valid page that should not. This checks both detection and false positives. Give findings a severity tied to user impact, and support concise text plus machine-readable JSON output. Treat WCAG 2.2 AA’s 24 CSS-pixel minimum target-size criterion with its stated exceptions as a criterion to evaluate; the 44 CSS-pixel enhanced target is AAA guidance, not a universal AA pass threshold. Cite the [WCAG 2.2 target-size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) and, when discussing the larger target, [target-size enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced).

Run visual checks against an isolated local production build with outbound side effects disabled. Merely ignoring an environment variable or relying on an environment label is insufficient if the test could still reach a live delivery endpoint; enforce loopback targets, blank credentials, and mock provider calls. In CI, use least-privilege credentials, avoid live form submissions, and summarize text findings. Keep screenshots and traces local or under explicit short retention because they can contain personal or machine-specific information. Plan a bounded set of checks before the change, run the relevant set once, and add another run only to investigate a failure or verify a changed fix. Documentation-only edits generally do not justify rerunning application tests.

For contact integrations, test submission-state semantics: a client click is not proof of delivery, and an alternate hosted-form link cannot report completion back to the site. Automated tests should mock the provider; any live smoke test should be manually controlled, use synthetic data, and avoid repeating a request after an ambiguous timeout.

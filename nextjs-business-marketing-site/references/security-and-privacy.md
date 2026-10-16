# Security, privacy, and contact handling

Use this reference for public business-site forms, analytics, third-party integrations, and response hardening. Adapt controls to the actual data, deployment, threat model, and applicable requirements. Tests prove selected implementation behavior; they do not certify legal compliance or the whole production system.

## Design the contact path

Keep the server boundary explicit:

- Accept only intended methods and media types. Parse the body as untrusted input and validate an allowlisted shape with field types, formats, requiredness, and length limits. Reject unexpected fields or discriminators rather than allowing input to select arbitrary behavior.
- Enforce request size before and during parsing. Check a declared Content-Length as an early rejection, then count actual streamed bytes; character count is not a UTF-8 byte limit. Cancel an over-limit stream and avoid unbounded buffering.
- Validate a supplied Origin against the expected site origin as a browser-request control. Decide explicitly whether missing Origin is allowed for non-browser clients. Origin checks do not authenticate a caller. Lack of CORS headers prevents browser JavaScript from reading a cross-origin response; it is not authorization and does not by itself prevent all cross-site requests. If the endpoint uses cookies or authentication, review CSRF tokens, SameSite behavior, authorization, and origin policy together.
- Put abuse controls before delivery. A honeypot can reduce simple spam, but bots can skip or fill it and it is not a security boundary. Use a shared limiter or provider-side control if requests can reach multiple server instances. In-memory counters reset on restart, are process-specific, and can be evicted; document those limits honestly.
- Give every outbound request a deadline. Keep provider credentials in server-only environment variables, not public-prefixed variables, rendered HTML, client bundles, examples, logs, or source control. If a secret has shipped in a public-prefixed variable or another client-visible location, treat it as compromised: revoke or rotate it first, then remove exposed copies from source history where appropriate, build artifacts, caches, logs, and published bundles. Renaming the variable alone does not invalidate the old credential. Return safe recovery instructions while keeping provider response bodies and internal diagnostics private.

### Telegram bot delivery

A Telegram bot can work for a low-volume contact form when the business already handles enquiries in a private Telegram chat. A Route Handler in the existing Next.js serverless deployment can validate and deliver the message without a separately operated backend service or database. Keep the bot token and destination identifier in server-only secrets such as TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. If no server execution is available, use a hosted responder form instead of exposing the token in the browser.

Set it up deliberately:

1. Create the bot with Telegram’s official BotFather flow using /newbot. Store the issued token directly in the hosting provider’s encrypted environment settings as a server-only variable; do not paste it into a page, issue, chat transcript, test fixture, browser-visible configuration, or URL that may be logged. The Bot API places the token in the URL path, so redact request URLs from application, proxy, tracing, and error logs.
2. For a private operator inbox, have the operator start a private conversation with the bot, then discover the resulting chat identifier server-side through getUpdates or an already authorized bot-management tool. Never place the tokenized request URL in a browser, public issue, shell history, or shared logs. Configure the resulting chat identifier as a fixed private server-side value; never accept a destination from the submitted form. getUpdates cannot be used while an active webhook is handling updates. Do not delete or replace an existing webhook just to discover an identifier; use the current integration or coordinate a planned switch.
3. Send a test message containing synthetic data, verify that only the intended operators can see it, then remove the test record if appropriate.
4. Send only fields required to answer the enquiry. Avoid enabling Telegram formatting modes unless input is escaped for that exact format; plain text avoids formatting injection and malformed-message failures.
5. Treat delivery as successful only when the HTTP response and Telegram’s JSON result both indicate success. Handle network errors, timeouts, non-success statuses, and malformed provider responses without exposing token or response details.
6. If the request times out, delivery may still have occurred upstream. Do not recommend blind automatic retries that can create duplicate enquiries. Use an idempotency design if the product needs safe retries.

A Telegram channel is an external data processor and inbox, not a private database owned by the website. Explain the channel, the fields sent, who handles enquiries, and any retention known to the business. Do not promise deletion or retention behavior that cannot be enforced in Telegram or the hosting platform.

### Google Forms and hosted form alternatives

When the owner wants to avoid operating a form backend, Google Forms can be offered as a hosted alternative. Link to the published responder URL (the respondent-facing /viewform URL), and confirm it works in a signed-out browser. Never use the edit URL intended for collaborators. A link click only proves that navigation was requested: the site cannot observe or truthfully confirm completion of a separately hosted Google Form. Present the link as an alternate route and explain the handoff; do not show a site-side ‘submitted’ state when the visitor only opened it. An external redirect is simple and loads no form provider code until the visitor chooses to leave the site. An embedded form keeps the visitor on the page but adds a third-party frame, can affect performance and accessibility, and may expose page context or technical request data to Google. If embedding, give the visitor a clear notice and use a responsive container with a useful direct-form fallback.

Do not present undocumented form submission endpoints or guessed field names as a stable Google Forms API. A direct formResponse POST can depend on hidden entry identifiers, anti-abuse behavior, cookies, and implementation details that can change without a supported contract. It may be impossible to reliably surface validation or delivery errors to the visitor. Prefer the published responder interface, a supported form/API provider, or a site-owned API when confirmation, validation, privacy controls, or workflow integration matter.

| Approach | Useful when | Tradeoffs to explain |
| --- | --- | --- |
| Hosted Google Form link | The business needs a low-maintenance intake form and accepts an external handoff | The visitor leaves the site; response flow and retention are controlled by Google Form settings |
| Embedded Google Form | Keeping the form visible in page context matters more than minimizing third-party loading | Adds a third-party frame, may slow the page, and requires an accessible fallback and clear notice |
| Website API plus Telegram | The form should match the site and send a concise enquiry to a private operator chat | The site owner must protect bot credentials, validate input, control abuse, and disclose Telegram handling |
| Dedicated form service | The owner wants managed spam controls, routing, and form administration | Adds a processor, account configuration, cost or plan constraints, and another retention policy |
| Site-owned database/workflow | The owner needs durable records, permissions, auditability, or integrations | Requires authentication boundaries, storage security, retention/deletion operations, backups, and monitoring |

Choose the least complex option that meets the real workflow. A hosted form is not automatically private, and a custom API is not automatically more secure.

## Consent, analytics, and disclosures

Load optional analytics only under the implemented consent state. A robust preference store should validate a versioned record and expiry, begin from a conservative state until required inputs resolve, handle unavailable storage, let a saved user choice win over a delayed region lookup, synchronize across tabs, and support withdrawal. Regional defaults depend on the audience, trusted deployment geolocation, provider behavior, and current obligations; do not copy another site’s regions or call a code path legal compliance.

Keep analytics choice separate from advertising storage and ad-personalization signals. Verify that default signals run before optional tags and that provider-specific consent calls receive the intended state. Withdrawal should update providers and clear known first-party analytics cookies where possible. It may not prevent every cookieless request. If session replay is used, decide which content is masked, test actual provider settings, and describe residual collection honestly.

The privacy notice should match the real data flow: fields collected, purpose, required versus optional values, delivery destination, operator access, retention, hosting/provider records, analytics purposes, consent controls, and contact route for requests. Update the notice and tests when the integration changes. A text assertion proves that words are present, not that the production configuration behaves as described.

## Headers and deployment controls

Inspect application configuration and actual deployed responses. A project may have security headers at the CDN or hosting layer even when they are absent from app code, and the reverse can also happen.

Choose policies for the site rather than copying a generic bundle:

- Enable HSTS after HTTPS is enforced. Add includeSubDomains only when the affected subdomains support HTTPS, and review the persistence and recovery consequences of preload separately.
- Build Content-Security-Policy from an inventory of scripts, inline bootstraps, styles, frames, forms, images, fonts, and required providers. Start with report-only when useful, then enforce a policy that works with consent and external services.
- Consider frame restrictions, Referrer-Policy, Permissions-Policy, and X-Content-Type-Options according to the application. Verify behavior on pages, APIs, redirects, errors, static assets, and negotiated formats.
- Keep no-store and private responses out of shared caches. Do not assume that a correct source header is preserved by a framework adapter, reverse proxy, or CDN.

No single header set proves an application secure. Validate the deployed result and revisit it when analytics, forms, hosting, or framework routing changes.

## Next.js data boundaries and content safety

Treat the server as a trust boundary, not an authorization mechanism. Keep credentials and privileged provider clients in server-only modules, and return minimal, explicitly shaped DTOs to Client Components. Never pass database rows, internal records, secret-bearing configuration, or unfiltered CMS objects across the React Server Component boundary. Authentication and authorization must be checked at the data access or server action/route boundary for each request; hiding a route, using a proxy, or rendering a server component does not authorize access by itself. Follow the installed Next.js version’s data security guidance when choosing Server Actions, Route Handlers, and caching behavior.

Validate input at the boundary and encode output for its destination context. If rendering raw CMS HTML or Markdown, sanitize it with a maintained sanitizer and a documented allowlist; escaping alone does not make untrusted rich text safe. Restrict URL schemes to those the feature needs, typically https/http and carefully justified mailto or tel. Reject javascript and unexpected protocols in links, images, redirects and CMS fields. Allow data URLs only in explicitly constrained contexts with a justified allowlist and security review; do not let untrusted rich content choose arbitrary schemes. Structured data embedded in a script element needs serialization that escapes the less-than character, for example by replacing < with the JSON escape sequence \u003c after serialization, so attacker-controlled text cannot terminate the script element. Test malicious-looking content as data and verify it remains inert.

## Analytics event privacy

Define a small, controlled event vocabulary and allowlisted properties. Do not send form values, message text, email addresses, phone numbers, account identifiers, or sensitive query-string values in event names, URLs, referrers, or event properties. Sanitize external destination URLs before recording them. Preserve only configured attribution fields such as approved UTM values, and never append enquiry contents to attribution. Avoid counting the same page view both through provider enhanced measurement and explicit client-navigation instrumentation. Gate optional analytics on the saved consent state, keep debug modes local or explicitly non-production, and verify masking on every form field if session replay is used; do not assume provider defaults mask it.

## Primary references

Use current primary documentation for the selected integration and installed framework version: [Telegram bot tutorial](https://core.telegram.org/bots/tutorial), [Telegram Bot API](https://core.telegram.org/bots/api), [Google Forms responder publishing](https://support.google.com/docs/answer/2839588), [Google Forms API guides](https://developers.google.com/workspace/forms/api/guides), and [Next.js data security](https://nextjs.org/docs/app/guides/data-security). For application controls, consult OWASP’s [Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), and [Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html) guidance. These references inform implementation; they do not replace review of the actual deployment, data flow, or obligations.

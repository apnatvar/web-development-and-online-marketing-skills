# Personalization and Automation

## Placeholder contract

Document every token:

| Token | Type | Required | Fallback | Escaping |
| --- | --- | --- | --- | --- |
| `{{first_name}}` | plain text | no | `there` or greeting without name | HTML escape |
| `{{campaign_url}}` | absolute HTTPS URL | yes | none; block send | URL validate + attribute escape |
| `{{unsubscribe_url}}` | signed recipient URL | marketing yes | none; block send | URL validate + attribute escape |
| `{{company_name}}` | plain text | yes | configured brand | HTML escape |
| `{{company_address}}` | plain text | jurisdiction-dependent | none; block commercial send when required | HTML escape |

Add campaign-specific tokens with type, source, example, sensitivity, and expiry. Do not infer missing values in production.

## Template-engine portability

Plain interpolation such as `{{first_name}}` generally survives MJML compilation. Conditional syntax differs across Handlebars, Liquid, Jinja, SendGrid, Postmark, SES, and other ESPs; implement fallback in the actual platform rather than inventing portable pseudo-syntax.

Keep complex template logic outside `<mj-style>`. Protect only parser-sensitive blocks as described in `compilation.md` and `components/advanced.md`. Compile before recipient substitution when the tokens survive compilation; render recipient data into the compiled HTML with automatic escaping.

## Safe rendering

- HTML-escape all text values by default.
- Validate URL schemes and hosts for links/images; reject `javascript:`, control characters, and untrusted redirects.
- Never permit recipient data to inject arbitrary HTML/CSS/JSON-LD.
- Keep newline/header data out of SMTP headers to prevent header injection.
- Do not place email addresses, names, customer IDs, or sensitive data in query strings/UTMs.
- Use opaque signed unsubscribe/preference tokens; do not expose raw recipient identity.
- Log campaign/message IDs and template versions, not full rendered private bodies unless required and protected.

## Mailing-list automation

Separate template generation, recipient eligibility, personalization, send, webhook processing, and reporting. Before each send, apply consent/eligibility, suppression, bounce, complaint, frequency, locale, and segment filters. Make retries idempotent with stable message/campaign identifiers. Rate-limit and ramp volume; process bounces, complaints, and unsubscribes continuously.

The included renderer previews/exports HTML and never sends. Integrate sending only through an authorized ESP/API with secrets in environment/secret storage and a dry-run/seed mode.

## Tracking

Use campaign-level UTMs and redirect identifiers that do not reveal personal data. Respect consent and privacy settings. Avoid excessive link rewriting and untrusted shorteners. Open tracking is optional and noisy; design reporting around clicks, replies, conversions, revenue, and negative signals.

# Deliverability and Spam Prevention

## Authentication and infrastructure

For every sending domain/provider verify SPF coverage, DKIM signing, DMARC alignment and reporting, TLS, valid forward/reverse DNS for owned MTAs, stable RFC 5322 headers, unique Message-ID, and aligned visible From/domain. Gmail requires SPF or DKIM for all senders and SPF + DKIM + DMARC for senders over 5,000 messages/day to personal Gmail accounts. Use 2048-bit DKIM where supported.

Separate promotional/subscription mail from transactional mail by From address and preferably stream/subdomain while preserving clear brand identity. Do not use a fresh cousin/lookalike domain to evade reputation.

## Consent and reputation

Send to people who requested or can lawfully receive the specific message. Confirm addresses where appropriate. Never buy lists. Remove hard bounces, suppress complaints/unsubscribes immediately, manage inactive recipients, and provide frequency/topic controls.

Warm new domains/IPs gradually with engaged recipients, stable volume, and real traffic. Avoid bursts. Monitor deferrals/bounces and reduce volume when errors rise. Do not use warm-up networks that exchange synthetic engagement.

## Gmail operational requirements

Maintain Postmaster Tools reported spam rate below 0.3%; operate well below that ceiling. Bulk marketing/subscription messages require RFC 8058 one-click unsubscribe plus a visible body link. Include:

`List-Unsubscribe: <https://example.com/unsubscribe/opaque-token>`

`List-Unsubscribe-Post: List-Unsubscribe=One-Click`

Honor Gmail subscription unsubscribes within 48 hours. Add a stable `List-ID` or distinct list identity where appropriate. These are message headers configured in sending code/ESP, not HTML meta tags.

## Content and link hygiene

Use truthful subjects/from names, balanced live text and imagery, visible sender/contact details, descriptive HTTPS links, accessible HTML, and a plain-text part. Avoid hidden text, URL shorteners, mismatched links, suspicious attachments, image-only messages, excessive redirects, copied/spun content, and mixing promotion into receipts/security messages.

No magic word list guarantees delivery. Discounts, capital letters, and emojis are context signals at most; complaints, list quality, domain/IP reputation, authentication, infrastructure, and behavior dominate.

## Monitoring

Review ESP delivery logs, SMTP codes, hard/soft bounces, complaints, unsubscribes, inbox placement samples, domain/IP reputation, authentication pass rates, blocklists with context, TLS, one-click compliance, and campaign-level negative signals. Use Google Postmaster Tools for eligible traffic. Diagnose by recipient domain, stream, campaign, template, segment, and deployment change.

## Failure response

Pause or reduce affected traffic, preserve logs, identify domain/stream/template/segment changes, fix authentication/list/content faults, test at low volume, and ramp cautiously. Do not rotate domains/IPs to outrun blocks or keep mailing suppressions.

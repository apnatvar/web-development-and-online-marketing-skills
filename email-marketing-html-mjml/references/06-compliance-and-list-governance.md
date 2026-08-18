# Compliance and List Governance

This is operational guidance, not legal advice. Determine sender/recipient jurisdictions and obtain qualified legal review for uncertain or high-risk programs.

## Universal controls

- Maintain provenance for each address: source, timestamp, consent/relationship, notice/version, purpose, and allowed topics.
- Use unchecked, specific opt-in where consent is required; do not bundle marketing consent with purchase/terms.
- Identify the sender honestly and provide a working reply/contact route.
- Provide a visible unsubscribe/preferences link in every marketing email and honor it promptly.
- Maintain durable suppression lists; deletion from the active audience must not make an address eligible again.
- Minimize data, secure exports/API keys, restrict access, define retention, and support access/objection/deletion processes.
- Make vendor/ESP responsibilities contractual and audit integrations/webhooks.

## United States

FTC CAN-SPAM applies to commercial email including B2B: accurate headers and subject, ad identification where required, valid physical postal address, clear opt-out, prompt honoring, and oversight of vendors sending on your behalf. Mixed transactional/promotional messages may become commercial based on subject and placement of content.

## UK/EU/EEA examples

PECR/ePrivacy and data-protection rules can require specific affirmative consent for marketing to individuals, with limited existing-customer “soft opt-in” conditions. Corporate-recipient rules differ by jurisdiction and entity type; sole traders may be treated as individuals. Always provide identity and opt-out, document lawful basis, and respect the right to object. Do not assume “legitimate interest” automatically permits cold email.

## Cold-email gate

Before sending: identify jurisdiction and recipient type; document lawful basis/exception; ensure business relevance and data source transparency; exclude sensitive/personal addresses unless justified; screen suppression; limit frequency; provide a simple opt-out; and stop on objection. If these cannot be established, do not send.

## Transactional boundaries

Use transactional classification only for messages necessary to a requested/ongoing transaction or account relationship. Keep essential information primary. Adding substantial promotion can change legal/provider treatment and harms trust/deliverability.

## Unsubscribe implementation

Use both visible footer/preference links and RFC 8058 one-click headers where required. One-click endpoint must accept automated POST without login or confirmation, map opaque token to the correct list, be idempotent, avoid tracking/marketing, update suppression promptly, and return success. Preferences pages may supplement but not replace required one-click behavior.

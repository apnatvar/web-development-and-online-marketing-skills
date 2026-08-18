# Testing and Measurement

## Artifact preflight

- MJML strict validation and successful minified compilation.
- Includes explicitly enabled/allowlisted and known partial content present.
- Compiled HTML safely below Gmail's ~102KB clipping threshold; measure bytes after ESP transformations when possible.
- All placeholders documented; required values block send; optional values have tested fallbacks.
- Text/attribute/URL/JSON contexts escaped correctly.
- One title, useful preview, plain-text MIME alternative, valid absolute HTTPS links, and no test domains/placeholders.
- Alt text, heading roles, language, contrast, touch targets, logical reading order, and images-off usability.
- Accurate footer identity/address/disclosures/preferences/unsubscribe for message class.
- UTM naming and redirect behavior; no personal data in URLs.

## Client and device QA

Test real or reputable renders for current Gmail web/app, Outlook Windows/365, Apple Mail/iOS, and relevant regional clients. Inspect desktop/mobile, light/dark, high text scaling, images off, slow images, and forwarding/reply where relevant. A browser preview is not an email-client test.

Test the final MIME produced by the ESP: From/Reply-To/Return-Path, subject encoding, text and HTML parts, DKIM/SPF/DMARC results, List-ID, List-Unsubscribe headers, tracking rewrites, schema preservation, and message size.

## Seed and launch

Send through production-equivalent infrastructure to controlled seed accounts. Verify links/actions against safe test data. Use a proof/approval record for copy, audience, offer, dates, and suppression. Start with a small authorized cohort when infrastructure/template changed materially.

## Metrics

Primary metrics should match purpose:

- promotion/newsletter: qualified clicks, conversion/revenue, unsubscribe, complaints, bounce;
- cold outreach: positive replies, qualified meetings, opt-outs, complaints;
- lifecycle: activation/milestone completion, retention, conversion;
- transactional: delivery, task completion, support/error rate, latency.

Treat opens as directional because image proxying/privacy features distort them. Track delivered, bounced, deferred, complained, unsubscribed, clicked, replied, converted, and revenue with clear denominators. Compare segments/cohorts and long-term list health—not only a single campaign's CTR.

## Experimentation

Predefine one variable, hypothesis, population, outcome, guardrails, duration, and stopping rule. Hold audience quality and send time stable when possible. Keep a control; record template/copy versions; do not repeatedly test deceptive tactics even if they lift opens.

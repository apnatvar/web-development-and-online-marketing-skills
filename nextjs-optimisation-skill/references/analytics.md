# Analytics, Consent, and Attribution

[Back to index](../index.md)

## Architecture

Load one analytics integration and one instance of each required third-party library. Establish consent defaults before tags that depend on them. Use the consent platform actually responsible for regional decisions; avoid a parallel local consent state that can disagree.

Verify whether the analytics platform already tracks App Router/history navigation. Do not add manual page views until proving automatic measurement is disabled, or initial loads, back/forward, query changes, and client transitions may double count.

## Events

Events should represent verified behavior, not optimistic funnel outcomes:

- a booking link click is not a completed booking;
- a CTA click is not a generated lead;
- a product view can be emitted once per mounted page view;
- quiz completion requires a valid complete state;
- enhanced-measurement events should not be duplicated manually.

Use stable machine-readable event and placement values. Centralize event types, classification, sanitization, and environment gating. Explicitly tracked elements should be marked so delegated listeners do not emit a second event.

## Privacy

Never send names, email addresses, phone numbers, messages, booking notes, quiz answers, authentication tokens, customer identifiers, or arbitrary free text. Strip query strings and fragments from custom URL parameters; links can contain sensitive referral or form data. Treat PII-pattern filters as a safety net, not permission to pass user input.

## Verification

Test missing configuration, SSR/browser safety, consent accept/reject/manage flows, script order, cookie/storage behavior, network collection requests, route navigation, event deduplication, and production/debug gates. Administrative setup, custom dimensions, filters, and genuine external booking-completion events may require platform access and should be reported as manual work.

Preserve standard UTM parameters for native attribution unless a documented requirement says otherwise; do not copy them into custom storage or dimensions by default. Use GA4 or the chosen product analytics for behavior/conversions, Search Console and Bing Webmaster Tools for discovery/indexing, Lighthouse and field Core Web Vitals for performance, and bundle analysis for code delivery. These sources answer different questions and should not be conflated.

Related: [Performance](performance.md), [SEO](seo.md), [IndexNow](indexnow.md), and [Validation](validation.md).

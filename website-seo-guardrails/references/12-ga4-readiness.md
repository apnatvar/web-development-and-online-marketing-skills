# GA4 Readiness

## Measurement plan before tags

Define business questions, user journeys, success outcomes, event owners, parameter definitions, consent basis, retention needs, and QA acceptance tests. Track decisions and outcomes—not every click. Use stable snake_case event names and Google's recommended events/parameters where they fit.

Example SEO journey: `view_item`/content view → `generate_lead`, `sign_up`, `purchase`, course progress, tool completion, download, qualified contact, or other real outcome. Mark only business-critical events as key events. Avoid vanity events that inflate conversion rates.

## Property and stream setup

- Use the correct organization account, one sensible GA4 property per integrated business view, and generally one web stream per property.
- Set reporting timezone and currency deliberately; changes affect reporting and may be forward-looking.
- Install one Google tag implementation through CMS, `gtag.js`, or Google Tag Manager; prevent duplicate containers/tags and double pageviews.
- Configure enhanced measurement intentionally; disable overlaps when a custom implementation sends the same event.
- Define cross-domain measurement for genuine multi-domain journeys and unwanted referral exclusions for payment/auth providers.
- Define internal/developer traffic carefully; test filters before making them active.
- Choose retention and user-data settings consistent with business need, privacy notices, and applicable law.

## Consent and privacy

Do not send email, phone, names, full form contents, government IDs, or other prohibited personal data in event names, parameters, URLs, titles, or user properties. Remove sensitive query parameters before page-location collection.

Implement a real consent choice where required. For Google consent mode, set defaults before measurement commands and update promptly after the user's choice. Account for `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` as applicable. Consent mode is a tag-behavior mechanism, not legal advice or a substitute for consent and disclosures.

## Implementation QA

Test first visit, consent denial/acceptance/revocation, SPA navigation, back/forward, forms, outbound links, downloads, video, ecommerce or lead journey, errors, cross-domain transitions, and duplicate prevention. Validate Realtime/DebugView, browser network calls, event parameter types, source/medium preservation, and production consent behavior.

## SEO integration

Link the appropriate Search Console property only with authorization. Build landing-page and content-group reporting that connects organic acquisition to meaningful outcomes. Annotate releases and compare cohorts, not only sitewide averages. Preserve campaign parameters correctly; never rewrite organic traffic as referral/direct through broken redirects or cross-domain configuration.

## What not to do

- Do not install GA4 solely because a plugin score says so.
- Do not send every interaction as a key event.
- Do not create duplicate streams/properties to “fix” bad data without a migration plan.
- Do not enable Google Signals, advertising features, or product links without privacy/consent review.
- Do not claim GA4 is complete until controlled journeys produce accurate, deduplicated events.

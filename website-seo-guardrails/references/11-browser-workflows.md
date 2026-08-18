# Browser Workflows for Search Platforms

## Use the right surface

Before any UI operation, check for an applicable connector, API, or CLI. Use it for semantic operations it supports. When the user explicitly requests browser use, or signed-in visual/interactive state must be inspected and no better surface exists, invoke `browser:control-in-app-browser` and follow its setup and browser-selection rules.

Use existing authenticated sessions; never inspect cookies, local storage, password managers, profiles, or credentials. If authentication blocks the selected browser, ask the user to sign in there. Do not bypass authentication with a different source.

## Authorization boundary

Treat these as read-only unless the user explicitly asks for the state change:

- adding/verifying properties, users, or owners;
- submitting/removing sitemaps or requesting indexing;
- temporary removals, disavows, change-of-address, or reconsideration requests;
- linking Search Console, GA4, Google Ads, Merchant Center, or AdSense;
- changing data retention, filters, consent, key events, audiences, or attribution;
- requesting AdSense review, enabling Auto ads, changing ad load/placements, or accepting terms.

Before an authorized mutation, verify the selected account/property/site, describe the intended change and impact, and capture the resulting confirmation. Never apply account-wide settings while intending a single property.

## Google Search Console read-only sequence

1. Confirm the exact Domain or URL-prefix property and production origin.
2. Check messages, Manual Actions, and Security Issues first.
3. Review Pages/Indexing trends and exclusion reasons by template and deployment date.
4. Review submitted sitemaps, last read, discovered URLs, and processing errors.
5. Inspect representative canonical URLs from each important/indexability state; compare indexed versus live HTML, robots, canonical, and referring sitemap.
6. Review Performance by date, query, page, country, device, and search appearance. Compare equivalent periods and annotate releases/seasonality.
7. Review Core Web Vitals, HTTPS, crawl statistics, and relevant enhancement reports.
8. Export or record exact filters, date ranges, examples, screenshots when useful, and limitations.

Do not request indexing repeatedly, submit noncanonical/noindex URLs, or treat “URL is available” as an indexing guarantee.

## Bing Webmaster Tools read-only sequence

1. Confirm the selected site and protocol/host.
2. Review notifications, Site Explorer folder patterns, indexed/error/warning/excluded counts, and malware/guideline issues.
3. Inspect representative URLs using indexed and Live URL views; record crawl status, index state, response, robots, SEO, and markup findings.
4. Review sitemaps, keyword/search performance, backlinks, crawl controls, and robots testing.
5. Review IndexNow submissions versus crawled/indexed/needs-attention states.

Do not interpret IndexNow receipt as indexing, and do not submit unchanged URL inventories in bulk.

## GA4 browser verification

Confirm account/property/stream, Measurement ID, timezone/currency, data filters, retention, enhanced measurement, unwanted referrals, cross-domain settings, product links, and user access. Use Realtime and DebugView with a controlled test journey; ensure events fire once with correct parameters and no prohibited personal data. Avoid changing historical-report settings without explaining forward-only effects.

## AdSense browser verification

Confirm the correct account/site, ownership method, review/readiness state, Policy Center, ads.txt status, Privacy & messaging/CMP state, Auto ads and exclusion settings, and placement previews across desktop/mobile. Do not request review until site-wide checks pass. Do not enable ads or change load/placement merely to maximize predicted revenue.

## Evidence handoff

Report: property/site inspected, access limitations, timestamp/timezone, selected date ranges and filters, exact UI states, representative URLs, observed versus inferred conclusions, screenshots/exports where appropriate, proposed actions, and which actions were not taken.

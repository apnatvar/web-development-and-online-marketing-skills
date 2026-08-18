# AdSense Readiness

AdSense approval and ad serving are separate from SEO ranking. Monetization must not turn a useful site into a thin ad surface.

## Site and content gate

Before requesting review, ensure:

- the site is live, reachable, HTTPS, owned/verified, and accessible to the AdSense crawler;
- navigation, logo/identity, contact/about information, privacy policy, terms where relevant, and error states are complete;
- important pages have original, substantial, accurate content and are not templates, placeholders, scraped feeds, or mostly media without context;
- the site has a coherent purpose and enough finished content for a reviewer to understand its value;
- no prohibited/restricted content, copyright abuse, deceptive tools, fake downloads, policy violations, or invalid traffic sources exist;
- authorship, commercial relationships, affiliate disclosures, and corrections are transparent;
- metadata, canonicals, robots, sitemap, responsive UI, accessibility, and performance pass the normal SEO preflight.

There is no trustworthy universal minimum post count, age, traffic, or word count for approval. Do not manufacture articles to reach an invented quota.

## UI and ad-experience readiness

- Reserve responsive ad space to reduce layout shift.
- Keep primary content and controls immediately identifiable and usable.
- Do not place ads where they resemble navigation, downloads, next buttons, menus, form controls, images, or site content.
- Label manual units only with permitted labels such as “Advertisements” or “Sponsored links.”
- Avoid accidental-click zones, sticky obstruction, pop-ups/pop-unders, intrusive interstitials, and ads that exceed or overwhelm content.
- Exclude account, checkout, private communication, error, empty, low-value, sensitive, or conversion-critical pages when appropriate.
- Test mobile, desktop, narrow screens, keyboard use, slow loading, consent states, and ad blockers/failures without breaking content.
- Start conservatively with manual placements or controlled Auto ads exclusions/load; measure UX and Core Web Vitals as well as revenue.

## Code and ownership

Use the exact AdSense code/publisher ID from the authorized account. Load the prescribed asynchronous script in the appropriate document head/site template without duplicates. Do not modify protected ad code or conceal labels. Verify source and live DOM across templates.

## ads.txt

Publish `https://canonical-root.example/ads.txt` as plain text with `200 OK`, crawlable without redirects/authentication, and the exact authorized seller line from AdSense, typically:

`google.com, pub-ACCOUNT_ID, DIRECT, f08c47fec0942fa0`

Never copy another site's publisher ID or guess the account ID. Add other networks only from their official instructions. Validate commas/spacing/plain-text encoding, canonical host behavior, caching, and AdSense status. Google recommends ads.txt but does not describe it as mandatory; status updates may take time.

## Consent and privacy

Provide accurate privacy/cookie disclosures and a preference mechanism. Configure Privacy & messaging or an appropriate Google-certified CMP where Google policies require it for EEA/UK/Switzerland traffic. Ensure AdSense/GA4 tags respect consent and that withdrawal works. Obtain legal review when jurisdictional requirements are unclear.

## Traffic quality

Never click own ads, ask users/staff to click, purchase bot/incentivized/low-quality traffic, hide ads behind interaction traps, auto-refresh without policy-compliant implementation, or use misleading campaigns. Monitor invalid-traffic warnings and investigate sources.

## Review and ongoing monitoring

Use the signed-in browser workflow to inspect Sites, Policy Center, ads.txt, Privacy & messaging, and placement previews. Request review only after site-wide readiness checks. After approval, monitor policy messages, crawl access, consent, coverage, RPM/viewability, accidental-click risk, CLS/INP/LCP, engagement, and content-to-ad balance. Revenue optimization never overrides policy or usability.

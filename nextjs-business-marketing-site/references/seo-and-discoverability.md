# SEO and discoverability

Use SEO to help the right people find and understand useful pages. Optimize for a coherent visitor experience and accurate business representation, not page count, keyword density or promised rankings. Search, AI answers, directories, social platforms and agent interfaces are distinct discovery surfaces. Clear source content can support them, but no metadata field or protocol guarantees ranking, citation or recommendation.

Classify recommendations as required correctness (accurate facts, valid routes and consistent publication signals), evidence-dependent choices (which pages to index, consolidate or expand), or optional tactics (metadata wording, heading phrasing and experiments).

## Plan around page intent

For each existing or proposed page, record its audience, distinct intent, business role, topic, evidence, related pages and indexation state. Inspect current routes and content before adding another URL. Use real query and page data when available; distinguish observed queries from inferred intent and never invent volume or difficulty. Improve the page that already answers a need rather than publishing a near-duplicate.

A new indexable page should satisfy a distinct need, contain enough value that merging it would weaken the parent, and have a reason beyond a keyword. Avoid thin variations, doorway pages, location/service matrices without unique value, duplicate offers, empty categories, repetitive FAQs and mass-generated pages. Search results, filters, temporary results and weak tags may be useful functionality while remaining outside the index. Keep the useful parent collection indexable where appropriate.

Treat these as defaults for new work. Removing a page, changing its URL, adding `noindex`, changing existing indexation or consolidating intent can affect visitors and accumulated discovery. Identify the candidate, check its performance and links, prepare a destination and migration plan, and obtain explicit authorization unless the user already authorized that exact action. Old approval does not cover future removals.

## Choose keyword targets from evidence

Use the approved offers and page-ownership map to decide which buying questions matter. For existing sites, examine Search Console queries together with their landing pages, period, country and device where available. A query-only export reveals terms and recorded metrics but cannot establish which page owns the traffic or prove page competition. Preserve successful informational intent while improving relevant commercial destinations and contextual links.

For a new site or a gap in first-party data, run a bounded public search review of plausible service, deliverable, audience and problem phrases. Inspect representative search results to understand language and intent, including whether results favour service pages, articles, tools or product listings. Competitor wording is vocabulary evidence, not search-volume data. Use public trend or keyword estimates only when available and applicable; record source, date, geography and limitations. Never invent volume, difficulty or a ranking forecast. If research is unavailable, proceed with clearly labelled provisional themes grounded in the real offer.

Choose one primary intent/theme per important page and a few relevant supporting concepts. This is not an exact-match phrase quota. Prefer terms that connect the business's actual specialty to an identifiable client need. A broad web-development service might emphasize Next.js business websites for service companies while briefly acknowledging credible secondary builds; do not give every capability equal prominence or generate a URL for each variation.

Express the subject naturally in the H1, concise search title, opening explanation and useful section headings. A branded hero can remain when it communicates the page and a nearby service label makes the offer clear; metadata can be more explicit without copying the hero slogan. Describe the audience or deliverable where it helps selection. Keep technical SEO and writing-related queries attached to their respective buying questions when those services have been separated in the brief. Keyword research does not authorize changing a protected hero or an existing URL.

Before handoff, check the map against actual content and routes: each commercial page answers its buying question, shared terms have a clear purpose, titles describe distinct pages, informational pages link to relevant services, and navigation, canonicals, schema and sitemap agree. These are observable implementation checks. Rankings, qualified demand and conversion improvements remain hypotheses until measured after release and adequate discovery time.

## Keep page signals in agreement

Visible content, title, description, canonical URL, social fields, structured data, robots directives and sitemap inclusion should agree on the actual page. Before changing metadata, inspect root and nested layouts plus page metadata across representative route families. Verify inherited defaults and overrides for canonical, title template/default/absolute title, metadata base, and Open Graph/Twitter fields. A page-level nested Open Graph object may replace inherited fields unless code carries them forward. Confirm the final rendered head rather than inferring it from one source object. A concise title and natural description are useful defaults, not fixed formats. Metadata keyword fields, if the repository retains them, describe intent; they are not a ranking mechanism. Do not inherit unrelated terms because the page links to an offer.

Use a self-referencing canonical for a preferred public page unless a deliberate alternate is needed. Canonicals are signals for duplicate URL selection, not a substitute for a migration plan. Align internal links and sitemap entries to the preferred origin and URL. For paginated listings with distinct content, give each page a stable distinct URL and its own canonical; do not canonical every page to page one merely because it is in the same sequence. Make pages discoverable through ordinary links. Social metadata should use accurate titles, descriptions and public images with useful alt text.

Make the main subject clear near the top and use semantic heading levels. One H1 is a common convention, but follow the framework and the page structure rather than treating heading count as an SEO guarantee. Use genuine buyer questions when headings clarify the page; do not make every phrase variation a heading. Answer substantive headings early, then explain the mechanism, example, evidence and limits. Commercial pages often benefit from outcome, audience/problem fit, approach, proof and next step. Informational pages often benefit from an answer, distinctions, practical steps, evidence and relevant resources. Keep all text useful to people; do not add machine-only answers.

## Make structured data factual

Choose schema types that accurately describe visible entities and content. Reuse stable organization, author, product and website identifiers. For an actual custom service, Service is generally the fitting type when structured data is useful and the visible offer supports its fields. Use Product when the offer is genuinely a product; customizability alone does not determine the type. Never invent purchase offers, prices, reviews, ratings, dates, authors, audience, credentials or availability. FAQ and article markup must match visible content. Structured data can clarify facts; it does not guarantee search enhancements.

Keep business facts consistent across the site, schema, sitemap, feeds and machine-readable documents. Use one verified source where practical. Update `dateModified` and sitemap `lastmod` only after a substantive change. A freshness date must correspond to a change readers can observe.

## Crawling, feeds and submissions

Use the installed framework’s current docs and current repository code for metadata, robots and sitemap behavior. Do not rely on remembered APIs. Sitemaps should list preferred, useful, indexable canonical pages, not redirects, noindex routes, duplicates or weak permutations. A sitemap helps discovery; it does not command indexing. Robots directives control crawling and may prevent a crawler from seeing a redirect or noindex instruction, so check the desired behavior before disallowing a route.

If a feed exists, include actual published items with stable canonical links, accurate titles and dates and useful excerpts. Do not use a feed in place of a readable article. Use URL submission services only for deployed canonical URLs that were added or materially changed. Preview and validate with the repository’s current script where available. Submission is notification, not indexing confirmation. A future publication timestamp does not schedule publication. The direct route, content index, any public API, feed and sitemap must use the same eligibility rule so drafts and not-yet-due entries cannot leak through another surface. Resolve scheduled times in an explicit timezone and provide a deployment, scheduled job, revalidation or cache-refresh mechanism that makes the change visible at the intended time.

For AI and agent discovery, provide direct human-readable descriptions, semantic HTML, explicit entity relationships, cited claims and useful source links. Keep machine-readable files synchronized with the public site and describe capabilities accurately. Do not claim that an AI-facing file, API or protocol guarantees visibility.

## Separate repository and deployed evidence

For an audit, identify whether each observation comes from the current checkout, a build, a direct deployed response or a search tool's cached extraction. A repository route establishes implemented content, not release status; a stale extraction does not establish that old navigation or retired offers are still live. If sources disagree, inspect deployment or response evidence when available and describe unresolved differences explicitly. Do not recommend restoring removed routes or diagnose a live regression solely from cached text. State the assessment's scope when production or performance evidence is unavailable.

## Interpret indexing reports before changing pages

An intentional, relevant permanent redirect reported as "Page with redirect" is normally the expected exclusion of the source URL. Check the destination's availability and indexing separately. Historical URLs can remain in reports after migration; reducing that count to zero is not a useful objective. Do not use removals or robots blocking merely to clear a report. See [Search Console's indexing explanations](https://support.google.com/webmasters/answer/7440203).

"Crawled - currently not indexed" does not by itself establish a technical block, spam, AI authorship or insufficient word count. Inspect the last crawl, crawled content and Google-selected canonical in URL Inspection, alongside the deployed status, headers, rendered content, self-canonical, robots rules, sitemap and relevant internal links. A clean source review or live availability test establishes only part of that evidence. If technical signals are sound, assess distinct reader value, original evidence, intent overlap, page age and exposure before proposing a substantive improvement. Keep the cause unresolved when evidence is missing; a rewrite or indexing request cannot guarantee inclusion.

## Verify and maintain

Inspect rendered output as well as source. Confirm title, description, H1, canonical, social metadata, schema, robots directives, sitemap membership and internal links agree. Use established checks and current framework docs. A local build cannot prove external links, client-only behavior, CDN redirects, live indexing, citations or rankings; test those separately when needed and possible.

Assess discovery by query, page, intent, position, market, device and comparable periods. Impressions and clicks diagnose discovery but do not establish qualified demand. Keep AI citations separate from visits and enquiries. Account for page age, small samples, ranking changes and reporting delays. Record substantive change dates. Qualified leads, trust and business value are outcomes; traffic and rankings are diagnostics.

## Lessons from iteration

Metadata cleanup and consistent entity descriptions improve accuracy and make auditing easier; they do not prove ranking or AI citation gains. Rendered-output checks and URL submission can verify local behavior or send a notification, but neither confirms live indexing. Robots behavior must be considered alongside redirects and indexation intent. Always inspect current routes and deployed behavior when the task depends on them.

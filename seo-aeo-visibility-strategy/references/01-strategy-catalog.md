# Strategy catalog

Use this catalog to choose a focused portfolio, not as a universal checklist. Validate fit, distinct user value, implementation quality, and measurement before scaling.

## Content and commercial architecture

### 1. Pillar-cluster architecture

Create a hub around a commercially or editorially important topic and focused pages for genuinely distinct intents. Link hub, spokes, and relevant siblings contextually.

- **Best fit:** blogs, agencies, service sites, ecommerce guides.
- **Value:** clearer editorial roadmap, crawl paths, internal authority routing, and coverage of related question families.
- **Risk:** filler pages and cannibalization when intent boundaries are weak.
- **Implementation:** map definition, process, comparison, cost, use cases, alternatives, troubleshooting, and examples; publish only distinct pages; measure the cluster rather than one keyword.

### 2. Search-intent mapping

Match pages to what a user is trying to do: learn, compare, select, buy, troubleshoot, locate, or verify. Use informational guides, commercial comparisons, transactional pages, and navigational/entity pages for the corresponding task.

Do not create a page for every keyword variation. Group synonyms and related phrasings into question families unless the intent or required answer differs materially.

### 3. Bottom-of-funnel page systems

Build pages for real decision questions such as service by industry or use case, cost, product comparisons, alternatives, implementation, migration, integration, and compatibility.

- **Best fit:** services, agencies, SaaS, ecommerce.
- **Value:** close to revenue and easy to differentiate with delivery evidence.
- **Risk:** doorway-like combinations where only nouns change.
- **Gate:** publish only when the offer, evidence, constraints, or recommendation genuinely differs.

### 4. Information-gain and original evidence

Publish evidence competitors cannot reproduce by summarizing existing results: benchmarks, experiments, datasets, surveys, teardowns, calculators, templates, field notes, before/after results, and expert interviews.

State findings early, disclose methodology, sample size, dates, and limitations, use descriptive tables/figures, keep the source URL stable, and associate proprietary findings with the organization consistently.

### 5. Content refresh and decay control

Refresh strong but declining URLs by updating facts, screenshots, examples, recommendations, product availability, citations, and internal links. Trigger review from sustained impression loss, stale facts, broken references, demand shifts, or missing subtopics.

Do not change dates without substantive updates.

### 6. Consolidation, pruning, and cannibalization cleanup

Merge pages that satisfy the same intent, redirect obsolete equivalents, and remove or noindex content that lacks user value. Pruning is not mass deletion: preserve pages that still serve conversion, brand, support, or long-tail needs. Base decisions on usefulness, duplication, conversion/support value, and search evidence—not an arbitrary traffic threshold. Keep redirects, canonicals, internal links, and sitemaps consistent.

### 7. Internal-link architecture

Use crawlable contextual links to express hierarchy and relationships:

- hub to spoke and spoke to hub;
- relevant sibling links;
- breadcrumbs;
- strong page to strategic page when contextually justified;
- orphan-page remediation.

Avoid sitewide keyword blocks, repetitive exact-match anchors, and JavaScript-only navigation without real `<a href>` links.

## Authority, entity, and reputation

### 8. Linkable assets and digital PR

Create research, tools, datasets, maps, benchmarks, statistics pages, or expert commentary that others have a reason to reference. Judge opportunities by audience usefulness and newsworthiness, not link volume alone. Mark paid placements with `rel="sponsored"` or `nofollow` as appropriate, and reject manipulative link schemes.

### 9. Brand and entity building

Make organizations, people, products, and locations unambiguous across the site and reputable profiles. Use consistent naming, useful About/team/author pages, accurate organization details, and truthful same-entity references. Treat mention-correlation studies as directional evidence, not causation.

### 10. Structured data

Use supported schema only when it accurately represents visible content, such as Organization, LocalBusiness, Product, ProductGroup, Article, ProfilePage, Breadcrumb, eligible Review types, and VideoObject.

Structured data supports understanding and feature eligibility; it does not guarantee rankings, rich results, or AI citations. There is no special Google “AEO schema.” Revalidate current rich-result support before implementation.

### 11. Technical crawl and index hygiene

Validate status codes, robots controls, noindex, canonicals, sitemaps, rendering, mobile usability, URL stability, redirects, and duplicates. Include only canonical index-worthy URLs in XML sitemaps. Do not block a URL in robots.txt when a crawler must read its `noindex`. Keep important content in accessible text and key navigation in crawlable anchors.

Treat crawl-budget work as a large-site or demonstrated crawl-discovery issue, not a default small-site project.

### 12. Programmatic SEO

Use structured data and templates for product/model, integration, location, compatibility, dataset, marketplace, or directory pages only when each page provides distinct value.

Gate each page family with: “Would this URL deserve to exist if search engines did not?” If not, add unique data, functionality, or curation—or consolidate it. Pilot a limited set, define indexability allowlists, and test template quality before scaling.

## Commerce, local, and platform-specific systems

### 13. Ecommerce category and faceted navigation

Make core categories useful commercial landing pages. Curate only stable, high-value facets as indexable pages. Control low-value permutations through architecture, canonicals, noindex, or crawl controls as appropriate. Keep inventory discoverable through crawlable paginated links; do not rely on infinite scroll alone.

### 14. Product detail optimization

Provide distinctive product data, specifications, variant state, price, availability, shipping/returns, strong images, and genuine reviews. Keep visible page data, structured data, and feeds consistent. For rapidly changing product data, prefer accurate markup in the initial HTML and revalidate current platform guidance for dynamic markup and variants.

### 15. Local SEO and entity completeness

Maintain accurate business profiles, location details, hours, services, genuine reviews, strong location pages, and eligible LocalBusiness markup. The main risks are review manipulation and thin location content.

### 16. Service-area and location pages

Create pages only where operations or market needs genuinely differ. Add local proof such as projects, staff, coverage, regulations, delivery times, testimonials, local FAQs, or case studies. Reject mass city pages that differ only by a place name.

### 17. User-generated content, forums, and Q&A

Authentic UGC can capture real language, edge cases, and first-hand experience. Budget for moderation, spam prevention, duplication control, and legal/reputation review. Mark user-inserted links with `rel="ugc"` or `nofollow` as appropriate. Use ProfilePage, DiscussionForumPosting, or Q&A-related markup only for qualifying content.

### 18. Image and video SEO

Use standard image elements, descriptive alt text, relevant nearby text, accessible thumbnails, stable watch pages, image sitemaps when useful, and eligible VideoObject data. Do not hide essential discoverability in CSS backgrounds or non-indexable video shells.

### 19. Multilingual and international SEO

Use separate locale URLs, explicit locale navigation, and hreflang for equivalent localized pages. Avoid IP-only redirection. Localize content, pricing, fulfillment, terminology, and intent—not just navigation. Do not mass-publish low-value machine translations.

## AI-search visibility and measurement

### 20. AI crawler and grounding readiness

Keep intended public content crawlable by the relevant search crawlers, including Googlebot, Bingbot, and OAI-SearchBot where those surfaces are in scope. Keep CDN/firewall rules from accidentally blocking them. Make content visible in HTML/text, canonically stable, clearly titled, and explicit about claims and entities. Cite primary sources and disclose methodology. OAI-SearchBot governs ChatGPT search discovery while GPTBot controls potential training use; treat them separately and consult current platform documentation before changing crawler directives.

### 21. AI visibility monitoring

Build a representative prompt set across definitions, discovery, alternatives, comparisons, recommendations, implementation, local needs, price/cost, and troubleshooting. Track citation, brand mention, sentiment/context, cited URL, prompt family, country, product/mode, referrals, and assisted conversions separately.

### 22. SERP click-through optimization

Use distinctive, descriptive titles, aligned H1s, accurate page-specific descriptions, and eligible enhancements. Avoid stuffing and boilerplate. CTR work cannot compensate for weak relevance or ranking.

### 23. Reviews, alternatives, and comparisons

Create decision-stage content with explicit entities, attributes, trade-offs, testing evidence, measurements, and clear “best for” distinctions. Avoid thin summaries or undisclosed commercial bias.

### 24. Merchant and search-platform feeds

For commerce, maintain relevant product feeds alongside webpages and structured data. Keep price, availability, shipping, variants, and destination URLs consistent across every surface.

### 25. Reputation distribution

Participate credibly where the topic is discussed: trade publications, podcasts, video, communities, partner ecosystems, directories, conferences, expert roundups, and independent reviews. Optimize for useful presence, referral demand, and entity association—not manufactured mentions.

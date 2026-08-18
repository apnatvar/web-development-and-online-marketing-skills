# Discover and select pages

## Local repositories

Run `node scripts/discover-routes.mjs --repository <path>`. Review framework routes, HTML output, explicit route declarations, and sitemap configuration. Propose at most five routes: homepage, primary offer, conversion, contact, and representative content. Include source path and rationale.

## Public URLs

Read public robots.txt and sitemap when available, then inspect same-origin navigation. Propose the homepage plus representative offer, conversion, contact, and content URLs. Do not crawl every sitemap URL.

For small sites, offer a full-site audit after showing the page count. For large sites, ask the user to approve the sample. Preserve the exact tested list in `raw/audit-config.json`.

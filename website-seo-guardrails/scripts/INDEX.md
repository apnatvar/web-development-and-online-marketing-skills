# Scripts Index

- `seo_preflight.py`: scan rendered `.html` files plus an optional `sitemap.xml` for missing/duplicate titles, title length, descriptions, H1s, canonicals, robots conflicts, invalid JSON-LD, missing image alt attributes, and orphan indexable pages.

Run `python scripts/seo_preflight.py <rendered-root> --origin https://example.com`. Add `--sitemap <path>` when the sitemap is not located at `<rendered-root>/sitemap.xml`.

This is a conservative preflight, not a crawler or policy verdict. Review redirects, HTTP headers, rendered JavaScript, content value, spam risk, hreflang, structured-data semantics, performance, and webmaster reports separately.

# Update SEO practices

Use for “update SEO practices,” “refresh SEO knowledge,” “verify current SEO guidance,” or “update SEO timestamp.” A timestamp request still requires source review.

1. Read all files in `knowledge/seo/`, including metadata and changelog.
2. Browse current authoritative sources. Prefer Google Search Central, Chrome/Lighthouse, schema.org, web.dev, and W3C. Open the actual pages; do not rely only on search snippets.
3. Compare the current guidance section by section. Check volatile items in metadata even when no change is expected.
4. Create a review manifest with `reviewedAt`, sources actually read (`url`, `title`, `reviewedAt`, `status: "reviewed"`, notes), `knowledgeChanged`, changed section bodies, a new version when changed, and unverified recommendations.
5. Dry-run: `node scripts/update-seo-knowledge.mjs --manifest review.json --dry-run`.
6. Inspect the diff. Update only changed/outdated sections.
7. Apply without `--dry-run`. The script backs up all prior SEO files under `knowledge/seo/history/<timestamp>/`, writes `changes.patch`, updates metadata, appends sources, and adds a changelog entry.
8. Run tests and skill validation. Review the resulting Git diff before committing.

For a verified no-change review, set `knowledgeChanged: false` and `changes: []`; the verified date may advance because sources were actually reviewed. Never use `timestampOnly: true`; the updater rejects it. Flag inaccessible, conflicting, or unverified recommendations.

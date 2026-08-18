# Generate one platform

1. Read `manifest.json`, the strategy summary, the selected platform row in `strategy/content-map.md`, and the relevant platform guide.
2. Load only the product claims, audience segment, offer, source links, and brand rules required for this output. Use `scripts/campaign_cli.py context` for selective loading when useful.
3. Check `config/platform-constraints.json`. If the date is stale or the planned format is volatile, verify official platform documentation. Record the source and check date.
4. Confirm format, author identity, audience state, platform role, message pillar, claim IDs, CTA, link treatment, and visual mode.
5. Draft natively from the guide. Do not resize another platform's copy.
6. Save only inside the platform directory. Use predictable filenames from the campaign structure.
7. Add disclosure, alt text, plain-text equivalents, metadata, or rule research required by that channel.
8. Rebuild the manifest and run validation. Fix errors before calling the output complete; review warnings rather than suppressing them.

For Reddit and Facebook groups, current community-rule research is a blocking input. For cold email, applicable outreach review is a pre-send requirement. For X, always produce a standard-limit fallback unless extended eligibility is confirmed.


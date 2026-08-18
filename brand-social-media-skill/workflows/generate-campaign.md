# Generate a campaign

1. Confirm the strategy and selected platforms in `manifest.json`.
2. Load the global message hierarchy once. For each platform, then load only its guide, mapped audience details, relevant claims, CTA, sources, and chosen format.
3. Follow `workflows/generate-platform.md` independently for every selected platform.
4. Use `knowledge/content-repurposing.md` to preserve facts while changing hook, framing, format, context, CTA strength, and link treatment.
5. Generate visual briefs only for the configured visual mode. Require approval before asset generation unless automatic generation was explicitly enabled.
6. Mark unnecessary formats as `skipped` with a reason in the manifest or review notes; do not create empty filler files.
7. Set `generation_status` to `complete` only when all selected platforms have their minimum required output and the strategy is complete.
8. Run the reader-facing boundary test on every output: would a human author say each line to the intended reader, or is it an internal note to a superior, reviewer, user, or production team? Remove all internal material from the audience artifact and store essential handoff context only in a separate review file.
9. Rebuild the manifest, validate, and complete an editorial rubric in `review/campaign-summary.md`.

Publishing, sending, posting, or modifying external accounts requires a separate explicit request. Generating local drafts does not authorize those actions.

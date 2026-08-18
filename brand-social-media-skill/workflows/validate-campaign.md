# Validate a campaign

1. Rebuild the manifest:

   ```powershell
   python scripts/build_manifest.py <campaign-root>
   ```

2. Run validation:

   ```powershell
   python scripts/validate_outputs.py <campaign-root>
   ```

3. Read `review/validation-report.md`. Fix every error before completion. Review each warning; either revise or record a reason it is acceptable. Treat suggestions as editorial prompts.
4. Manually inspect platform fit, claim accuracy, community research, HTML/plain-text equivalence, visual accessibility, link destinations, product naming, CTA consistency, and security/privacy risks.
5. Inspect each audience-facing file in isolation. Remove any prompt, instruction, workflow note, rationale, approval request, validation commentary, or text addressed to a superior, user, reviewer, production team, or another agent. Check headings, metadata, HTML comments, alt text, captions, and template fields as well as body copy. Keep necessary internal notes only in separate review files.
6. Score the editorial rubric in `templates/campaign-review.md`; do not present the score as performance proof.
7. Re-run validation after changes. Update the manifest only after a successful generation or revision.

The validator checks structure, placeholders, names, URLs, duplication, suspicious claims, disclosures, alt text, HTML, current-rule dates, stale outputs, and sensitive patterns. It cannot reliably determine whether prose is an internal instruction or reader-facing copy; the manual publication-boundary review is mandatory. It also cannot guarantee legality, truth, platform approval, accessibility quality, or campaign performance.

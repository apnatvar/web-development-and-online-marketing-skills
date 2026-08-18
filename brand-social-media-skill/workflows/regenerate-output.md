# Regenerate an output

1. Identify the smallest target file and the reason for change: tone, length, hooks, CTA, product facts, one pillar, or platform rules.
2. If central facts, audience, offer, or positioning changed, update the matching `context/` or `strategy/` file first. Expect downstream platform files to be marked stale.
3. Draft the replacement in a temporary file outside the target path.
4. Run:

   ```powershell
   python scripts/campaign_cli.py revise <campaign-root> --file <relative-target> --replacement <replacement-file> --reason "<reason>"
   ```

5. Confirm that the previous version exists in `review/history/revision-<n>/` and the revision log was updated.
6. Rebuild context for the target from source files; do not edit a derivative as if it were the source of truth.
7. Validate the revised output and any outputs marked stale.

Never overwrite a prior output silently. Do not delete revision history during routine regeneration.


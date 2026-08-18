# Revise, compare, or archive a campaign

## Global changes

Change product facts, audience, offer, CTA, or pillars in the central files first. Use the `revise` command so prior text is backed up. Review the manifest's `stale_outputs` list and regenerate only affected downstream files.

## Focused changes

For a shorter version, different tone, three hooks, or one revised file, preserve the central claim and CTA boundaries. Back up the target before replacement. Compare the target with its file under `review/history/revision-<n>/`; summarize the editorial difference in `review/revision-log.md`.

## Archive

Create a non-destructive ZIP:

```powershell
python scripts/campaign_cli.py archive <campaign-root> --archive-root <archive-dir>
```

The command marks the manifest archived and retains the source directory. Do not delete the campaign unless the user explicitly requests deletion and the exact path has been verified.


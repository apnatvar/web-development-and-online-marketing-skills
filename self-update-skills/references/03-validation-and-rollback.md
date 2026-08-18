# Validation and Rollback

## Baseline before editing

Capture:

- repository root, branch, status, and current revision;
- target file list and relevant hashes/diff;
- structural validator result;
- representative successful tasks and expected outputs;
- known failures/limitations that motivate the update;
- dependent skills, scripts, templates, paths, and metadata.

Never overwrite unrelated dirty-worktree changes. If the target itself has user changes, preserve them and explain overlap before editing.

## Validation layers

1. **Structure:** valid frontmatter, folder/name match, working links/indexes, metadata synchronized, no placeholder/TODO debris.
2. **Static checks:** syntax, lint, schema validation, dependency references, secrets/PII scan, path and command review.
3. **Focused tests:** reproduce the original problem and verify the new feature, including negative/error cases.
4. **Regression tasks:** run representative old workflows and compare outputs/invariants.
5. **Integration:** verify tools, scripts, includes, examples, downstream skills, and platform/version assumptions.
6. **Diff review:** confirm every changed line belongs to the approved proposal.

Use the platform's official skill validator when available. Execute bundled scripts on safe fixtures. Do not call live services, send messages, deploy, or mutate production merely to test a skill unless separately approved.

## Comparative evaluation

Keep candidate and baseline tasks identical. Evaluate correctness before style. Use deterministic checks where possible; for qualitative tasks, use an explicit rubric and raw outputs. Avoid judging only with the model that authored the candidate when an independent reviewer or test can be authorized and used.

Do not accept a candidate solely because it is longer, more detailed, newer, or passes a synthetic happy path.

## Rollback

Prefer a small version-control commit after validation when commit permission is included. Otherwise preserve an exact patch, branch, tag, or copied backup outside the target folder. Record the recovery command or artifact. Never use destructive reset commands against unrelated work.

Rollback immediately when a hard gate fails and cannot be repaired within scope. If rollback itself would overwrite user changes, stop and request direction.

## Completion report

Report baseline revision, changed files, source evidence, test commands/results, comparison outcome, remaining uncertainty, dependency impact, rollback reference, and final repository status.

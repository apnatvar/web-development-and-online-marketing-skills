# Evidence and Triggers

## Source hierarchy

Prefer, in order:

1. official specifications, regulator notices, security advisories, release notes, API schemas, and vendor documentation;
2. source code, tests, reproducible tool output, and maintained reference implementations;
3. peer-reviewed research or recognized standards bodies;
4. credible expert analysis that links to primary evidence;
5. community reports as leads requiring reproduction;
6. search snippets, generated summaries, social posts, and memory only as discovery aids.

For a provider-specific behavior, prioritize that provider's documentation. For a legal or safety requirement, use the responsible authority and flag jurisdiction/version. For technical behavior, reconcile documentation with reproducible implementation evidence.

## Freshness record

Record for each material claim:

- source owner and direct URL;
- page/document title and version;
- published or last-updated date when exposed;
- retrieval date;
- product version, locale, account tier, or jurisdiction affected;
- whether the claim is explicit, observed, or inferred;
- confidence and unresolved conflicts.

An undated page is not automatically current. Compare release history, repository tags, schema versions, and archived behavior where relevant.

## Qualifying update test

Update only when the evidence changes at least one of:

- correctness or safety;
- supported capability or compatibility;
- required approval or compliance behavior;
- task success rate, reproducibility, or efficiency;
- discoverability/triggering;
- maintainability of a repeatedly used workflow.

Reject candidates that are cosmetic, speculative, vendor hype, irrelevant to supported tasks, already represented accurately, or impossible to validate.

## Discovery during another task

Do not derail the active task. Record the candidate, evidence, affected skill, and urgency. If urgent safety/correctness risk affects the current task, warn the user immediately and avoid the unsafe workflow. Otherwise finish the current task, then offer the evidence-backed proposal. Never edit the skill in the background.

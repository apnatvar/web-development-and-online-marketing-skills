# Modification Workflow

Use this when the user changes any editorial decision, such as voice formality, humor, audience, prohibited language, metrics, products, content pillars, technical depth, structures, search emphasis, channels, or CTAs.

## Modification Steps

1. Restate the requested change.
2. Inspect `.editorial-voice/00-index.md`.
3. Identify likely affected files and IDs.
4. Inspect subdirectory indexes and `relations/links.yaml`.
5. Identify dependent files and downstream effects.
6. Explain meaningful conflicts or tradeoffs.
7. Update only necessary files.
8. Preserve unrelated decisions.
9. Update indexes and links.
10. Record the change in `decisions/change-history.md`.
11. Validate consistency.

## Conflict Handling

Pause for clarification when:

- the requested change conflicts with a confirmed decision
- the change would weaken a claim or compliance rule
- a metric change alters backlog priorities substantially
- a product/channel/pillar is being retired but still referenced by active topics
- a voice change conflicts with a desired perception

Proceed without clarification when the change is narrow, low-risk, and clearly compatible with existing rules.

## Updating Decision Files

For small changes, patch only the active file. For larger changes, retire the old decision and add a new one.

Use this pattern when replacing a decision:

```yaml
---
id: voice.primary
status: retired
superseded_by:
  - voice.primary.v2
updated: 2026-07-11
---
```

The new active decision should explain what changed and why.

## Change History

Append a short entry:

```markdown
## 2026-07-11 - Reduced humor in technical posts

- Type: experimental
- Reason: User wants technical content to feel more precise.
- Replaced: rules.story-humor-emotion.v1
- Active decision: rules.story-humor-emotion.v2
- Files affected:
  - rules/storytelling-humor-emotion.md
  - voice/tone-range.md
  - relations/links.yaml
- Downstream effects:
  - Technical explainers should use warmth through clarity, not jokes.
```

## Validation Checklist

After edits, check:

- all active IDs are unique
- links reference existing IDs
- retired decisions are not listed as active in indexes
- unresolved decisions are not treated as generation rules
- indexes mention changed files
- changed rules do not contradict claim, evidence, or compliance constraints
- backlog and publishing files remain separate from permanent rules

Run `scripts/validate_editorial_memory.py <memory-root>` when available.

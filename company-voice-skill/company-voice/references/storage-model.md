# Storage Model

Use this model when creating or updating `.editorial-voice/`.

## Directory Shape

Use focused files and semantic subdirectories. Create only directories that are needed.

```text
.editorial-voice/
  00-index.md
  identity/
    index.md
    organization.md
    origin-purpose.md
  positioning/
    index.md
    primary-positioning.md
    alternatives.md
    desired-perception.md
  audience/
    index.md
    segment-*.md
  strategy/
    index.md
    business-goals.md
    editorial-goals.md
    search-visibility.md
  voice/
    index.md
    primary-voice.md
    tone-range.md
    personality.md
  style/
    index.md
    sentence-paragraph-style.md
    vocabulary.md
    prohibited-language.md
  rules/
    index.md
    evidence-and-claims.md
    technical-depth.md
    opinion-and-disagreement.md
    storytelling-humor-emotion.md
    promotion-and-ctas.md
  content/
    index.md
    pillars.md
    recurring-themes.md
    structures.md
    backlog.md
    campaigns.md
    publishing-log.md
  references/
    index.md
    products-services.md
    pages-resources.md
    proof-points.md
  channels/
    index.md
    linkedin.md
    blog.md
    newsletter.md
  metrics/
    index.md
    success-metrics.md
    performance-notes.md
  relations/
    index.md
    links.yaml
  decisions/
    index.md
    unresolved.md
    change-history.md
```

## Root Index

`00-index.md` is a routing file. It should contain:

- memory purpose
- last updated date
- subdirectory map
- when to load each subdirectory index
- global overrides, if any
- validation command

Do not duplicate the full contents of underlying files in the root index.

## Subdirectory Indexes

Each `index.md` should list files in that directory with:

- what the file contains
- when to load it
- key IDs defined there
- dependencies
- files that may override or refine it

Keep indexes short. They are routing aids, not strategy summaries.

## File Metadata

Use YAML frontmatter where possible:

```yaml
---
id: rules.evidence.claims
status: confirmed
source: user-interview
updated: 2026-07-11
depends_on:
  - positioning.primary
affects:
  - content.structures.argumentative
  - rules.promotion.ctas
overrides: []
supersedes: []
---
```

Stable IDs should be lowercase, dot-separated, and semantic:

- `identity.organization`
- `audience.founders`
- `positioning.primary`
- `voice.primary`
- `rules.evidence.claims`
- `content.pillar.practical-ai`
- `channel.linkedin`
- `metric.primary.leads`

## Semantic Links

Use `relations/links.yaml` for relationships that agents need during routing or updates.

```yaml
links:
  - id: link.audience-founders-technical-depth
    from: audience.founders
    to: rules.technical-depth
    relation: influences
    note: Founder audience prefers practical implementation detail without internal jargon.
  - id: link.search-pillar-ai-implementation
    from: strategy.search.visibility
    to: content.pillar.ai-implementation
    relation: prioritizes
    note: Search visibility raises priority for evergreen implementation topics.
```

Use only meaningful links. Avoid creating a link for every possible association.

## Overriding And Retiring

When a decision changes:

- mark the old decision `retired` or add `superseded_by`
- create or update the active decision
- update affected links
- update relevant indexes
- record the change in `decisions/change-history.md`

Retired decisions should not influence normal generation.

## Minimal Retrieval Examples

Technical product post:

- `audience/segment-*.md`
- `voice/primary-voice.md`
- `rules/technical-depth.md`
- `rules/evidence-and-claims.md`
- `rules/promotion-and-ctas.md`
- `references/products-services.md`
- channel file
- search file if search is relevant

Voice modification:

- `voice/index.md`
- affected voice/style files
- `relations/links.yaml`
- `decisions/change-history.md`

Backlog planning:

- `strategy/editorial-goals.md`
- `strategy/search-visibility.md`
- `content/pillars.md`
- `content/backlog.md`
- relevant product/page references
- `metrics/success-metrics.md`

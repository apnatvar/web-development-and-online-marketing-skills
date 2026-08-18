# Example Agent Interactions

These examples show behavior, not fixed scripts.

## Initial Discovery

User: Use company voice for my consultancy. Write LinkedIn posts for us.

Agent: Before writing posts, I need to establish the editorial foundation so I do not invent a generic voice. I will start with a short discovery round.

Agent asks:

1. What does the consultancy do, and who hires it?
2. What problem do clients usually feel before they come to you?
3. What should a reader believe about you after reading three posts?
4. What should content optimize for first: trust, leads, search visibility, education, or something else?
5. What claims, proof points, services, pages, or case studies may content reference?

After answers, the agent asks only targeted follow-ups, then creates `.editorial-voice/`.

## Content Generation

User: Write a LinkedIn post about why AI pilots fail.

Agent loads:

- `00-index.md`
- `audience/segment-founders.md`
- `voice/primary-voice.md`
- `rules/evidence-and-claims.md`
- `rules/technical-depth.md`
- `rules/promotion-and-ctas.md`
- `content/pillars.md`
- `channels/linkedin.md`

Agent produces a short plan, drafts the post, reviews it, fixes blocking issues, then presents the final post.

## Modification

User: Make the voice more formal and reduce humor for technical posts.

Agent inspects:

- `voice/tone-range.md`
- `style/sentence-paragraph-style.md`
- `rules/storytelling-humor-emotion.md`
- `rules/technical-depth.md`
- `relations/links.yaml`
- `decisions/change-history.md`

Agent explains downstream effects, patches only the affected files, updates links if needed, records the change, and validates consistency.

## Search Backlog

User: Increase emphasis on search visibility and create a topic backlog.

Agent loads:

- `strategy/search-visibility.md`
- `strategy/editorial-goals.md`
- `content/pillars.md`
- `references/products-services.md`
- `metrics/success-metrics.md`

Agent identifies search clusters, maps topics to offers/pages, prioritizes by metric, and stores the backlog separately from permanent voice rules.

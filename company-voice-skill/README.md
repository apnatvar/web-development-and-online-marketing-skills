# Company Voice Skill

`company-voice` is a reusable Codex skill for discovering, defining, storing, maintaining, and applying an organization's editorial voice and content strategy.

It is built to stop an agent from drafting generic posts before it understands the organization, audience, positioning, goals, constraints, proof standards, channels, and preferred voice.

## What It Does

- Interviews the user before first content generation.
- Turns answers into a persistent plain-file editorial memory.
- Separates confirmed, inferred, provisional, unresolved, and retired decisions.
- Stores knowledge in small semantic files so agents can load minimal context.
- Preserves relationships between audience, positioning, claims, products, content pillars, search strategy, CTAs, and metrics.
- Generates and reviews content using the stored foundation instead of a generic writing style.
- Supports ongoing changes without rewriting the whole knowledge base.
- Keeps backlog, campaign, publishing, and performance records separate from permanent voice rules.

## Repository Structure

```text
company-voice/
  SKILL.md
  agents/openai.yaml
  references/
    discovery-interview.md
    storage-model.md
    foundation-workflow.md
    content-workflow.md
    modification-workflow.md
    example-interactions.md
    example-editorial-memory/
  scripts/
    validate_editorial_memory.py
```

The installable skill is the `company-voice/` folder. Copy that folder into your Codex skills directory if you want it auto-discovered, or keep it as a shareable repository.

## Why Discovery Comes Before Generation

The first use of the skill should establish context. A company voice is not just a tone label like "professional and friendly"; it includes audience assumptions, proof standards, beliefs, constraints, market position, channel behavior, products, and conversion goals.

The skill therefore begins with an adaptive interview. It asks the highest-value questions first, inspects answers, then asks targeted follow-ups only where missing information would materially affect content quality or risk.

Users may skip questions, defer decisions, or mark answers as provisional. The agent records those states explicitly instead of turning assumptions into rules.

## How Knowledge Is Stored

The skill creates a plain-file editorial memory, normally at `.editorial-voice/`.

The memory is divided into narrow files under semantic subdirectories such as:

- `identity/`
- `positioning/`
- `audience/`
- `strategy/`
- `voice/`
- `style/`
- `rules/`
- `content/`
- `references/`
- `channels/`
- `metrics/`
- `relations/`
- `decisions/`

Each subdirectory has an index describing what each file contains, when to load it, dependencies, and overrides. The root `00-index.md` is only a routing map; it does not duplicate the full strategy.

## Minimal Context Retrieval

Before generation or modification, the agent reads the root index and loads only the files required for the task. For example, a technical product post might load:

- target audience
- primary voice
- technical-depth rules
- product reference
- evidence and claim rules
- CTA rules
- channel rules
- search strategy, if relevant

It should not load unrelated pillars, old change history, every campaign note, or every published post.

## Semantic Relationships

Relationships are represented with stable IDs and lightweight links. A target audience can affect technical depth; a belief can drive recurring themes; a search strategy can prioritize topics; a credibility rule can restrict claims.

The main relationship file is `relations/links.yaml`. Decision files may also declare `depends_on`, `affects`, `overrides`, or `supersedes` metadata.

## Updating The System

The recommended modification path is through the agent:

- "make the voice more formal"
- "reduce humor"
- "add a new audience"
- "change the primary success metric"
- "introduce a new product"
- "retire this content pillar"
- "make technical posts more detailed"

The agent identifies affected files, checks dependencies, explains conflicts, updates only the necessary files, updates indexes and links, records the change, and validates consistency.

Manual edits are possible, but direct edits can break semantic relationships, stale indexes, dependency links, or retired decisions. If editing manually, run the validator afterward.

## Planning, Generation, And Review

Before writing, the agent creates a short content plan covering audience, reader problem, purpose, pillar, central idea, point of view, evidence, claims needing verification, technical depth, tone, format, CTA, product or resource reference, success metric, and search theme where relevant.

Every generated post is reviewed against the smallest relevant subset of rules. The review separates blocking issues, recommended improvements, and optional stylistic changes. Blocking issues are fixed before final content is presented.

## Search, Backlog, Publishing, And Performance

Search visibility can be primary, secondary, or irrelevant. When search matters, the skill supports intent mapping, search phrases, clusters, evergreen and trend topics, content-to-page mapping, internal linking opportunities, and follow-up topics.

Backlogs remain separate from permanent editorial rules. Published content does not automatically become a voice rule. Performance data can inform later changes, but changes should be recorded as experimental or permanent.

## Adaptation

The system works for founders, companies, consultancies, agencies, product businesses, creators, and organizations. It can be adapted to social posts, blogs, newsletters, product announcements, tutorials, case studies, reviews, comparisons, founder commentary, and news analysis.

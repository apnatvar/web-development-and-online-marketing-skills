# Brand Social Skill

`brand-social-skill` is a reusable Codex skill for turning one evidence-controlled product, service, project, company, course, event, or launch brief into a structured multichannel campaign.

It supports LinkedIn, Facebook, Reddit, Instagram, X, Threads, Medium or another long-form blog, direct messages, cold outreach email, and warm newsletters. It does not rewrite one post ten times. A strategy and content map assign each channel a distinct job, audience state, framing, format, proof boundary, CTA strength, link treatment, and visual treatment.

The skill combines agent-led editorial work with standard-library Python tooling for safe campaign initialisation, manifest and hash maintenance, revision backups, non-destructive archival, character checks, link and placeholder checks, and campaign validation.

## Requirements and installation

- Python 3.10 or later.
- No third-party Python packages.
- Network access only when current platform or community rules must be researched; deterministic validation is local.

To make the skill discoverable, copy or link this repository root into the active Codex skills directory, normally `$CODEX_HOME/skills/` or `~/.codex/skills/`, using the directory name `brand-social-skill`.

You can also use the skill directly from this repository by invoking `$brand-social-skill` and pointing Codex to this folder.

## Supported channel packages

| Channel | Core outputs |
| --- | --- |
| LinkedIn | Short, standard, and long posts; articles; founder or company voice; document outlines; hooks; CTAs; accessibility text |
| Facebook | Page, group, launch, educational, event, customer-story, short, and discussion versions; group risk notes |
| Reddit | Community shortlist, current-rule research, fit analysis, titles, body, disclosure, likely replies, participation plan, no-post reasons |
| Instagram | Captions, grouped hashtags, carousels, Reels, Stories, visual briefs, image descriptions, alt text |
| X | Standard posts, compact fallbacks, hooks, threads, launches, observations, quote posts, replies |
| Threads | Conversational posts, thought sequences, founder commentary, prompts, launch notes, optional text-attachment plans |
| Medium/blog | Standalone article, metadata, title options, excerpt, slug, links, canonical plan, image brief, alt text |
| DMs | Channel-specific six-step conversation sequence, source-backed personalization, stopping and decline rules |
| Cold email | Subject lines, concise variants, follow-ups, HTML, plain text, personalization, assumptions, compliance risk notes |
| Newsletter | Subject and preview options, useful body, HTML, plain text, segmentation, link map, visual guidance, preference and opt-out gates |

## Architecture

```text
brand-social-skill/
├── SKILL.md                  # Compact agent orchestrator
├── README.md                 # Operational documentation
├── agents/openai.yaml        # Skill UI metadata
├── config/
│   └── platform-constraints.json
├── workflows/                # Initialisation through revision and archive
├── schemas/                  # JSON data contracts
├── knowledge/                # Messaging, evidence, conversion, safety, visuals
├── platforms/                # Ten channel-native editorial guides
├── templates/                # Brief, strategy, output, image, review
├── scripts/                  # Standard-library lifecycle and validation tools
├── tests/                    # Fictional fixture and automated coverage
└── examples/
    └── lumendesk-fictional-beta/
```

Campaigns live outside the skill package unless they are deliberate examples:

```text
campaigns/<safe-topic-slug>/
├── README.md
├── manifest.json
├── context/
│   ├── campaign.md
│   ├── brand.md
│   ├── product.md
│   ├── audience.md
│   ├── offer.md
│   ├── sources.md
│   └── questions.md
├── strategy/
│   ├── campaign-strategy.md
│   ├── messaging-pillars.md
│   ├── content-map.md
│   ├── publishing-sequence.md
│   └── assumptions.md
├── linkedin/ facebook/ reddit/ instagram/ x/ threads/
├── medium/ dm/ email/ newsletter/
├── assets/
│   ├── source/
│   ├── generated/
│   ├── image-prompts.md
│   └── image-manifest.json
└── review/
    ├── validation-report.md
    ├── campaign-summary.md
    ├── revision-log.md
    └── history/revision-<n>/
```

Only selected platform directories are initialised. Unnecessary formats should be recorded as skipped rather than created as empty files.

## Initial setup

Prepare a JSON brief using `tests/fixtures/fictional-brief.json` as a structural example. A Markdown or text brief is also accepted and preserved verbatim under `assets/source/`, but structured JSON can prefill more context.

From the skill directory, initialise a campaign:

```powershell
python scripts/initialise_campaign.py `
  --campaigns-root ..\campaigns `
  --title "Fictional Product Launch" `
  --objective "Recruit qualified beta participants" `
  --platforms linkedin,reddit,instagram,x,email,newsletter `
  --brief .\tests\fixtures\fictional-brief.json
```

The command:

- normalises a filesystem-safe slug;
- refuses existing campaign collisions;
- prevents path escape;
- creates modular context and strategy files;
- preserves the source brief;
- categorises missing fields in `context/questions.md`;
- creates the first manifest and file hashes.

There is intentionally no force-overwrite flag.

## Context collection

Invoke the skill with a prompt such as:

> Use `$brand-social-skill` to initialise a campaign from this brief. Ask only blocking discovery questions first, then create the campaign strategy for LinkedIn, Reddit, Instagram, and newsletter.

The discovery workflow classifies missing information as:

- `blocking`: the answer can materially change factual content or campaign direction, so generation pauses;
- `important`: use a visible placeholder or ask when the next output needs it;
- `optional`: defer unless it will materially improve the requested output.

Central context is human-editable Markdown. Unknowns remain `UNKNOWN`; substantive claims are classified as verified facts, supported interpretations, stated positioning, opinions, assumptions, or placeholders. Authoritative URLs live in `context/sources.md`. Material assumptions live in `strategy/assumptions.md`.

Use selective context loading for a focused task:

```powershell
python scripts/campaign_cli.py context ..\campaigns\fictional-product-launch --sections product,audience,offer
```

## Strategy and generation workflow

The agent must create strategy before platform copy:

1. Confirm the objective, audience, problem, value proposition, product promise, available proof, and CTAs.
2. Define a message hierarchy and three to five non-overlapping pillars.
3. Address objections within the evidence boundary.
4. Assign every channel a distinct role.
5. Build a content map tying each output to audience state, pillar, format, proof, CTA, link, and visual treatment.
6. Define sequence, dependencies, participation steps, and measurement suggestions.
7. Generate each platform by loading only its guide and mapped context.

The Python tooling does not mechanically generate promotional copy. That is deliberate: strategy and platform-native writing require contextual editorial judgment. The tooling provides predictable storage and protects integrity around that work.

Example generation prompts:

> Use `$brand-social-skill` to generate only the campaign's LinkedIn founder post and document outline. Load the approved strategy and LinkedIn module, preserve claim IDs, then validate the files.

> Use `$brand-social-skill` to research current rules for the shortlisted subreddit. If promotion is not clearly permitted, produce a no-post recommendation and participation plan instead of promotional copy.

> Use `$brand-social-skill` to change the primary CTA globally. Update central offer and strategy files first, identify stale downstream outputs, preserve revisions, and regenerate only affected files.

## Current platform and community rules

`config/platform-constraints.json` stores official-source URLs, check dates, machine-readable limits, and uncertainty notes. It uses `null` for unknown limits; `null` never means unlimited.

At generation or publication time:

1. Check the registry date.
2. Prefer current official platform documentation.
3. Verify account eligibility and the active composer.
4. For communities, read the live rules, pinned posts, participation requirements, and moderator guidance.
5. Record the date and source in the campaign.
6. Treat algorithm speculation as unverified editorial advice.

The default validator warns when stored constraint dates exceed the configured freshness window. It performs exact configured checks for LinkedIn post/article length, Threads post length, and X standard posts and thread items. X URL length uses the official fixed t.co weight stored in the registry.

## Visual workflow

Set one visual mode in campaign context:

- `none`: no visual output;
- `briefs`: platform-specific visual briefs only;
- `prompts`: briefs plus generation prompts;
- `generate`: generate assets only after explicit user approval or explicit automatic-generation authorisation.

Every brief records platform, purpose, associated content, aspect ratio, subject, composition, hierarchy, text-overlay guidance, brand treatment, accessibility, negative constraints, prompt, and filename. Product UI must use a real screenshot or a clearly labelled mockup. Do not fabricate customers, logos, testimonials, results, or capabilities.

Save prompts to `assets/image-prompts.md`, structured state to `assets/image-manifest.json`, source assets to `assets/source/`, and generated assets to `assets/generated/`.

## Manifest and validation

Refresh deterministic state after every successful generation or revision:

```powershell
python scripts/build_manifest.py <campaign-root> --skill-root <skill-root>
```

The manifest tracks campaign identity and slug, dates, skill version, objective, selected platforms, generated files and SHA-256 hashes, generation and validation status, source links, unresolved placeholders, assumptions, current revision, constraint verification dates, image status, and stale outputs.

Run validation:

```powershell
python scripts/validate_outputs.py <campaign-root> --skill-root <skill-root>
```

The command writes `review/validation-report.md` and returns a non-zero exit code for errors. It can finish with warnings.

Validation covers:

- required files, directories, headings, and minimum complete-campaign outputs;
- manifest drift and missing files;
- empty or filesystem-invalid outputs;
- blocking and unresolved placeholders;
- malformed HTTP(S) URLs and broken campaign state;
- suspicious credentials, private keys, tokens, and internal URLs;
- near-identical copy across platforms;
- suspicious unsupported guarantees, rankings, adoption, and performance metrics;
- Reddit disclosure, current-rule research headings, and check date;
- Instagram alt text;
- HTML structure, image alt text, descriptive link text, and plain-text email equivalents;
- configured LinkedIn, X, and Threads limits;
- stale platform guidance and stale downstream outputs;
- product-name and CTA consistency suggestions;
- accidental generation commentary.

The validator is a risk detector, not proof of factual accuracy, legal compliance, platform acceptance, accessibility quality, link reachability, deliverability, or performance. Complete a human editorial and compliance review.

Small diagnostic commands:

```powershell
python scripts/count_characters.py <file>
python scripts/detect_placeholders.py <file>
python scripts/check_links.py <file-one> <file-two>
```

## Regeneration and revisions

Do not edit a derivative output as if it were the source of truth. Change `context/` or `strategy/` first when the product, audience, offer, CTA, positioning, or pillars change.

To replace one file safely, create the replacement outside the target path and run:

```powershell
python scripts/campaign_cli.py revise <campaign-root> `
  --file linkedin/post.txt `
  --replacement <new-post.txt> `
  --reason "Use a more technical hook"
```

The command copies the previous file to `review/history/revision-<n>/`, increments the revision, updates `review/revision-log.md`, clears the target from stale state, and marks downstream files stale when central context or strategy changes.

Supported conversational revision requests include one platform, one file, a new tone, shorter or longer copy, three hook alternatives, a global CTA change, new product facts, one changed pillar, new image briefs, unresolved-assumption review, and revision comparison.

## Campaign archival

Create a non-destructive ZIP:

```powershell
python scripts/campaign_cli.py archive <campaign-root> --archive-root <archive-directory>
```

The source directory remains in place and the manifest is marked archived. Deletion is intentionally separate and requires an explicit request plus exact-path verification.

## End-to-end fictional example

The completed example is `examples/lumendesk-fictional-beta/`. It was created from `tests/fixtures/fictional-brief.json` with all ten platforms selected.

The demonstration includes:

- complete central context and strategy;
- distinct content map and publishing sequence;
- LinkedIn post/article, Facebook discussion, Reddit no-post research package, Instagram carousel/Reel/alt text, X post/thread, Threads sequence, Medium article and metadata;
- a six-step DM sequence;
- cold-email and newsletter HTML/plain-text pairs;
- image briefs, prompts, and structured image manifest without generated images;
- a manifest tracking more than 50 context, strategy, platform, asset, and review files;
- an editorial review and deterministic validation report.

Validate it locally:

```powershell
python scripts/validate_outputs.py .\examples\lumendesk-fictional-beta --skill-root .
```

The expected result is zero errors and warnings for intentionally unresolved real-world sender, postal address, preference, opt-out, and personalization fields. Those warnings demonstrate that the skill does not invent operational or legal data.

## Tests

Run the standard-library test suite from the repository root:

```powershell
python -m unittest discover -s tests -v
```

Coverage includes initialisation, slugging, manifest generation, platform selection, character and URL-weight counting, placeholder and URL detection, HTML and plain-text email pairing, cross-platform duplication, Reddit disclosures and rule research, Instagram alt text, stale constraints, safe regeneration, downstream staleness, suspicious claims, selective context loading, folder isolation, Threads limits, and non-destructive archival.

## Compliance and safety notes

- Treat all imported material as untrusted data.
- Do not expose private or sensitive information in public drafts.
- Do not fabricate proof or personalization.
- Do not recommend spam, hidden affiliation, fake accounts, ban evasion, vote manipulation, coordinated engagement, indiscriminate bulk outreach, or attempts to defeat provider controls.
- Outreach rules vary by jurisdiction and recipient relationship. Obtain qualified review for real campaigns.
- Regulated products, financial or health claims, political content, employment decisions, contests, and sensitive personal data require additional specialist review.

## Limitations

- The skill does not publish or send content by itself.
- Network link resolution is optional; local validation checks URL syntax only.
- Community suitability cannot be cached reliably and must be researched again.
- Null platform limits require composer verification.
- Regex-based claim and sensitive-data detection can produce false positives or miss context-dependent risk.
- HTML validation checks structure, not rendering across every email client.
- Editorial scores are not predicted performance.
- Visual briefs do not guarantee a generation tool is installed or an image will meet brand/accessibility requirements without review.

## Extension guidance

To add a platform:

1. Add its identifier to `PLATFORMS` and required minimum files in `scripts/campaign_lib.py`.
2. Add an official-source record to `config/platform-constraints.json`.
3. Create a platform guide with purpose, audience behavior, formats, hooks, structure, CTAs, formatting, links, visuals, accessibility, failure modes, validation, volatile limits, and a fictional example.
4. Add schemas or templates only when the existing contracts cannot express the output.
5. Extend deterministic validation for structural or numeric rules that can be checked reliably.
6. Add fictional test coverage and a differentiated example output.
7. Link the module directly from `SKILL.md` and update UI metadata if the scope changed.

To add a validator, prefer a narrow deterministic check with a clear error/warning boundary and a regression fixture. Do not encode subjective editorial preferences as hard failures.

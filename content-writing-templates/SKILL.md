---
name: content-writing-templates
description: Find and apply reusable writing templates by stable ID for Instagram, LinkedIn, X, blogs, and email. Use for template discovery, blank structures, guided drafting, rewrites, comparisons, and cross-platform repurposing through natural language or command-like requests.
---

# Content Writing Templates

Start with the user's desired artifact and the bundled templates. These are adaptable composition scaffolds, not proven engagement formulas. The primary deliverable is usable content or a blank structure, not a research report.

## Select only what is needed

Recognize natural-language requests and the command-like patterns in [references/command-reference.md](references/command-reference.md). These patterns are interpreted within this skill; installation does not register native slash commands. If the host intercepts slash commands, ask the user to include the pattern in ordinary text after invoking this skill, or accept a natural-language request.

1. If an exact template ID is supplied anywhere in the request, resolve it from `assets/templates/index.json`. IDs are case-sensitive stable identifiers, independent of display names. Never silently substitute an unknown ID; show nearby suitable choices from the registry.
2. For discovery, filter registry metadata and show only ID, name, objective and intended use. For `/recommend`, use optional topic context to rank the filtered candidates by fit and briefly explain the recommendation. If no match exists, explain which filters excluded candidates and suggest an explicit relaxation.
3. Load only the selected template JSON using its registry path. For comparison or repurposing, load only the requested pair. Do not load the whole template library or research notes to draft one post.

Use the standard-library helper from the skill directory when execution is available:

```text
python scripts/template_lookup.py '/templates linkedin educational'
python scripts/template_lookup.py '/template linkedin.analytical.insight --info'
python scripts/template_lookup.py '/write --template blog.educational.tutorial --topic "[TOPIC]"'
```

The helper returns JSON selection data and parameters; the agent writes the prose. With file access but no Python, apply the same exact-ID and metadata lookup directly. [references/template-catalog.md](references/template-catalog.md) is a readable overview, not another registry to maintain independently.

## Produce the requested mode

- **Structure:** Return the selected blank `structure` with descriptive placeholders, plus required inputs if useful. Preserve optional section labels so users can remove them.
- **Draft:** Fill the structure from supplied context and evidence. Default to draft when essential inputs are available. Remove unused optional sections and instructional labels from final prose; optional placeholder lines are not reader-facing copy.
- **Guided:** When essential inputs are missing, identify only those inputs and ask a compact, useful question. Offer a partially filled scaffold when it helps. Do not interrogate the user about every optional input. A literal `[TOPIC]` or other unfilled placeholder does not count as supplied information.

`auto` in helper output means choose draft or guided using the conversation. An explicit request for draft with missing facts may leave clearly marked gaps; it never permits invention. Map the user's notes to the template input descriptions rather than demanding flag syntax for every input.

User instructions override template defaults for tone, order, length and structure. Keep the selected ID as provenance even when adapting it; explain a material structural departure only if useful. Tone metadata describes suitability, not a rule against an override. For example, “use `linkedin.analytical.insight`, keep it technical and avoid promotional language” requires the supplied style without a clarification question.

## Adapt and compare

- `/rewrite`: use the source text already present, retaining meaning, qualifications, and supported facts while applying the target template and requested tone. Ask for source text only if absent.
- `/repurpose`: extract the supplied source's key claim, evidence, caveats and action; reshape for the target platform instead of copying or mechanically truncating. The source ID indicates its structure, not a substitute for the actual text.
- `/compare`: present differences in structure, inputs, objective, reader effort and limitations so the user can choose. Return a concise comparison rather than two large raw JSON objects.

Do not fabricate statistics, sources, quotations, personal experience, case studies, urgency, product capabilities or destinations. Keep uncertainty beside the claim. Verify current external facts when needed for a draft; ask for essential private context that cannot be researched. Drafting does not authorize sending or publishing.

## Maintain the library

Each template contains its stable ID, name, explanation, platforms, objectives, tones, use cases, required and optional input maps, writing structure, customization guidance and limitations. Registry entries add format, framework, length and audience filters; length categories are editorial guidance rather than platform caps. Input-map keys document every placeholder used in the structure.

Research actual sources when adding structures, then extract original reusable patterns. Keep source URLs and reference-organization context only in [references/research-notes.md](references/research-notes.md); consult it for provenance or library maintenance. Never copy published posts or include completed examples naming businesses, products, people or organizations in the reusable library. Real platform names identify supported destinations, not fictional completed drafts. Add each new template to the registry and catalog; do not rename existing IDs when changing a display name.

Validate library and command contracts with `python -m unittest discover -s tests -v` before distributing a changed library. See the README for installation, quick start, and archive creation.

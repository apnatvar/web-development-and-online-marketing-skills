# Content Writing Templates

Ten reusable structures for Instagram, LinkedIn, X, blog articles and email, with exact-ID lookup and a searchable registry. Templates contain placeholders and practical guidance; research citations are kept separately in `references/research-notes.md`.

## Quick start

Install or link this folder in your agent's skill directory, or give a compatible file-reading agent `SKILL.md`. In a skill-enabled host, start with `$content-writing-templates`. The following are patterns the skill understands, not independently installed slash commands. Include them in a normal message if the host reserves leading slashes.

1. Find templates: `/templates`, `/templates instagram`, or `/templates --objective promotional --tone witty`.
2. Inspect one: `/template linkedin.analytical.insight --info`.
3. Select by stable ID in ordinary language: “Use `linkedin.analytical.insight` with these notes: [NOTES].”
4. Generate: `/write instagram.educational.howto --topic "[TOPIC]"`, followed by your actual topic and procedure notes. The agent drafts when essential facts are present and asks only for missing essentials otherwise.
5. Override defaults: “Use `linkedin.analytical.insight`; keep it concise and technical, remove the closing question, and use these facts: [FACTS].”
6. Repurpose: `/repurpose --from blog.educational.tutorial --to x.educational.thread`, with source text in the same message or earlier conversation.

Replace bracketed inputs with your information. Request `--mode structure` for a blank scaffold, `--mode guided` for help completing it, or `--mode draft` for populated prose. The default `auto` selects draft when there is enough context. Optional inputs are optional; facts are never invented to fill gaps.

Other useful patterns:

```text
/templates linkedin educational
/recommend --platform linkedin --objective educational
/recommend --topic "[TOPIC]" --platform instagram
/write --template blog.educational.tutorial --topic "[TOPIC]"
/rewrite --template linkedin.analytical.insight
/compare instagram.educational.howto instagram.educational.checklist
```

Supply source text for rewriting. Additional tone and structure instructions in natural language override template defaults.

## Local lookup

Python 3.10+ is optional for agents that can read JSON directly. The helper has no third-party dependencies. From this folder:

```text
python scripts/template_lookup.py '/templates --platform linkedin --objective educational'
python scripts/template_lookup.py '/template linkedin.analytical.insight'
```

The helper filters metadata and retrieves only requested template files. It returns JSON; the agent performs drafting, topic-based recommendation ranking, comparison and rewriting. It does not call a model, install commands or publish anything. Filters cover platform, format, objective, tone, framework, length, audience and ID. See [the command reference](references/command-reference.md) and [template catalog](references/template-catalog.md).

## Validate and package

From this folder, run `python -m unittest discover -s tests -v`. Checks cover registry completeness, exact retrieval, metadata consistency, placeholder documentation, branding exclusions and command behavior. Human review must still check prose quality and entity-specific examples; a string check cannot establish their absence by itself.

From the repository root, use the existing `scripts/package-skills.py` utility. To generate just this archive without rewriting the other skills' bundles:

```python
import runpy
from pathlib import Path
pack = runpy.run_path("scripts/package-skills.py")
root = pack["ROOT"]
folder = root / "content-writing-templates"
destination = pack["DESTINATION"]
destination.mkdir(parents=True, exist_ok=True)
pack["write_archive"](destination / "content-writing-templates.zip", [
    (path, path.relative_to(root).as_posix()) for path in pack["files_under"](folder)
])
```

The archive contains a single `content-writing-templates/` root with its instructions, template assets, helper, tests and references. Generated ZIPs follow the repository's existing ignore rules.

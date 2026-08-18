# Marketing and Persuasive Writing Skill

A reusable Codex skill for diagnosing and producing credible marketing, sales, founder-led, and SEO content. It turns one strategic message into channel-native copy without fabricating customer insight or proof.

## Installation

Copy the `marketing-writing-skill` directory into the Codex skills directory:

```text
~/.codex/skills/marketing-writing-skill/
```

Restart or reload Codex if the skill is not discovered automatically. Invoke it explicitly as `$marketing-writing-skill`, or make a matching marketing-writing request.

## Structure

- [SKILL.md](SKILL.md): execution entry point
- [index.md](index.md): navigation and extension map
- [references/index.md](references/index.md): paraphrased principle library and framework-level attribution
- [workflow/index.md](workflow/index.md): diagnosis-to-quality-control process
- [platforms/index.md](platforms/index.md): channel-specific adapters
- [templates/index.md](templates/index.md): reusable briefs and checklist
- [examples/index.md](examples/index.md): neutral demonstrations

## Use

Provide an objective, source material, and any known customer or product context. The skill will reuse what exists, ask only high-impact questions, expose important assumptions, and avoid invented claims.

Example:

```text
Use $marketing-writing-skill to turn this product brief into a landing page
and three LinkedIn posts for problem-aware operations leaders. Preserve our
plainspoken voice and flag any proof the page still needs.
```

## Extend

To add a platform, create one adapter using the schema in [platforms/index.md](platforms/index.md), link it from that index and [index.md](index.md), and test it against the same central idea used by another adapter.

To add a source framework, create a focused file using the schema in [references/index.md](references/index.md), attribute the source at framework level, add routing signals to [workflow/principle-selection.md](workflow/principle-selection.md), and avoid quotations or source-specific phrasing.

Validate frontmatter and naming with the skill-creator `quick_validate.py`, then validate all relative links and Markdown anchors.

[Back to skill index](index.md)


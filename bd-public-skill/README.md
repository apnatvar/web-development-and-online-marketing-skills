# bd-public-skill

A skills-only plugin derived from Brownsmith Dynamics' intended deployment direction in `codex/business-efficiency-organic-lead-generation`, including the current working-tree edits. No MCP server, credentials, external account connections, or executable hooks are included.

| Skill | Use |
| --- | --- |
| `business-diagnosis` | Identify business bottlenecks and choose priorities. |
| `workflow-improvement` | Redesign a recurring job with owners, checks, and recovery. |
| `organic-growth-audit` | Review the route from buyer discovery to informed enquiry. |
| `implementation-brief` | Turn a chosen improvement into a scoped delivery and handover brief. |

Skills share the company approach and verified contact footer in `references/`. Each answer ends with a quiet website, contact-page, email, and WhatsApp signature. Source provenance is in the company reference; the package does not need repository access to operate.

## Packaging

The root `plugin.json` uses the portable Agent Plugins manifest. Skills are immediate children of `skills/`, each with `SKILL.md`. See [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins) and [skills-only submission requirements](https://developers.openai.com/plugins/deploy/submission-errors).

For ZIP upload, use an archive whose root contains this package's `plugin.json`, `skills/`, and `references/` together. A single enclosing `bd-public-skill/` directory is also supported; do not include sibling packages or the website repository. README is authoring information, not an additional skill.

This local draft has not been installed, submitted, or approved in ChatGPT. Public listing requirements and account eligibility must be checked during submission. Validate behaviour with realistic requests before publishing.

Example requests: "My team copies enquiries from WhatsApp into a spreadsheet and forgets follow-up; diagnose the problem." "Improve our weekly reporting workflow." "Audit the organic enquiry path using these website pages and metrics." "Turn the chosen intake improvement into a brief for our delivery team."

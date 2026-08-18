# Apnatva Skills

A collection of reusable agent skills for research, writing, marketing, email, SEO, website analysis, career applications, framework optimisation, and skill maintenance.

Developed by [Apnatva](https://apnatva.dev) for [Brownsmith Dynamics](https://brownsmithdynamics.com/agent-skills).

## Why these skills exist

Repeated prompting produces uneven results and often loses safety, evidence, or quality checks. These skills turn recurring work into reusable procedures that tell an agent what to inspect, what to produce, what to avoid, and when software or human review is still required.

## How they were developed

The skills were built from practical workflows, repository audits, real output failures, official documentation, and selected open-source projects. Each skill is kept modular, reviewed for private information and instruction leakage, and validated after changes. Detailed material is placed in references, scripts, examples, or assets only when it improves repeatability.

## Skills

| Skill | Purpose |
| --- | --- |
| [Brand Social Media](brand-social-media-skill/SKILL.md) | Plan and produce evidence-grounded, platform-specific campaigns and outreach. |
| [Company Voice](company-voice-skill/company-voice/SKILL.md) | Build and apply a reusable editorial voice and content strategy. |
| [Concise Communication](concise-communication/SKILL.md) | Preserve meaning while reducing filler, repetition, and unnecessary tokens. |
| [Marketing and Persuasive Writing](copy-marketing-skill/marketing-writing-skill/SKILL.md) | Diagnose, draft, critique, and adapt credible marketing and sales copy. |
| [Email Marketing HTML and MJML](email-marketing-html-mjml/SKILL.md) | Create reusable email systems with MJML, HTML, personalization, deliverability safeguards, and optional Emailcn components. |
| [Job Application Tailor](job-application-tailor/SKILL.md) | Produce truthful, role-specific CVs, cover letters, outreach, and application materials. |
| [Next.js Optimisation](nextjs-optimisation-skill/SKILL.md) | Improve Next.js SEO, rendering, performance, accessibility, analytics, and indexing. |
| [Recreate Social Video Trends](recreate-social-video-trends/SKILL.md) | Turn short-form video patterns into original, reusable Remotion templates. |
| [Self-Update Skills](self-update-skills/SKILL.md) | Research and propose evidence-backed skill updates with explicit approval before editing. |
| [Website Analysis](website-analysis-skill/SKILL.md) | Audit websites and local repositories for technical, SEO, accessibility, performance, and messaging issues. |
| [Website SEO Guardrails](website-seo-guardrails/SKILL.md) | Prevent major SEO mistakes while guiding content, indexing, structured data, Lighthouse, Trends, analytics, and webmaster tooling. |

## Using a skill

Open the relevant folder and give its `SKILL.md` to a compatible agent, or install/link the folder in the agent's skills directory. Start with one primary skill and add another only when the task crosses a clear boundary.

Some skills include:

- `references/` for detailed guidance and source routing;
- `scripts/` for repeatable checks or transformations;
- `assets/` and `examples/` for reusable starting points;
- `agents/openai.yaml` for skill-list metadata.

Follow the skill's own prerequisites and approval rules. A skill can guide analysis and content creation, but it does not replace required software, account access, professional advice, deployment checks, or human authorization.

## Portability and privacy

Skills in this public collection are general-purpose. They must not contain hard-coded private repositories, people, brands, credentials, internal URLs, machine paths, or unpublished operational details. Task-specific context should be supplied at use time. Fictional examples must remain clearly fictional; framework-specific instructions may identify supported tools and versions.

Creator and upstream-provenance sections may identify their real authors or organizations. Licensing and attribution can differ by skill, so review the relevant `LICENSE` and provenance files before redistribution.

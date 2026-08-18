# Brownsmith Dynamics Skill Catalog

Created for Brownsmith Dynamics - https://brownsmithdynamics.com

Each skill remains in its own folder. Open that folder's `SKILL.md` for agent instructions and `references/INDEX.md` for provenance and source routing.

## Existing skills

- `brand-social-media-skill`
- `company-voice-skill`
- `concise-communication`
- `copy-marketing-skill`
- `email-marketing-html-mjml`
- `job-application-tailor`
- `nextjs-optimisation-skill`
- `recreate-social-video-trends`
- `self-update-skills`
- `website-analysis-skill`
- `website-seo-guardrails`

## Portability rule

Treat every skill whose top-level folder does not start with `brownsmith` as public and reusable. Do not hard-code a company, brand, product, repository, person, private URL, local username, machine path, credential, or unpublished operational detail into those skills. Accept such context only as task-time user input and keep fictional examples clearly fictional. Framework-specific instructions are allowed when they detect or state their supported versions. Creator and upstream-provenance blocks may identify their real people or organizations.

## Recommended-stack operating skills

| Workbook need | Skill folder |
| --- | --- |
| Business identity | `brownsmith-business-identity-ops` |
| Source control and CI | `brownsmith-source-control-ci` |
| Hosting and database | `brownsmith-hosting-database-ops` |
| Automation | `brownsmith-automation-ops` |
| CRM | `brownsmith-crm-sales-ops` |
| Customer support | `brownsmith-customer-support-ops` |
| Invoicing and accounting | `brownsmith-invoicing-accounting-ops` |
| Payments | `brownsmith-payment-operations` |
| Marketing email operations | `brownsmith-marketing-email-ops` |
| Analytics | `brownsmith-product-analytics` |
| Observability | `brownsmith-observability-ops` |
| Identity and secrets | `brownsmith-identity-secrets-security` |
| Knowledge and records | `brownsmith-knowledge-records` |
| E-signature | `brownsmith-esign-contract-ops` |
| Work management | `brownsmith-work-management` |
| Feedback | `brownsmith-feedback-research` |

## Brownsmith product skills

| Product | Skill folder |
| --- | --- |
| Fonte UI | `brownsmith-fonte-ui` |
| Private Agent Workspace | `brownsmith-private-agent-workspace` |
| Web Conversation Engine | `brownsmith-web-conversation-engine` |
| Private Model Infrastructure | `brownsmith-private-model-infrastructure` |
| Workflow Automation Hub | `brownsmith-workflow-automation-hub` |
| Data Intelligence Workbench | `brownsmith-data-intelligence-workbench` |
| Growth Intelligence Platform | `brownsmith-growth-intelligence-platform` |
| Workforce Intelligence Suite | `brownsmith-workforce-intelligence-suite` |
| Contract and Compliance Desk | `brownsmith-contract-compliance-desk` |
| Industrial Operations Platform | `brownsmith-industrial-operations-platform` |
| Healthcare Operations Workbench | `brownsmith-healthcare-operations-workbench` |
| Learning Operations Platform | `brownsmith-learning-operations-platform` |
| Security Operations Console | `brownsmith-security-operations-console` |
| Property Intelligence Suite | `brownsmith-property-intelligence-suite` |
| Commerce Intelligence Platform | `brownsmith-commerce-intelligence-platform` |
| Prompt Composer | `brownsmith-prompt-composer` |

## Private overlay software skills

| Component | Skill folder |
| --- | --- |
| Custom Tauri 2 desktop and workflow client | `brownsmith-overlay-tauri-client` |
| Cloudflare OS-derived execution and security runtime | `brownsmith-cloudflare-agent-runtime` |
| Hermes-derived trace evaluation and procedural learning | `brownsmith-hermes-learning-governance` |

## Selection rule

Use the product skill for end-to-end product work, then load only the operational skill at each boundary being implemented. For example, a Workflow Automation Hub task that sends marketing email may require `brownsmith-workflow-automation-hub`, `brownsmith-automation-ops`, and `brownsmith-marketing-email-ops`; it does not require every skill in this catalog.

## Capability Matrix partials completed without software

| Matrix ID | Capability | Extended skill |
| --- | --- | --- |
| 1 | Quarterly strategy and priorities | `brownsmith-work-management` |
| 3 | SOP and decision log | `brownsmith-knowledge-records` |
| 5 | Customer interviews and synthesis | `brownsmith-feedback-research` |
| 32 | Ideal customer profile and qualification | `brownsmith-crm-sales-ops` |
| 69 | Employer-side hiring and contractor evaluation | `brownsmith-workforce-intelligence-suite` |

The remaining Partial rows require software for prototyping or testing, delivery, automation, analytics, asset production, commercial numbering or approval, lifecycle execution, consent or request handling, or LLM telemetry. They remain intentionally deferred rather than being relabelled as skill-complete.

| Deferred matrix ID | Capability | Why a skill alone cannot complete it |
| --- | --- | --- |
| 8 | UX flows, UI copy, and accessibility | Complete coverage requires prototypes, rendered interfaces, assistive-technology checks, and human usability testing. |
| 27 | Email delivery | Sending, suppression, unsubscribe, bounce, complaint, and delivery evidence require a mailbox or ESP. |
| 29 | Marketing automation | Triggers, state, suppression, idempotency, approvals, and execution require a workflow system. |
| 30 | Marketing measurement | Collection, consent state, attribution inputs, experiments, and durable event history require analytics software. |
| 31 | Creative production | Rendering and reusable asset management require image, video, design, or asset-library software. |
| 35 | Proposals, quotes, and statements of work | An agent can draft, but controlled numbering, approval, issue state, and official commercial records require software. |
| 38 | Sales follow-up | Durable reminders, reply or conversion stops, deduplication, and sending require CRM and delivery automation. |
| 43 | Customer onboarding | Event-based activation, state, delivery, and support handoff require product, CRM, support, or automation systems. |
| 58 | Privacy notices, consent, and data rights | Drafting is possible, but consent evidence, request identity, search, fulfilment, and retention require systems and professional review. |
| 83 | LLM evaluation and observability | Durable traces, versions, cost, latency, production sampling, and alerting require telemetry or evaluation software. |

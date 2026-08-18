---
name: email-marketing-html-mjml
description: Design, write, personalize, compile, and quality-assure visually distinctive, brand-aligned HTML email systems using MJML and reusable HTML templates. Use for mailing-list campaigns, newsletters, product and blog promotion, discounts, launches, cold outreach, follow-ups, lifecycle sequences, announcements, transactional order/shipping/account updates, subject lines, preview text, Gmail Promotions annotations, Gmail Actions/Highlights markup, deliverability reviews, spam prevention, list hygiene, email compliance, testing, and campaign measurement. Also use to edit or troubleshoot `.mjml` and compiled email HTML across Gmail, Outlook, Apple Mail, and mobile clients.
---

# Email Marketing HTML and MJML

Create email that is beautiful, useful, truthful, reusable, accessible, compatible, measurable, and wanted. Visual impact never overrides recipient consent, transactional clarity, client compatibility, or sender reputation.

## Mandatory workflow

### 1. Classify the message before writing

Classify it as:

- **subscription marketing:** newsletter, promotion, launch, discount, blog/update digest;
- **cold outreach:** individually relevant prospecting with jurisdiction and suppression controls;
- **lifecycle:** welcome, onboarding, nurture, activation, renewal, win-back;
- **transactional:** order, shipping, invoice, password/security, reservation, service status;
- **hybrid:** contains both transaction and promotion—separate it whenever possible.

Do not mix promotion into security, password-reset, receipt, or other essential transactional mail. The message class determines consent, unsubscribe, sender stream, markup, frequency, and copy.

### 2. Gather only material inputs

Infer from supplied brand/site files when available. Establish objective, audience/source of permission, brand rules, offer/evidence, message class, locale/jurisdictions, sender identity, desired action, personalization data, ESP/template engine, sending volume, and required output. Ask only for missing facts that would change compliance, truthfulness, or design.

Never invent prices, discounts, expiry dates, inventory, delivery dates, reviews, customer names, personalization, legal rights, or sender identity.

### 3. Build a message brief

Define one primary promise, one primary action, supporting evidence, objections, segmentation, subject/preheader angle, from/reply-to identity, fallback behavior, and success metric. Read [references/01-strategy-and-brand.md](references/01-strategy-and-brand.md) and the relevant playbook in [references/04-campaign-playbooks.md](references/04-campaign-playbooks.md).

### 4. Write before decorating

Draft the subject, preview text, opening, body, CTA, proof, and footer in the approved brand voice. Keep the message skimmable and specific. Use [references/02-copy-and-subject-lines.md](references/02-copy-and-subject-lines.md).

### 5. Design the reusable system

Create design tokens for palette, typography/fallbacks, spacing, radii, dividers, background, buttons, image treatment, logo variants, and dark mode. Prefer a focused 600px single-column reading path; use columns only when they improve comprehension. Make the first screen valuable even with images blocked.

Use `{{first_name}}`, `{{unsubscribe_url}}`, and other documented placeholders only when data and fallback rules exist. Separate reusable layout, campaign content, and recipient data. Read [references/03-personalization-and-automation.md](references/03-personalization-and-automation.md).

### 6. Generate and compile MJML

Before using an MJML component, read its file in the Component Index. Create a complete `<mjml lang="...">` document with `mj-title`, `mj-preview`, attributes, accessibility metadata, and robust fallbacks. Follow the existing [compilation.md](compilation.md) exactly and deliver both editable `.mjml` and minified compiled `.html`.

### 7. Add platform enhancements only when eligible

Use Gmail Promotions annotations only for genuine promotions with accurate live offers and assets. Use Gmail Actions/Highlights only for supported transactional cases and registered/eligible senders. Markup must match visible content and must degrade gracefully. Read [references/07-google-email-annotations.md](references/07-google-email-annotations.md).

### 8. Run the deliverability and compliance gate

HTML cannot compensate for an unpermissioned list or unauthenticated domain. Verify list source, suppression, SPF, DKIM, DMARC alignment, TLS/PTR where applicable, sending stream, one-click and visible unsubscribe, sender identity, postal/contact details where required, frequency, volume ramp, and Postmaster/ESP feedback. Read [references/05-deliverability-and-spam.md](references/05-deliverability-and-spam.md) and [references/06-compliance-and-list-governance.md](references/06-compliance-and-list-governance.md).

### 9. Test the artifact and campaign

Validate MJML strictly, confirm includes landed, inspect compiled size, verify placeholders, links, tracking, alt text, contrast, dark mode, plain-text alternative, and rendering in representative clients. Send seed tests through the real infrastructure. Use [references/08-testing-and-measurement.md](references/08-testing-and-measurement.md).

## Non-negotiable guardrails

- Do not send or authorize a campaign unless the user explicitly asks; creating a template is not permission to contact recipients.
- Do not purchase, scrape, harvest, guess, or enrich addresses for indiscriminate bulk sending.
- Do not use fake `Re:`/`Fwd:`, misleading display names, false urgency/scarcity, hidden content, deceptive links, or impersonation.
- Do not treat “spam words” as the main deliverability problem; permission, complaints, authentication, reputation, and engagement matter more.
- Do not hide unsubscribe or make it harder than subscribing.
- Do not put secrets, sensitive personal data, or private attributes into URLs, tracking parameters, annotations, or templates.
- Do not rely on open rate alone; privacy features and image proxying make it noisy.
- Do not promise inbox placement, Promotions-tab annotations, actions, or revenue.

## Reusable output contract

For campaign work, provide as applicable:

1. campaign/message brief;
2. 3–5 truthful subject/preheader pairs with distinct hypotheses;
3. final copy and plain-text alternative;
4. editable MJML and compiled HTML;
5. placeholder dictionary with type, example, required/optional state, escaping, and fallback;
6. sending-layer requirements: headers, authentication, unsubscribe, segmentation, suppression, and tracking;
7. QA results, known client limitations, and launch checklist;
8. measurement plan and one-variable test proposal.

## Engineering rules

Retain the upstream MJML rules: Section → Column → Content hierarchy; strict validation; component attributes for critical Gmail styles; font fallbacks; image alt text; heading roles via `mj-html-attributes`; VML-capable hero/section backgrounds; `mj-group` when columns must not stack; explicit include allowlists; minified HTML below Gmail clipping risk; and no JavaScript.

## Component Index

Read only what the template needs:

| Area | File |
| --- | --- |
| Head, global styles, preview, accessibility | [components/head.md](components/head.md) |
| Sections, columns, wrappers, groups | [components/layout.md](components/layout.md) |
| Text, image, button, divider, spacer, table | [components/content.md](components/content.md) |
| Social/navbar and limited interactive components | [components/interactive.md](components/interactive.md) |
| Hero, raw markup, includes | [components/advanced.md](components/advanced.md) |
| General MJML hierarchy and rendering | [mjml-reference.md](mjml-reference.md) |

## Documentation and assets

Read [references/INDEX.md](references/INDEX.md) for the complete reference index. Use [assets/examples/reusable-mailing-list.mjml](assets/examples/reusable-mailing-list.mjml) as the reusable personalization baseline and the upstream examples for specialized layout patterns. Use [scripts/render_personalized_email.py](scripts/render_personalized_email.py) only to preview/export personalized HTML; it deliberately does not send email.

## Creator

This edition is maintained by [Brownsmith Dynamics](https://brownsmithdynamics.com). Upstream authorship and licensing remain documented in [references/09-sources-and-provenance.md](references/09-sources-and-provenance.md) and `LICENSE`.

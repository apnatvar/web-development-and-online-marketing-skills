# Cold outreach email

- Last verified: 2026-07-22
- Official reference: [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)
- Legal boundary: requirements differ by jurisdiction, recipient, relationship, and message purpose. This guide is not legal advice.

## Purpose and audience behavior

Use cold email for targeted, relevant commercial outreach where the sender has confirmed an appropriate legal and operational basis. The recipient scans the sender, subject, relevance, proof, effort required, and opt-out path.

## Required package

Generate three to five factual subject lines, primary email, shorter variant, follow-up sequence, personalization fields, semantic HTML, plain-text equivalent, CTA alternatives, assumptions, and risk notes. Support role, company-size, industry, and objection variants only when the underlying facts differ.

## Structure

1. Identify a specific, sourced reason for contact.
2. Connect it to one relevant problem.
3. Explain product value through a supported mechanism or proof.
4. Ask for one small action.
5. Identify the sender and provide an easy decline or opt-out.

## HTML requirements

Use valid simple HTML, semantic elements, inline-compatible styling only when useful, descriptive hyperlink text, meaningful alt text, and no unnecessary images. Make it readable without CSS. Include visible placeholders for approved sender identity, postal or legal footer, and opt-out text. Produce a content-equivalent plain-text version.

## Compliance gate

Before sending, require the user to verify applicable consent or lawful basis, truthful sender and routing information, subject accuracy, advertising disclosure where required, identification and address rules, suppression and recordkeeping, and functioning opt-out handling. Never claim that the draft is compliant everywhere.

## Failure modes

Reject fabricated personalization, deceptive subjects, fake replies or forwards, raw URL anchor text, invisible opt-out language, unverified customer or performance claims, indiscriminate volume, and evasion of provider controls.

## Validation checklist

- Check jurisdiction and approved sender/footer text.
- Verify personalization sources, claims, offer, and CTA link.
- Compare HTML and plain-text meaning.
- Validate HTML, link text, alt text, and placeholders.
- Define sequence stopping rules.

## Fictional example

**Subject:** A fictional decision-record template for `{{company}}`

> Hi `{{first_name}}`, your public `{{specific_reference}}` suggests your team revisits research decisions after launch. Fictional LumenDesk keeps a decision's sources, questions, and conclusion together. I built the example product. Would the one-page fictional template be useful? If this is not relevant, reply “no” and I will close the loop.


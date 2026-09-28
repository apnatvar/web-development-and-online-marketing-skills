# Website Review Frameworks

Load only the sections relevant to the selected audit and observed evidence. Frameworks help diagnose a website; they are not findings by themselves. Do not infer user psychology from a page, use named “laws” as proof, or recommend a pattern without tying it to a representative task.

## Framework selector

| Audit question | Use | Required inputs | Output |
| --- | --- | --- | --- |
| Does the page address the right person and need? | STP + JTBD + Voice of Customer (VoC) | supplied audience/segment, situation, desired progress, customer language, alternatives | audience/job alignment finding and evidence gap |
| Is the offer clear and differentiated? | Value Proposition Canvas + positioning | jobs/pains/gains, category, alternatives, differentiator, proof | promise, points of parity/difference, unsupported claims |
| Does the site support the decision journey? | Customer journey + See–Think–Do–Care | visitor stages, questions, pages, touchpoints, desired actions | stage/page gaps, discontinuities, next-action fixes |
| Why might an action fail? | COM-B; optionally EAST or Fogg B=MAP | observed task, capability, opportunity, motivation, effort, prompt | barrier diagnosis, smallest repair, experiment/verification |
| Can users find content? | Mental model, information scent, card sorting/tree testing | navigation, labels, hierarchy, representative findability tasks | IA hypothesis and validation method |
| Is interaction usable? | Nielsen heuristics, Hick–Hyman and Fitts as lenses | rendered states, task path, controls, device/keyboard evidence | evidenced usability finding and repair |
| Is information easy to parse? | Gestalt, visual hierarchy, cognitive load | rendered layout, grouping, reading order, terminology | comprehension finding and design/copy repair |
| Is it accessible? | WCAG POUR | test results plus keyboard, semantic and assistive-technology evidence as available | standard-linked barrier, affected users, verification |
| Is content logically supported? | Claim–Evidence–Reasoning, SCQA, inverted pyramid | visible claims, evidence, audience question and page type | content-order or proof finding and rewrite structure |

## Audience, message, and positioning

Use STP to test whether the supplied target is meaningfully defined and consistently addressed. Do not invent a segment from visual style or demographics. Express the JTBD as “When [situation], I want to [progress], so I can [outcome]” and compare it with the page's promise, section order, proof, and action. Treat VoC as direct research language; marketing copy or an agent-created persona is not VoC.

For the value proposition, identify:

- jobs, pains, and gains supported by intake or research;
- category and expected points of parity;
- meaningful points of difference;
- visible reason to believe;
- audience or use cases the offer does not fit.

Flag a mismatch when the hero promises one outcome while sections, evidence, or CTA support another. A benefit ladder may translate a feature to a functional consequence and relevant outcome, but must stop before an unsupported emotional or financial promise.

## Journey and content structure

Use a customer journey to inspect continuity from discovery to use and retention. See–Think–Do–Care is a compact stage lens, not a mandatory funnel. Record the question, evidence required, current page, next useful action, and missing transition for each relevant stage.

Use:

- the inverted pyramid when a direct answer should appear first;
- SCQA for a genuine situation, complication, question, and answer;
- Claim–Evidence–Reasoning for recommendations or factual claims;
- Problem–Evidence–Solution–Proof–Action for a supported commercial argument;
- 5W1H as a completeness check;
- topic clusters only to connect distinct user intents, never keyword variants.

Reject formulaic copy, artificial agitation, buried answers, repeated conclusions, keyword stuffing, and calls to action that interrupt the task.

## Behaviour and decision friction

Use COM-B to classify a barrier:

- **Capability:** the user lacks understanding, information, or ability.
- **Opportunity:** the interface, access, time, or context blocks action.
- **Motivation:** value, trust, salience, or priority is insufficient.

EAST can suggest an experiment—easy, attractive, social, timely—after the barrier is evidenced. Fogg B=MAP checks whether motivation, ability, and a prompt coincide. Low conversion alone does not identify which factor failed.

When reviewing choice architecture, check for:

- too many ungrouped options or unclear comparison criteria;
- defaults that are hidden, difficult to reverse, or contrary to likely intent;
- ambiguous price, effort, privacy, renewal, or cancellation terms;
- references or anchors that distort rather than clarify value;
- social proof, scarcity, deadlines, or risk claims without verifiable evidence.

Never recommend dark patterns, fake urgency, hidden opt-ins, confirm-shaming, obstruction, fabricated proof, or fear without an effective action. Record benefit, possible harm, disclosure, reversibility, and success/failure measures for behavioural experiments.

## Interaction, information architecture, and visual comprehension

Nielsen's heuristics are prompts for observed problems: system status, real-world language, user control, consistency, error prevention/recovery, recognition, efficiency, and minimal relevant presentation. Cite the actual control, state, task, and consequence.

Use Hick–Hyman to investigate confusing decision sets, not to demand an arbitrary maximum number of choices. Use Fitts's law to investigate target reach and size, not to enlarge every button. Jakob's law supports familiar conventions unless research shows a better fit.

For information architecture:

- information scent asks whether a label predicts its destination;
- card sorting discovers grouping and language;
- tree testing validates findability without visual design;
- task testing verifies the full route and interaction.

Do not claim an IA is validated because it looks tidy.

Use Gestalt principles—proximity, similarity, continuity, enclosure, and figure/ground—to test whether visual grouping matches semantic grouping. Review hierarchy through order, scale, contrast, position, and spacing. Under cognitive load, remove irrelevant material, segment complex steps, explain terms, and place help near the element it explains. A sparse interface can still be confusing; “minimal” is not the goal when context is necessary.

Apply WCAG through POUR: perceivable, operable, understandable, robust. Automated checks provide partial evidence only. Include keyboard behavior, focus, semantics, names/labels, contrast, reflow/zoom, errors, motion, and assistive-technology checks as the audit scope permits.

## Finding contract

For any framework-backed finding, capture:

```text
Observed evidence and page/state:
Representative user and task:
Framework selected and why:
Diagnosis (not assumed motive):
User/search/conversion consequence:
Repair:
Verification or experiment:
Limitations and missing evidence:
Ethical/accessibility check:
```

Use Design Thinking or the Double Diamond only to organize uncertain follow-up work: discover, define, develop alternatives, deliver/test. Do not report a workshop artifact or heuristic opinion as user validation.

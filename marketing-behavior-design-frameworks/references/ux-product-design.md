# UX, Website, App, and Product Design Frameworks

Frameworks narrow uncertainty; observation and testing decide whether a design works for its users.

## Product and service process

- **Double Diamond:** Discover and Define the problem; Develop and Deliver tested responses. Move backwards when new evidence changes the problem.
- **Human-Centred Design / Design Thinking:** balance desirability, feasibility, and viability through research, synthesis, ideation, prototyping, and learning.
- **Lean UX:** make assumptions explicit, create the smallest useful test, and learn from behaviour rather than deliverable volume.
- **Lean Startup:** Build, Measure, Learn around a falsifiable value or growth hypothesis.
- **Design Sprint:** time-box understanding, ideation, decision, prototype, and testing for a defined risk.
- **JTBD:** define the progress and circumstances before selecting features.
- **Journey map:** show actions, questions, emotions, pain points, and opportunities across time.
- **Service blueprint:** connect the journey to people, systems, policies, evidence, and backstage dependencies.

## Information architecture

| Method | Use |
| --- | --- |
| content inventory and audit | identify content, ownership, quality, duplication, and action |
| card sorting | learn how participants group and label concepts |
| tree testing | measure whether people can find items in a proposed hierarchy |
| task analysis | break a goal into actions, decisions, prerequisites, and failure states |
| user-flow mapping | represent screens, actions, decisions, and recovery paths |
| mental-model mapping | compare product structure with how users understand the domain |
| Object-Oriented UX | identify objects, relationships, attributes, and actions |
| information scent | make headings and links predict destinations accurately |
| progressive disclosure | reveal secondary complexity when needed while keeping consequences visible |

Card sorting generates possible structures; tree testing evaluates findability. Neither replaces representative tasks and participants.

## Usability evaluation

Use Nielsen's heuristics as an expert-review checklist:

1. visibility of system status;
2. match between system and real-world language;
3. user control and freedom;
4. consistency and standards;
5. error prevention;
6. recognition rather than recall;
7. flexibility and efficiency;
8. aesthetic and minimalist design;
9. understandable error recognition and recovery;
10. help and documentation when needed.

Complement them with:

- **Shneiderman's Eight Golden Rules** for consistency, feedback, closure, reversal, control, error handling, and memory load;
- **Jakob's Law** for familiar conventions;
- **Fitts's Law** for reachable, sufficiently large targets;
- **Hick-Hyman Law** for grouping and clarifying complex choices;
- **Tesler's Law** for placing unavoidable complexity appropriately;
- **cognitive load and recognition over recall** for reducing unnecessary mental work.

These are heuristics and models, not pass/fail laws. Verify with usability testing.

## Visual organisation

- **Gestalt:** proximity, similarity, common region, continuity, closure, and figure-ground communicate grouping.
- **Visual hierarchy:** scale, contrast, position, spacing, type, and motion establish reading order.
- **CRAP:** Contrast, Repetition, Alignment, Proximity is a practical layout review mnemonic.
- **Grid and design-token systems:** maintain rhythm and consistency without forcing identical layouts.
- **Signal-to-noise:** remove decoration or interaction that competes with meaning.
- **Atomic Design:** organise reusable interface parts as atoms, molecules, organisms, templates, and pages when that model fits the implementation.

## Accessibility

Use WCAG's POUR principles:

- **Perceivable:** provide alternatives and sufficient sensory access;
- **Operable:** support keyboard and other inputs, timing, navigation, and safe motion;
- **Understandable:** use readable content, predictable interactions, and clear error help;
- **Robust:** expose correct semantics, names, roles, values, and compatibility.

WCAG conformance requires checking applicable success criteria; POUR alone is not a conformance test. Include disabled people and assistive technology in research where appropriate.

## Evaluation handoff

For each finding record: evidence, affected user/task, framework or criterion, severity, recommendation, tradeoff, owner, and validation method. Separate usability observations from speculative preference.

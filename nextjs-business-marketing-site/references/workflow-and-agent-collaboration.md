# Workflow and agent collaboration

Use this reference to plan a new website, coordinate changes, or answer a repeated engineering choice. Its purpose is a reviewable decision and reliable implementation, not mandatory ceremony for every text edit.

## Research before implementation

Start with the observable task. A request for a spacing correction does not require a new positioning strategy; a security fix does not authorize a redesign. Determine the relevant scope and inspect existing conventions before proposing replacements.

For a new project, collect a compact brief:

| Input | What must be established |
| --- | --- |
| Visitor and job | Who visits, what they need to understand/do, and what would count as success |
| Business facts | Real offers, availability, contact ownership, markets, evidence, prices/qualification rules |
| Site scope | Page families, useful content, integrations, existing URLs/links, intended indexability |
| Constraints | Editing owner, budget, legal/privacy requirements, hosting/runtime limits, launch stage |
| Delivery | Preview vs public publication, domain ownership, credentials, maintenance and rollback owner |

Ask only for missing information that materially changes the result. Progress on independent work while clarification is pending. Do not invent clients, testimonials, locations, outcomes, statistics, market demand, or author experience to complete a design.

For an existing project, inspect these in batches:

- Contributor instructions and applicable skills; current branch/status and existing changes.
- Package/lockfile versions, supported runtime, relevant installed framework docs, deployment settings.
- Shared metadata/entity source, navigation, redirects, route registries, content and publication gates.
- Server/client imports, large data modules, global providers/scripts/styles, images/fonts.
- Form delivery, secret access, origin/rate/body limits, consent, public API and error handling.
- Tests/CI, known failures, existing performance measurements, URL inventories and decisions.

Search with `rg` and Git history instead of repeatedly opening unrelated files. Locate callers before removing a module or asset. Read both the implementation and its test when they disagree; neither is automatically authoritative. A test asserting old wording should not restore intentionally changed copy, while a removed security assertion needs stronger justification than “the new code passes.”

## Classify the proposed work

Write requirements first, evidence-dependent improvements second, optional styles last. For substantive work, a compact plan should show the concrete change, reason, affected surfaces, dependencies, verification and what would reverse the choice. Identify genuine high-impact concerns while planning; do not keep narrating hypothetical risks during routine execution.

Prioritize actual breakage and exposure: compromised secrets, accidental indexation, broken contact delivery, wrong HTTP responses, inaccessible navigation, and content loss outrank cosmetic polish. Then optimize observable loading/interaction bottlenecks and content usefulness. Do not use a long checklist to expand a narrow task into a site rebuild.

Separate facts from choices:

| Evidence | What it establishes | What it cannot establish |
| --- | --- | --- |
| Source code or a diff | Intended implementation and affected paths | Actual deployed behavior or user benefit |
| Unit/contract check | Specific asserted behavior in its harness | Browser geometry, CDN behavior, all security properties |
| Production-like browser/HTTP check | Observed behavior under recorded configuration | Every device, external dependency, field performance |
| Comparable lab measurements | Change under a defined device/network/tool setup | Every real-user experience or conversion causality |
| Field metrics and outcome cohorts | Observed population/business signals | Causality without suitable design and sufficient evidence |
| User preference or critique | An accepted constraint or reported experience | A universal design rule |

Do not call a feature “proven” because it survived several redesigns. A removal proves removal; use surrounding evidence before assigning a reason.

## Parallel work when useful and authorized

Delegate disjoint work after establishing a shared brief. Lower-cost agents can inspect a bounded source area, draft a reference/content section, inventory routes, or review a specific failure mode. Choose model/capability according to task difficulty and the user's requested cost constraints; “cheapest” is not evidence of sufficient accuracy for an unfamiliar security decision.

Give each worker:

- The concrete outcome and source roots, with the minimum context needed.
- Owned files/areas and exclusions; distinguish research-only from permission to edit.
- Relevant constraints, existing changes and compatibility requirements.
- Expected evidence, uncertainty labels and verification budget.
- An instruction to return findings and changed files without committing or sending external messages unless authorized.

Avoid simultaneous edits to shared registries, root CSS, lockfiles, or navigation. Have one integrator own those. Batch independent reads, but sequence dependent mutations. A research phase can run in parallel; do not dispatch implementation that depends on an unresolved common decision.

The integrator checks cross-file assumptions: a new slug affects sitemap, schema, metadata, links, Markdown, redirects and tests; one worker cannot confirm the whole chain by inspecting its own file. Review the final behavior, not only agent summaries. Count shared effort carefully: summed agent duration is neither elapsed project time nor measured human time saved.

Use independent evaluation where it adds confidence: provide a realistic request and the draft skill/implementation with minimal artifacts, without revealing the expected answer. Look at the resulting decision or artifact before changing instructions. Avoid repetitive agents checking the same superficial formatting.

## Decision memory

Keep reusable decisions near their source of truth. For a new significant decision, record:

```text
Question:
Applicable requirement or visitor problem:
Options and relevant constraints:
Decision class: requirement / evidence-dependent / optional
Chosen behavior (or options left open):
Evidence, date and scope:
Rejected approach and observed reason, if known:
Verification performed and limitations:
Owner/revisit trigger:
```

Keep raw research, private chats, screenshots and machine paths out of public instructions. A public skill should explain the general mechanism and criteria; project records hold private implementation traceability. Avoid duplicating authoritative facts across plans, README text, code and external discovery documents. Use shared records or generated representations when appropriate.

If a previous approach returns, diagnose why it failed before restoring it. The need may remain legitimate while the implementation was expensive, inaccessible, stale, or incomplete. Apply a narrower correction rather than banning or requiring the entire feature forever.

## Implement, verify, release

Preserve task scope and other contributors' work. Reversible implementation and review can proceed within authorization; installing paid services, changing live settings, sending outreach, destructive migrations or publication require the applicable authorization. Do the concrete preparatory work before asking for a final approval that is actually needed.

Select verification from [testing-and-release.md](testing-and-release.md). Use one planned batch when the user requests limited runs, and investigate failures without hiding them. Run no application build for a purely instructional edit unless it affects application inputs. Never update snapshots/expectations merely to silence an unexplained regression.

Before an authorized commit, inspect exact staged paths and diffs. Include tests/configuration needed by a fresh checkout. Leave unrelated modifications unstaged. Push without force to the intended remote/branch only when authorized, and confirm the resulting remote state. A successful push is not evidence that deployment completed. A local file or scheduled publication date is not evidence that an article is publicly accessible.

Handoff in a few precise sentences: changed behavior, validation and its scope, unresolved constraints, commit/push/deployment state. Minimize commentary; preserve uncertainty where it affects use.

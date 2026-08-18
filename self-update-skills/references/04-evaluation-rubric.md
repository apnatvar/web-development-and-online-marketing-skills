# Evaluation Rubric

## Hard gates

Reject or restore a candidate if any applicable condition is true:

- unsupported or contradicted material claim;
- user approval boundary exceeded;
- safety, privacy, compliance, or destructive-action guard weakened without explicit justification and approval;
- required legacy workflow, interface, or dependency breaks without an approved migration;
- structural validation or critical test fails;
- source/provenance or rollback path is missing;
- secrets, personal data, or untrusted executable instructions are introduced.

## Comparative score

Score baseline and candidate from 0–4 on applicable dimensions:

| Dimension | Question |
| --- | --- |
| Correctness | Does it produce accurate, reproducible outcomes? |
| Coverage | Does it address the verified feature/failure and relevant edge cases? |
| Safety | Are permissions, privacy, compliance, and failure boundaries explicit? |
| Compatibility | Do old consumers and workflows still function or have a clear migration? |
| Clarity | Can another agent reliably know what to do and not do? |
| Efficiency | Does it avoid unnecessary context, tool calls, dependencies, and repetition? |
| Testability | Are claims and workflows backed by concrete checks? |
| Maintainability | Are sources, navigation, ownership, and future update points clear? |

Accept only if every hard gate passes, the motivating dimension measurably improves, and no critical dimension materially regresses. A higher total score cannot compensate for a safety or correctness regression.

## Confidence labels

- **High:** primary documentation plus implementation/test evidence agree.
- **Medium:** primary documentation is clear but implementation evidence is unavailable, or reliable evidence has a minor unresolved gap.
- **Low:** indirect, conflicting, version-ambiguous, or unreproduced evidence.

Do not make behavioral or high-risk changes from low-confidence evidence. Present them as candidates for further investigation.

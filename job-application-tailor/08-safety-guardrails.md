# Safety and Guardrails

Strictly prohibited:

- auto-apply workflows
- fake claims
- fake metrics
- fake dates
- fake employers
- fake titles
- fake education
- fake certifications
- hiding gaps
- bypassing job board limits
- submitting applications without explicit user action
- storing platform credentials for automated submission

When uncertain:

1. Mark as requires_user_confirmation.
2. Ask for clarification in the review queue.
3. Do not include the claim in final CV output.

The user can choose to lie. The system must not create or improve the lie. If the user explicitly provides a claim, store it as user_claimed or user_approved depending on confirmation, but do not present it as externally verified.

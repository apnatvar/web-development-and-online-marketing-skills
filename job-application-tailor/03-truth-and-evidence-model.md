# Truth and Evidence Model

Use these evidence labels:

- user_claimed: the user said it, but it has not been verified or approved
- cv_parsed: extracted from an uploaded CV
- user_approved: approved by the user for use in generated outputs
- conflicting: contradicts another stored claim
- unsupported: no evidence or insufficient support
- rejected: explicitly rejected by the user

Rules:

- Final CV outputs may use user_approved claims.
- Draft suggestions may use user_claimed or cv_parsed claims only if clearly labelled.
- conflicting, unsupported, and rejected claims must not be used in final materials.
- Metrics must not be modified.
- Dates must not be normalised into a stronger claim than provided.

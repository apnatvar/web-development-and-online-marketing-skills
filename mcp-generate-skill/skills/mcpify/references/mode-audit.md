# Audit mode

Audit is read-only unless the user separately requests remediation.

Review:

- manifest/code parity, extra registered tools/resources/prompts, schema drift, status bypasses, and unstable discovery order;
- user outcomes versus low-level primitives, arbitrary forwarding, overlapping tools, and accidental admin surfaces;
- identity mapping, token audience, scopes, ownership, tenant isolation, confused-deputy risks, and fail-open paths;
- confirmation, idempotency, replay protection, transactions, concurrency, compensation, and hidden side effects;
- secret or personal-data leakage, raw internal objects, untrusted external content, logging, and retention;
- strict schemas, output validation, quotas, request size, timeouts, concurrency, safe errors, and audit events;
- resource URI authorization, size/cache/subscription behavior, private-data exposure, prompt authority, and unsafe cross-surface workflows;
- current protocol/SDK compatibility, tool results and annotations, stdio stdout discipline, and HTTP hardening;
- environment separation, least privilege, observability, deployment boundaries, and gateway responsibilities.

Rank findings critical/high/medium/low by practical exploitability and impact. Include exact evidence, affected tools, failure scenario, and smallest credible remediation. Distinguish confirmed findings from unverified concerns. List unnecessary tools and excluded capabilities reachable through generic tools. If no findings exist, say so and state what could not be tested.

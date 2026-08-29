# Security and risk model

Risk is based on the worst credible effect of a correctly authenticated call plus foreseeable misuse, not the source function's name.

## Levels

- `low`: public or non-sensitive read-only data; no meaningful external side effect.
- `medium`: authenticated personal/tenant data or a bounded, reversible mutation such as cart changes.
- `high`: destructive, externally visible, privacy-sensitive, financial-adjacent, or difficult-to-reverse effects such as cancellations, publishing, submissions, messaging, exports, or account changes.
- `critical`: payments or money movement, account deletion, admin/authorization changes, secret management, arbitrary database/query/file/network/command/code access, broad impersonation, or equivalent authority. Exclude by default.

Raise risk for bulk scope, cross-tenant reach, untrusted-content-to-external-action chains, weak ownership evidence, sensitive output, hidden side effects, or irreversibility. Do not lower risk solely because a client may ask for confirmation.

## Required controls

Every tool needs strict input validation, unknown-field rejection, derived identity, authorization at execution time, bounded outputs, safe errors, per-principal quotas, timeout, audit events, and secret isolation.

Additionally:

- medium: authenticated identity, ownership/tenant checks, tighter quotas, personal-data minimization, and mutation idempotency where retries can duplicate effects;
- high: disabled until explicit review, narrow scope, runtime confirmation bound to exact intent, replay protection, idempotency key or state precondition, stronger audit record, and safe rejection-path tests;
- critical: `status: excluded` with rationale and no generated registration or hidden generic route around the exclusion.

## Trust boundaries

Separate:

1. MCP client/host and its confirmation UI
2. transport and authorization gateway
3. MCP request authentication, scope and quota layer
4. application identity/policy and business logic
5. databases and third-party systems
6. external/untrusted content returned to the model

Tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) are descriptive hints. Enforce guarantees in code and infrastructure.

## Remote authorization

For HTTP, follow the current MCP authorization specification: protected resource metadata, authorization-server discovery, access tokens in the `Authorization` header on every request, audience/resource validation, and correct 401/403 behavior. Map validated MCP identity to the existing application identity; do not create a parallel account model unless necessary.

For stdio, obtain credentials through the local execution environment or existing local identity mechanism, never through protocol arguments. Document that process isolation and launch configuration are part of the trust boundary.

## Edge versus application controls

Use infrastructure such as a gateway or Cloudflare for WAF, DDoS mitigation, bot/IP reputation, connection limits, and coarse rate limiting. Keep identity-aware per-tool authorization, ownership, application quotas, idempotency, confirmation, output filtering, and audit logging in the MCP/application layer.


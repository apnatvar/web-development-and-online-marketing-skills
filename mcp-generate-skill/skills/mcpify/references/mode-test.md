# Test mode

Prefer real build and protocol behavior over a large synthetic suite. Never use production credentials, mutate production data, or invoke destructive tools merely to prove reachability.

## Preflight

Read repository test commands, confirm a local/disposable environment, identify credentialed tests, and validate the manifest. Skip unsafe cases and record why.

## Verification ladder

Run applicable checks in repository order:

1. formatter/check, lint, typecheck, focused tests, and build
2. MCP server startup and protocol discovery appropriate to the current SDK/spec
3. deterministic tool, resource, and prompt discovery with schema/template inspection
4. representative low-risk read-only calls
5. authenticated calls with test identity when available
6. invalid, oversized, unknown, and boundary inputs
7. unauthenticated, wrong-scope, wrong-owner, and cross-tenant failures
8. rate/quota, timeout, and concurrency behavior where practical
9. idempotency replay for safe test mutations
10. high-risk confirmation rejection paths without executing the effect
11. audit-log content and secret/personal-data redaction
12. bounded and authorized resource reads plus prompt argument and authority checks, when those surfaces exist

For stdio, ensure stdout contains protocol frames only. For HTTP, test authorization metadata, bearer-token placement, audience, 401/403 behavior, allowed methods/content types, origin/host controls, and request size.

Capture commands, exit codes, observed behavior, skipped checks, and environment assumptions in `docs/mcp-test-report.md`.

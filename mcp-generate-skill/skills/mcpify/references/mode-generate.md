# Generate mode

Generation consumes a reviewed manifest. It does not discover and expose new tools, resources, or prompts opportunistically.

## Entry gate

1. Validate `mcp-manifest.yaml`.
2. Confirm every implemented tool, resource, or prompt has `status: approved` and a resolvable source.
3. Re-trace authorization and side effects in current code; flag drift between manifest and implementation.
4. Exclude any entry whose safety claims are contradicted by source, even if marked approved. Report the contradiction rather than weakening controls.

## Implementation sequence

1. Select the current official SDK and an appropriate transport. Prefer stdio for local single-user use and the current Streamable HTTP pattern for remote/shared access.
2. Place MCP code beside server infrastructure or in a small isolated module consistent with repository conventions.
3. Generate strict schemas, per-surface policy metadata, and deterministic tool/resource/prompt registration from the manifest where feasible.
4. Convert authenticated MCP request context into the application's existing identity/context type.
5. Enforce scopes, resource ownership, status preconditions, quotas, timeouts, concurrency, request-size ceilings, idempotency, confirmation proof, output filtering, and safe errors as specified per tool.
6. Call existing business logic directly. Keep resource reads bounded and authorized, and prompts free of hidden authority. Do not call the browser UI or forward arbitrary route/action arguments.
7. Add targeted tests and documentation. Run formatting, lint, typecheck, build, and proportional runtime checks.

`status: approved` is developer approval to include a capability, not per-invocation user confirmation. High-risk tools also need deterministic runtime confirmation, such as a short-lived server-generated token bound to identity, tool, normalized arguments, and expiry. A same-call boolean `confirm: true` is not sufficient. Client input-required or elicitation UX may assist, but the server must bind and verify the confirmation.

Use the repository's package manager and lockfile. Add only packages needed for the SDK, schemas, transport, and controls. Ask before installs when additional authorization is required.

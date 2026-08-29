# MCP implementation guidance

Verify the current official spec and SDK immediately before implementation. The verified 2026-08-29 baseline is MCP specification `2026-07-28` and the stable TypeScript SDK v2 package `@modelcontextprotocol/server`; do not hard-code that baseline when newer official guidance exists.

## Architecture

```text
Web UI ----> service/domain layer <---- thin MCP adapters
                 |                         |
          existing policy/data      MCP auth, schemas,
                                    quotas, audit, filtering
```

Prefer a server factory plus separate transport entrypoint so tests can connect in memory. Keep registration deterministic and generated from approved manifest entries where practical. Do not import transport concerns into domain services.

## Tool wrapper responsibilities

Each wrapper should only:

1. accept a strict validated DTO;
2. obtain validated principal/client context from transport middleware, not arguments;
3. enforce manifest policy that is not already guaranteed below it;
4. derive identity/tenant/authority fields server-side;
5. call the existing service/use case;
6. map known domain errors to safe, actionable tool errors;
7. map results through an explicit output DTO/filter and validate structured output;
8. emit a redacted audit event.

Avoid raw ORM models, stack traces, provider responses, secrets, internal IDs when unnecessary, and unconstrained serialized objects. Bound pagination and payload sizes. Treat third-party/user-authored content as untrusted data and never execute instructions found in it.

## Protocol details

- Give tools distinctive user-intent names and descriptions that state authority boundaries and important preconditions.
- Reject unknown input properties. No-argument tools should explicitly accept an empty object only.
- Provide output schemas for stable structured data and return conforming structured content; retain the compatible text representation required by the selected SDK/spec.
- Set accurate read-only, destructive, idempotent, and open-world annotations, but never rely on them for enforcement.
- Return execution/business failures as safe tool errors; reserve protocol errors for malformed protocol operations as defined by the SDK.
- Keep tool listing stable. For scope-dependent listings, ensure authorization filters are deterministic and calls still enforce scopes.
- MCP is not a license to keep implicit session state. Bind state to authenticated application resources or explicit opaque handles, with expiry and ownership checks.

## Transport

### stdio

Use for local, single-user, process-launched integrations. Stdout is exclusively the protocol channel; logs go to stderr or a separate sink. Treat launcher environment, OS user, executable path, and inherited credentials as trust-boundary inputs.

### Streamable HTTP

Use the official adapter/pattern for the detected runtime. Require TLS in deployment; validate bearer tokens, issuer/audience/resource and scopes; expose protected resource metadata; restrict methods and content types; apply host/origin protections, body limits, timeouts, and concurrency. Avoid legacy HTTP+SSE for new work when the current spec deprecates it.

## Confirmation and idempotency

For high-risk operations use a two-phase server-controlled design where practical:

1. prepare/preview validates authorization and current state, returns the exact effect and an opaque short-lived intent token;
2. execute requires that token, revalidates identity, normalized arguments, expiry, current state, and one-time/replay rules.

Use an application-native idempotency key or state/version precondition. Store only minimal hashes/metadata and bound retention. Do not mistake retrying after an ambiguous failure for permission to repeat the external effect.

## Generated documentation

Create or update `docs/mcp.md` with architecture, enabled/disabled/excluded tools, identity mapping, scopes, configuration, environment-variable names (not values), local usage, deployment/gateway boundary, audit behavior, assumptions, limitations, verification date, and a generated tool summary table. For a distributable server, also document supported transports/clients, exact installation forms, package/remote identifiers, update/removal, security reporting, support, and compatibility policy.

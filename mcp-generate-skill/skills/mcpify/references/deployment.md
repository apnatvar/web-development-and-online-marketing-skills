# Deployment

Deployment is separate from code generation and registry publication. Default to a deployment plan and locally validated configuration unless the user explicitly requests mutation of a named environment.

## Target decision

- Use stdio when the host and server run for one local user and local process isolation is the intended security boundary.
- Use Streamable HTTP for shared or remote access. Prefer stateless request handling and horizontally scalable application state, consistent with the current MCP revision.
- Keep an existing supported framework/runtime when it can host MCP safely; avoid moving the whole application merely to fit an example adapter.

## Remote production gate

Require:

- TLS and a stable canonical MCP resource URI;
- current protected-resource and authorization-server metadata when authentication applies;
- issuer, audience/resource, expiry, signature, scope, and tenant validation on every request;
- host/origin, method, content-type, body-size, timeout, concurrency, and cancellation controls;
- per-principal/client/tool quotas and audit events with redaction;
- secret-manager injection, least-privilege runtime identity, and no secrets in images or client configuration;
- health/readiness behavior that does not expose tools, private data, configuration, or credentials;
- structured logs/metrics/traces with correlation IDs, plus alerting for authorization failures, quotas, latency, errors, and unusual tool usage;
- migrations and rollback that preserve the existing application and manifest/code compatibility;
- a gateway/WAF boundary for DDoS, bot/IP reputation, coarse limits, and certificate/network controls.

Do not weaken application authorization because a platform or gateway authenticated the connection. Preserve ownership and business rules at execution time.

## Deployment workflow

1. Inspect the named provider/environment and repository deployment conventions.
2. Produce a change plan with resources, identity, endpoint, secrets by name, domains, data residency, scaling, cost-sensitive choices, rollout, rollback, and verification.
3. Validate configuration and build immutable artifacts locally or in approved CI.
4. Before mutation, resolve the exact account/project/region/environment and show the intended changes.
5. Deploy to staging/canary first when available. Run protocol, auth, negative-input, quota, observability, and rollback smoke tests.
6. Promote only when explicitly authorized. Never use production user data or destructive tools as health checks.
7. Record endpoint, version/digest, config revision, migration status, checks, and rollback point. Publication should reference only an already stable public endpoint.

If credentials, provider access, domain control, authorization configuration, or a safe test environment are missing, stop before deployment and hand off a precise checklist.


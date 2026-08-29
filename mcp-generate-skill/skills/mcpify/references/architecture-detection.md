# Architecture detection

Use the probe to accelerate inventory, then confirm every security-relevant conclusion in source. Search broadly enough to find indirect authorization and service layers, but avoid reading generated outputs, dependencies, caches, and secrets.

## Evidence order

1. Repository instructions and package/workspace manifests
2. Framework/build/deployment configuration
3. Server entrypoints, routes, actions, resolvers, and RPC routers
4. Service/domain/use-case modules
5. Authentication, session, policy, guards, and middleware
6. ORM/database clients, schemas, repositories, and migrations
7. Third-party clients, payments, storage, email, queues, and webhooks
8. Tests that encode permissions or domain invariants
9. Documentation and environment examples

## Inventory fields

Record observed evidence and confidence for:

- languages, frameworks, runtimes, package manager, workspace layout, and build/test commands;
- UI/server boundaries and application entrypoints;
- REST, GraphQL, tRPC/RPC, server actions/functions, jobs, queues, webhooks, and scheduled work;
- service/domain layers and transaction boundaries;
- authentication providers, session/token model, identity object, roles, scopes, ownership and tenant checks;
- ORM/database, raw queries, file/object storage, caches, search indexes, and data classification;
- third-party APIs, payment flows, outbound messages, publish operations, and externally visible effects;
- security middleware, request limits, validation, CSRF/origin checks, audit logs, and error handling;
- environment-variable names and where they are consumed. Record names only; never print values;
- destructive, privileged, financial, administrative, bulk, export, or irreversible operations.

## Monorepos and ambiguity

Identify the actual deployable application and shared packages before choosing an integration location. If several apps are plausible, analyze them separately and do not invent a common authorization model. Mark conclusions `observed`, `inferred`, or `unknown` with source paths.

## Candidate traces

For every proposed tool, capture the complete call path:

```text
agent outcome -> MCP wrapper -> service/use case -> authorization/ownership -> data/external effect
```

A route handler is evidence of a capability, not automatically the source operation. Prefer the service it calls. If the route itself holds validation or authorization, either reuse that shared policy directly or refactor only when explicitly authorized and low risk.


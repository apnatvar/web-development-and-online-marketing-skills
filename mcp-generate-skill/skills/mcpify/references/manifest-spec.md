# MCP capability manifest specification

`mcp-manifest.yaml` is the review boundary and generation source of truth. Keep it deterministic: sort tools by `name`, use repository-relative POSIX paths, emit stable key order, and avoid timestamps except `standards.last_verified`.

Validate against `assets/mcp-manifest.schema.json`. The schema is a structural floor; semantic checks in `scripts/validate_manifest.py` enforce selected safety invariants.

## Top level

- `version`: schema version; currently `1`.
- `application`: name, framework, language, package manager, root, and optional workspace.
- `transport`: intended `stdio` or `streamable_http`, deployment audience, and endpoint for HTTP when known.
- `standards`: MCP specification revision, SDK/package, and last verification date and URLs.
- `defaults`: conservative server-wide limits and output/error policy.
- `tools`: complete executable capability list, including disabled and excluded entries.
- `resources`: optional approved/proposed addressable context surfaces with URI templates, source, access, data classification, limits, and tests.
- `prompts`: optional approved/proposed user-invoked workflow templates with source, arguments, expected scopes/surfaces, and tests.

## Tool fields

Required:

- `name`, `description`, `status`, and `rationale`
- `source.path`, `source.operation`, and `source.evidence`
- `input_schema` and `output`
- `access.authentication`, `access.scopes`, `access.authorization`, and `access.identity_mapping`
- `risk.level`, `risk.mutation`, and `risk.reasons`
- `limits.requests_per_minute`, `limits.timeout_ms`, `limits.max_concurrency`, and `limits.max_request_bytes`
- `idempotency.required` and strategy
- `confirmation.required` and mechanism
- `data.sensitivity`, minimization, output filtering, and logging rules
- `side_effects`
- `mcp.annotations`
- `tests`

Allowed statuses:

- `proposed`: discovered in analysis; never generated
- `approved`: explicitly reviewed and eligible for generation
- `disabled_pending_review`: high-risk or unresolved; never registered
- `excluded`: prohibited by policy or developer decision; never generated

The skill must never change `proposed`, `disabled_pending_review`, or `excluded` tools, resources, or prompts to `approved` without an explicit developer decision.

## Schema conventions

Use JSON Schema objects for `input_schema` and optional `output.schema`. Set `additionalProperties: false` for object inputs unless a reviewed reason requires otherwise. Constrain strings, arrays, numbers, enums, formats, pagination, and result counts. Do not include identity, tenant, permissions, price, ownership, or other server-derived authority as caller-settable inputs.

`output.mode` is `structured`, `text`, or `mixed`. Prefer structured output with a schema where stable. Specify maximum items/bytes, field allowlists or DTO mapping, redactions, and whether external content is untrusted.

## Semantic invariants

- `approved` high-risk tools require confirmation and a non-`none` mechanism.
- Mutation tools must explicitly address idempotency; high-risk mutations require it unless the operation is provably idempotent by state precondition.
- Critical tools must be `excluded`.
- Authenticated tools require authorization text and at least one scope.
- Public tools must not declare personal, secret, credential, payment, or health data.
- Read-only annotations must agree with `risk.mutation`.
- Source operations may not be generic execution primitives.

Use `assets/mcp-manifest.example.yaml` as a shape example, not as application truth.

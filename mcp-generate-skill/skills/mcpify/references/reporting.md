# Reporting

Every mode report should be reproducible and candid about uncertainty.

## Required sections

- scope, mode, repository root, and analyzed workspace/app;
- observed architecture with evidence paths;
- trust boundaries and identity mapping;
- enabled/proposed/disabled/excluded capability table;
- risk and authorization decisions with rationale;
- files created or changed (none for audit unless explicitly asked);
- validation commands and results;
- skipped or blocked checks and why;
- security assumptions, known limitations, and explicit review decisions needed;
- current MCP spec/SDK/framework verification date and source URLs.
- for release-facing modes: exact version, artifact identifiers/digests, endpoint, package and registry targets, namespace owner, publisher/schema versions, external actions performed, resulting listing/status, and rollback/deprecation path.

Use this summary shape:

| Tool | Status | Access | Risk | Mutation | Confirmation | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `search_products` | Proposed | Public | Low | No | No | `src/services/products.ts#searchProducts` |

Do not call a proposed or disabled capability "available." Separate source-observed facts from inferences. Do not claim a check passed without its command or observable evidence.

When resources or prompts exist, include separate tables for their status, URI/arguments, access, sensitivity, source, and verified client support. Do not mix non-executable surfaces into the tool table.

## Final implementation audit

After generation, confirm:

- no registered tool exists outside approved manifest entries;
- excluded capabilities cannot be reached through a generic tool;
- wrapper schemas and policy match the manifest;
- identity, scopes, ownership, confirmation, idempotency, quotas, filtering, and audit behavior are enforced;
- application logic and public APIs remain intact;
- new environment variables are documented in an example file or docs without overwriting `.env`;
- deployment guidance separates edge protection from application authorization and quotas.

For publication, also confirm that package ownership metadata matches `server.json`, every referenced artifact or remote exists, no secret value is present, the official publisher validation passed, and the published registry response matches local metadata. Report downstream marketplace submissions separately; never describe them as complete based only on official-registry publication.

## Deterministic tooling roadmap

Identify opportunities to replace repeated agent-authored mechanics with generators: manifest normalization, schema-to-tool registration, policy middleware wiring, documentation tables, conformance tests, and manifest/code drift checks. Keep semantic capability choice, risk interpretation, and source mapping reviewable by humans.

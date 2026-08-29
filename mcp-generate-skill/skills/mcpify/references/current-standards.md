# Current standards and re-verification

Last externally verified: **2026-08-29**.

These links are primary sources, not pinned implementation assumptions:

- Codex skills: https://developers.openai.com/codex/skills (redirects to current OpenAI skill documentation)
- MCP specification index: https://modelcontextprotocol.io/specification/2026-07-28/
- MCP tools: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
- MCP authorization: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
- MCP authorization security: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security_best_practices
- Official TypeScript SDK v2: https://ts.sdk.modelcontextprotocol.io/v2/
- Official TypeScript server package: https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/server/
- Official SDK source: https://github.com/modelcontextprotocol/typescript-sdk
- Official MCP Registry: https://registry.modelcontextprotocol.io
- Registry documentation: https://modelcontextprotocol.io/registry/about
- Registry publishing quickstart: https://modelcontextprotocol.io/registry/quickstart
- Registry authentication: https://modelcontextprotocol.io/registry/authentication
- Registry package types: https://modelcontextprotocol.io/registry/package-types
- Registry remote servers: https://modelcontextprotocol.io/registry/remote-servers
- Registry publisher CLI reference: https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md
- Registry source and releases: https://github.com/modelcontextprotocol/registry
- Next.js authentication: https://nextjs.org/docs/app/guides/authentication
- Next.js data security: https://nextjs.org/docs/app/guides/data-security

## Verified baseline

On the date above, the stable TypeScript SDK v2 implements MCP `2026-07-28` and uses `@modelcontextprotocol/server`. The current tool spec supports JSON Schema inputs and outputs, structured content, deterministic tool listing, and tool annotations that clients must treat as untrusted unless the server is trusted. The current HTTP authorization spec uses OAuth 2.1 patterns, protected resource metadata, resource/audience-bound bearer tokens on each request, and 401/403 semantics. Stdio obtains credentials from its environment rather than the HTTP authorization flow.

The 2026-07-28 revision is stateless at the protocol transport level; do not design new code around an implicit initialize/session exchange. Roots, sampling, logging, legacy HTTP+SSE, and prior task mechanics have deprecation or migration implications in this revision; check current guidance before adopting them.

The official MCP Registry accepts standardized `server.json` metadata for package-based and remote servers. Current publishing uses the official `mcp-publisher` workflow, namespace ownership authentication, package-type-specific ownership evidence, exact versions, and lifecycle status commands. The registry is a metadata source for downstream clients and curated marketplaces; it does not make every downstream listing automatic. Schema revisions, supported package types, authentication, and marketplace ingestion must be rechecked at release time.

## Re-verification rule

Before generation or compliance claims:

1. Open the current official MCP specification version and SDK docs; do not rely on search snippets.
2. Confirm stable package names, versions, transport API, protocol lifecycle, tool registration/result types, output schema behavior, authorization discovery, and deprecations.
3. Check framework docs for the installed Next.js major version when applicable.
4. For releases, open the live Registry documentation and current publisher release. Confirm the `server.json` schema URI, namespace/authentication method, supported package/remote types, ownership markers, lifecycle commands, and target marketplace requirements.
5. Record the verification date, spec revision, SDK major, publisher version, schema URI, and exact URLs in the target repository's MCP documentation.
6. If official sources conflict, prefer the normative specification for protocol behavior, the SDK's matching-version docs for API shape, and the current registry schema/CLI for publication. State unresolved incompatibilities rather than guessing.

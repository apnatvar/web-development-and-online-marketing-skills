# bd-mcp-generate-skill

`mcpify` is a reusable Codex skill for taking an existing web application through the complete MCP lifecycle. It analyzes the local repository, proposes agent-facing capabilities in `mcp-manifest.yaml`, classifies risk, generates thin wrappers for approved tools, tests and audits them, prepares packages or remote deployments, connects clients, publishes registry metadata, and supports versioning and incident response.

The skill intentionally does **not** translate every route, server action, service method, or database operation into an MCP tool.

Developed for the ecosystem around [Apnatva](https://apnatva.dev) and [Brownsmith Dynamics](https://brownsmithdynamics.com).

## Layout

The installable skill is at [`skills/mcpify`](skills/mcpify). Its `SKILL.md` is a compact router; detailed architecture, manifest, security, implementation, and test guidance is loaded only for the active mode. Deterministic repository probing and manifest validation live in `scripts/`.

## Use

```text
Use $mcpify in analyze mode on this repository.
Use $mcpify generate from the approved mcp-manifest.yaml.
Use $mcpify audit and report unsafe or unnecessary exposure.
Use $mcpify test without production credentials or destructive calls.
Use $mcpify package and generate validated release metadata without publishing.
Use $mcpify deploy the approved remote server to staging.
Use $mcpify connect the server to the named MCP client.
Use $mcpify publish the tested release to the official MCP Registry.
Use $mcpify operate to deprecate a vulnerable version and document migration.
```

To make it repository-scoped, copy or link `skills/mcpify` to `.agents/skills/mcpify` in the target repository. Codex also supports user-level skill locations.

## Requirements and validation

The deterministic helpers use Python 3. Manifest validation requires PyYAML; full JSON Schema validation additionally uses `jsonschema`.

```powershell
python -m pip install -r skills/mcpify/scripts/requirements.txt
python skills/mcpify/scripts/repo_probe.py . --output mcp-analysis/repository-probe.json
python skills/mcpify/scripts/validate_manifest.py mcp-manifest.yaml
python skills/mcpify/scripts/check_publication.py server.json
python -m unittest discover -s tests -v
```

External MCP and security practices were last verified on 2026-08-29; see `references/current-standards.md` for primary sources and re-verification rules.

## Full lifecycle

1. `analyze` discovers user-oriented capabilities and writes the reviewable manifest.
2. `generate` implements only approved entries using existing application logic.
3. `audit` and `test` verify security, authorization, protocol behavior, and runtime evidence.
4. `package` produces reproducible npm, PyPI, NuGet, Cargo, OCI, MCPB, or remote-server metadata as applicable.
5. `deploy` prepares a production remote endpoint with current MCP authorization and operational controls.
6. `connect` creates least-privilege host configuration and smoke-tests discovery.
7. `publish` releases underlying artifacts, validates `server.json`, publishes to the official MCP Registry or another explicitly named registry, and verifies the listing.
8. `operate` handles releases, compatibility, deprecation, restoration, rollback, vulnerability response, and end-of-life.

Packaging, deployment, registry publication, and marketplace submissions are intentionally separate authorization boundaries. The skill can prepare and validate all release artifacts without making them public.

## Registry and marketplace model

The official MCP Registry is the standardized metadata source for server discovery. Downstream host directories and curated marketplaces may ingest it, add curation, or require their own current submission process. The skill verifies each requested destination's authoritative requirements at publication time instead of assuming one registry submission guarantees placement everywhere.

## About

- [Apnatva — apnatva.dev](https://apnatva.dev)
- [Brownsmith Dynamics — brownsmithdynamics.com](https://brownsmithdynamics.com)

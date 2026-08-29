# Release lifecycle

Use this for package, deploy, publish, or operate modes. Treat each stage as a separate authorization boundary:

```text
tested source -> reproducible artifact -> deployed endpoint (optional)
              -> package registry (optional) -> MCP Registry metadata
              -> downstream marketplace/client discovery -> operations
```

## Release gate

Do not prepare a public release until:

- manifest and code agree and only approved tools register;
- required format, lint, typecheck, build, protocol, authorization, negative-input, and safe runtime checks pass;
- high-risk tools have tested rejection and confirmation paths without destructive production effects;
- package contents, container layers, source maps, examples, fixtures, logs, and history are checked for secrets and private data;
- documentation states tools, scopes, identity mapping, side effects, configuration names, deployment assumptions, support, security reporting, and limitations;
- licenses and third-party package terms permit distribution;
- the release version is exact and consistent across source tag, package/container, `server.json`, and docs;
- rollback/deprecation and ownership-recovery plans exist.

## Choose the distribution shape

- `stdio` package: local process launched by a host. Prefer the ecosystem-native package registry and a reproducible immutable version.
- OCI container: suitable for self-hosted/server deployment; use immutable digests and least-privilege runtime metadata.
- MCPB: downloadable bundle where supported; publish a cryptographic digest and validate the bundle contents.
- remote Streamable HTTP: public or private hosted endpoint; package metadata is optional when the registry `remotes` entry is sufficient.
- hybrid: publish both package and remote definitions when both are genuinely maintained and equivalent.

Do not claim support for a package type merely because the registry schema permits it. Build and test the actual install path on supported platforms.

## Reproducibility and provenance

Prefer clean-checkout builds, locked dependencies, generated-file drift checks, source/version tags, checksums or immutable digests, SBOM/provenance when the repository already supports them, and a record of the exact commands and CI run. Never use `latest` or a version range where registry metadata requires an exact version.

## Outputs

Package mode should produce or update only the applicable files:

- package metadata and ownership marker;
- `server.json` generated with the current official publisher CLI when available;
- container/MCPB definitions and digests;
- release notes, installation examples, support/security links, and a release-readiness report.

Package mode stops before uploading artifacts, deploying endpoints, authenticating to registries, or publishing metadata unless the user explicitly authorizes those actions.


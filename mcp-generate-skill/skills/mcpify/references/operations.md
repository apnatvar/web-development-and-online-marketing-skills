# Operations and lifecycle management

Published MCP servers need a maintained contract across protocol, tools, packages, remote endpoints, registry metadata, and clients.

## Versioning

- Use exact immutable release versions. Keep package/container/bundle, server metadata, docs, and source tag aligned.
- Treat tool removal, rename, input/output narrowing, auth/scope changes, side-effect changes, and transport/endpoint changes as compatibility events.
- Additive tools can still change model selection and risk; audit discovery quality before release.
- Maintain a migration note and compatibility matrix when supporting multiple protocol or client versions.

## Update workflow

Build and test a new artifact, deploy or publish it, publish a new `server.json` version, verify the listing and clean installation, then update downstream directories as needed. Never overwrite evidence for the previous release. Prefer a staged rollout and preserve rollback.

## Deprecation and end-of-life

Use the current official publisher lifecycle command and statuses. Resolve the exact server name and version before mutation. Provide a migration target, reason, impact, and date. Deprecate before deletion when users need time to migrate; hide/delete immediately when a critical exposure makes continued discovery unsafe.

Do not use confirmation-bypass flags for bulk/all-version changes without explicit user authorization and a reviewed target list. Verify lifecycle status through the registry API after the command.

## Security incident response

1. Contain: revoke/rotate affected credentials, disable vulnerable tools or endpoint paths, block exploit traffic, and preserve evidence.
2. Assess: affected versions, identities, scopes, data, tool calls, tenants, packages, images, endpoints, and downstream listings.
3. Remove exposure: deprecate or delete affected registry versions and unpublish/quarantine artifacts where ecosystem rules permit.
4. Fix and verify: patch the narrow cause, audit generic bypass paths, rebuild clean artifacts, retest, and issue a new version.
5. Communicate: publish an advisory, upgrade/credential guidance, impact window, indicators, and support route without disclosing secrets or unnecessary exploit detail.
6. Recover: restore only after verification, monitor for recurrence, and document follow-up controls.

## Operational minimums

Maintain ownership access, security contact, supported versions, dependency/protocol monitoring, uptime and error telemetry for remote servers, audit-log retention, quota review, backup/restore for required application state, a tested credential-rotation path, and a documented transfer/end-of-life process.


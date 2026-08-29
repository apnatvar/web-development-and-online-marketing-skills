# Registry publication

The official MCP Registry is a public metadata registry for MCP servers. It is not a guarantee of inclusion, ranking, endorsement, or review in every downstream client marketplace. Curated subregistries and host directories may mirror official metadata or impose additional requirements.

The official registry and publisher formats are versioned and may change. Immediately before preparing or publishing, open the current official quickstart, authentication, package-type, remote-server, CLI, and schema documentation linked from [current standards](current-standards.md). Prefer `mcp-publisher init` and `mcp-publisher validate` over copying a stale schema or example.

## Prepare `server.json`

Use the current official schema and include only truthful, public metadata:

- namespace-qualified server `name`, human title, concise description, and exact version;
- public source repository when intended, with correct source type and optional monorepo subfolder;
- one or more tested `packages` entries and/or publicly reachable `remotes` entries;
- exact package identifiers and versions, transport type, runtime/package arguments, and declared variables;
- secret configuration declared by name and description with its secret flag, never a value or usable credential;
- publisher extension metadata only under the permitted reverse-DNS namespace.

For remote entries, prefer Streamable HTTP. Use HTTPS, a public stable URL, current MCP authorization metadata when protected, and no private/internal hostnames. Avoid deprecated SSE for new servers.

## Ownership and namespace

Select authentication before finalizing the name:

- GitHub authentication/OIDC uses the namespace form required for the owning user or organization;
- domain namespaces require current DNS or HTTP ownership verification;
- authenticate with the account/domain that will own updates and incident response, not a temporary personal identity.

Package ownership checks differ by package type. Current official guidance may require, for example, a matching `mcpName` in npm metadata, an `mcp-name` marker in a PyPI description, a matching OCI annotation, or an MCPB URL and SHA-256. Verify the exact current rule and make the server name identical everywhere.

## Publication procedure

1. Confirm the user authorized the exact registry, namespace, server name, version, package identifiers, and remote URLs.
2. Ensure underlying packages/images/bundles and remote endpoints already exist and are independently installable/reachable.
3. Obtain the publisher CLI from an official signed release or approved package source; record its version and checksum/provenance where available.
4. Run local build/test/security checks and `scripts/check_publication.py server.json`.
5. Run the current official `mcp-publisher validate server.json`.
6. Authenticate using the approved interactive method or protected CI identity. Never print or persist the returned token in repository files or logs.
7. Preview the exact target and metadata. Publish only after authorization is established.
8. Query the official registry API/listing by exact name and version. Compare returned metadata with local `server.json` and test the published installation/remote path from a clean environment.
9. Record registry URL, publication timestamp, publisher CLI version, artifact digests, listing identifier, and verification results in the release report.

Never retry an uncertain publish with changed metadata or a different namespace. First query the registry for the exact name/version and inspect the previous command result. Registry publication can reserve names or remote URLs even when later hidden.

## CI publishing

Prefer tag-triggered protected workflows, minimal permissions, protected environments, trusted actions pinned according to repository policy, and OIDC or short-lived credentials over long-lived tokens. Keep package publication and MCP metadata publication separately observable. Do not auto-publish from pull requests or untrusted forks.

## Downstream marketplaces

For each explicitly requested marketplace or client directory:

1. open its current official publisher/submission documentation;
2. determine whether it ingests the official registry automatically or requires a separate form, repository change, account connection, review, policy, branding asset, or security attestation;
3. report fees, review status, data/privacy requirements, and ongoing update obligations when documented;
4. prepare the listing without submitting unless that destination is explicitly authorized;
5. after submission, verify the public listing and installation independently.

Do not invent a universal marketplace submission flow, imply endorsement, or scrape unpublished submission endpoints.


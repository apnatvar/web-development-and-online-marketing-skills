# Analyze mode

Analysis is evidence gathering and manifest authoring. It must not add MCP dependencies, runtime code, routes, or adapters, and must not change application logic.

## Procedure

1. Define the repository root and read local instructions. Record dirty-tree state; preserve unrelated changes.
2. Run the deterministic probe when practical and save its output under `mcp-analysis/`. Treat matches as leads, not proof.
3. Inspect package manifests, configuration, entrypoints, routing, services, auth, data access, external integrations, middleware, environment-variable references, tests, and deployment files.
4. Build architecture and trust-boundary maps. For each candidate, trace from user outcome to existing source operation, identity, authorization, data access, external effects, and output.
5. Reject implementation-shaped candidates. Prefer coarse, intelligible user outcomes with bounded inputs and outputs.
6. Assign status: safe established candidates are `proposed`; high-risk or uncertain ones are `disabled_pending_review`; critical ones are `excluded`.
7. Create or merge `mcp-manifest.yaml`. Preserve existing developer decisions and comments where feasible; never silently promote a status to `approved`.
8. Validate the manifest and create `docs/mcp-analysis.md` with findings, candidate and excluded capability tables, authorization gaps, and recommended review decisions.

Outputs are `mcp-analysis/repository-probe.json` when used, `mcp-manifest.yaml`, and `docs/mcp-analysis.md`. If repository conventions conflict, choose the nearest conventional location and document it. Do not create MCP runtime files.

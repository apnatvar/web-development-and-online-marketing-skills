# Capability design

Capabilities describe what an external agent should accomplish for a user, not which internals are callable.

## Selection test

Propose a tool only when all of these are true:

1. The outcome is meaningful in user language and likely useful in an agent workflow.
2. Inputs can be narrowly modeled with strict types, bounds, and no arbitrary code/query/URL forwarding.
3. An existing domain operation or stable application API can provide the behavior without duplicating rules.
4. Identity and authorization can be mapped and enforced for every affected resource.
5. Outputs can be minimized and filtered for an agent.
6. Side effects, failure modes, rate, latency, and replay behavior are understood.
7. The risk is acceptable or the entry can remain explicitly disabled pending review.

## Shape tools around intent

Good shapes are `search_products`, `get_order`, `add_item_to_cart`, and `cancel_eligible_order`. Poor shapes are `execute_sql`, `invoke_route`, `run_server_action`, `update_record`, `fetch_url`, or a generic tool with `operation` and `args` fields.

Avoid one tool per internal function. Combine stable user intent when that reduces ambiguous selection without broadening authority. Split capabilities when authorization, risk, confirmation, rate, or output sensitivity differs.

Do not expose batch or wildcard behavior just because an internal API supports it. Require stable identifiers and explicit maximum counts. Avoid accepting caller-supplied user, tenant, price, role, permission, owner, callback URL, or state-transition values when they should derive from identity or server state.

## Evidence record

For each candidate, record:

- user goal and example request;
- source path, export/symbol, and call-path evidence;
- preconditions and domain invariants;
- identity and authorization enforcement point;
- input constraints and derived fields;
- output fields, truncation/pagination, and sensitive-data policy;
- database, network, message, payment, storage, or queue side effects;
- expected latency, retry/idempotency semantics, and error categories;
- risk rationale, status, uncertainties, and reviewer decision.

Capabilities involving payments, authorization changes, administrative controls, secret management, arbitrary database access, arbitrary outbound requests, or command/code execution remain excluded by default even when technically easy to implement.


# MCP protocol surface design

Use the smallest MCP primitive that matches the interaction. Do not turn every readable object into a resource, every workflow into a prompt, or every callable into a tool.

## Tools

Use tools for bounded computation, retrieval requiring parameters/authorization, and state changes. Tools are model-controlled and potentially callable whenever discovered, so descriptions, strict schemas, scope-dependent listing, execution-time authorization, output filtering, and side-effect controls matter.

## Resources

Use resources for addressable contextual data that a client or user can deliberately read, such as public documentation, approved record views, or stable artifacts. Design explicit URI schemes/templates, MIME types, pagination/size limits, ownership checks, cache policy, subscription/update semantics, and content sanitization. A resource URI is a name, not an authorization capability; recheck caller access on every read.

Do not expose raw filesystem trees, database tables, internal object graphs, secrets, private logs, or arbitrary URI fetches. Treat user/third-party resource content as untrusted and preserve provenance.

## Prompts

Use prompts for user-invoked, reusable workflow templates that improve how a host asks the model to use the server. Prompts must not embed secrets, silently invoke effects, expand authority, or replace server-side validation. Keep arguments bounded and document which tools/resources and scopes the workflow expects.

## Other protocol features

Adopt elicitation/input-required, tasks/extensions, subscriptions, completion, and server-initiated features only when the current specification and target clients support them and the interaction materially benefits. Define cancellation, timeout, replay, state ownership, persistence, recovery, and downgrade behavior. Avoid deprecated features in new implementations.

## Design review

For each surface record status, source evidence, access, sensitivity, size, caching, side effects, client support, protocol revision, and tests. Executable tools remain governed by the tool approval and risk rules. Resources and prompts use the same `proposed`, `approved`, `disabled_pending_review`, and `excluded` statuses and must never be generated from unapproved entries.

Test discovery for tools, resources, and prompts independently. A safe tool set can still be undermined by a resource leaking private data or a prompt encouraging unsafe multi-tool behavior.

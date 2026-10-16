# Sources and optional external skills

Use the installed package/version documentation first for implementation. Consult current primary sources when APIs, policies, metrics, security controls or service behavior may have changed. The links below support deeper inspection; they are not a list of mandatory integrations. Some documentation endpoints negotiate Markdown, so use an available supported fetch/browser or the installed docs if a web reader cannot parse the response.

## Primary references

| Topic | Authoritative starting point |
| --- | --- |
| Next.js production, rendering, loading and version-specific behavior | [Production checklist](https://nextjs.org/docs/app/guides/production-checklist), [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Lazy loading](https://nextjs.org/docs/app/guides/lazy-loading) |
| Next.js data boundary and CSP | [Data security](https://nextjs.org/docs/app/guides/data-security), [Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy) |
| Search crawling and migrations | [Google site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [robots/noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) |
| AI search discovery boundaries | [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features) |
| Loading/interaction/stability metrics | [Web Vitals](https://web.dev/articles/vitals), [LCP](https://web.dev/articles/optimize-lcp), [INP](https://web.dev/articles/optimize-inp), [CLS](https://web.dev/articles/optimize-cls), [FCP](https://web.dev/articles/fcp) |
| Accessibility and geometry | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| HTTP representations, methods, status and negotiation | [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), [HTTP caching RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html) |
| Response hardening | [OWASP HTTP headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [OWASP cheat sheet index](https://cheatsheetseries.owasp.org/) |
| Telegram intake | [Bot tutorial](https://core.telegram.org/bots/tutorial), [Bot API and sendMessage](https://core.telegram.org/bots/api#sendmessage) |
| Google Forms supported capabilities | [Forms API overview](https://developers.google.com/workspace/forms/api/guides); use the published responder surface for ordinary submissions |
| API and tool contracts | [OpenAPI specification](https://spec.openapis.org/oas/latest.html), [MCP specification](https://modelcontextprotocol.io/specification/latest) |
| Deployment exclusions | [Vercel ignore](https://vercel.com/docs/deployments/vercel-ignore); verify behavior for the chosen deployment method |

## Optional external skills

These are links only. No upstream skill content is bundled, installed, or required by this skill. Review each current scope, license and instructions before use; do not import project-specific rules or conflicting approval requirements automatically.

- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices): additional React/Next.js performance guidance when that task needs it.
- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): an optional interface-review workflow, subject to the receiving project's design brief.
- [Vercel agent skills collection](https://github.com/vercel-labs/agent-skills): browse only for a specific missing capability; collection size is not a quality gate.

If an installed writing, humanization, SEO or specialist security skill is available and actually relevant, use it within the task's scope. Keep the core workflow operational when it is absent: research factual claims, structure the argument, review language, verify content/metadata consistency and disclose remaining uncertainty. Do not silently install a dependency merely because a related skill is linked.

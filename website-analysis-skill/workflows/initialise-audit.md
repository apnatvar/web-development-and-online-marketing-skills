# Initialise an audit

1. Require mode selection before site inspection.
2. Require one input type: existing local path or public URL.
3. Require Markdown or local HTML output.
4. Reject remote private-repository access; request a local checkout path.
5. For copy/combined, gather and validate intent before reading pages.
6. Propose pages and obtain approval or an explicit delegation to sensible defaults.
7. Run tool preflight. Explain missing required tools and likely sandbox restrictions.
8. Create a new output directory; never overwrite an earlier audit unless the user explicitly chooses it.
9. Record the baseline configuration and repository commit before analysis.

Use `node scripts/audit.mjs --propose-pages --input-type ... --input ...` only after mode is known. Discovery is not permission to audit the entire site.

# Public-URL audit

This example runs a combined audit against the reserved public URL `https://example.com/`, using a supplied intent derived from its public purpose. It performs three Lighthouse runs and generates a version-control-friendly Markdown report while clearly avoiding code-level claims without repository access.

```powershell
node examples\public-url-audit\run.mjs
```

Output: `audit-results/reports/audit.md`.

# Fictional local-repository audit

This example runs a combined audit against `tests/fixtures/local-site`, serves the static files on an ephemeral loopback port, performs three Lighthouse runs on each of three approved routes, and generates a self-contained local HTML report.

```powershell
node examples\local-repository-audit\run.mjs
```

Output: `audit-results/reports/audit.html`. The fixture, business, location, and copy are fictional.

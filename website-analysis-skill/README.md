# Website Tech & Content Analysis

A reusable Codex skill for auditing AI-built websites. It combines standardized Google Lighthouse measurement, SEO and HTML checks, local repository evidence, public-site inspection, and intent-aware copy review. Reports explain what is wrong, why it matters, what to change, and how to verify the repair.

## Modes

| Mode | Requires intent | Lighthouse | Main output |
|---|---:|---:|---|
| Technical | No | Yes | Performance, accessibility, SEO, best practices, mobile/rendering, crawl/index, metadata, links, semantics, and observable headers |
| Copy | Yes | No | Purpose, audience, value proposition, headings, offer, CTAs, trust, clarity, intent/keyword alignment, and consistency |
| Combined | Yes | Yes | One synthesized priority plan joining technical and messaging effects |

Inputs are an existing local repository path or a public website URL. The skill never reads or clones a private remote repository. Outputs are Markdown or self-contained local HTML; PDF is unsupported.

## Install

Node.js 22.19 or newer is required by the pinned Lighthouse 13.4.1 dependency. Technical and combined audits also require Chrome or Chromium.

```powershell
npm install
npm run check:tools -- --lighthouse
```

If Chrome is not discovered:

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run check:tools -- --lighthouse
```

To install for personal Codex discovery, copy this directory into the configured skills directory:

```powershell
$skillsRoot = if ($env:CODEX_HOME) { Join-Path $env:CODEX_HOME 'skills' } else { Join-Path $env:USERPROFILE '.codex\skills' }
Copy-Item -Recurse -Force . $skillsRoot\website-tech-content-analysis
```

Package installation, Chrome launch, a local preview server, and outbound target access can be blocked by a sandbox. Grant only the narrowly required approval or run the documented command in an unrestricted terminal. The skill never invents Lighthouse scores when a dependency is unavailable.

## Use with Codex

Example requests:

```text
Use $website-tech-content-analysis to audit my local site at C:\work\acme-site.
```

```text
Use $website-tech-content-analysis to review the copy at https://www.example.com and compare it with my business intent.
```

```text
Use $website-tech-content-analysis to run a combined audit and produce a local HTML report.
```

Codex asks for mode, input type/location, and output format before analysis. Copy and combined modes require website purpose, audience, visitor problem, desired action, product/service, differentiator, geographic or industry focus, priority pages, known target keywords, and preferred tone. Codex then proposes representative pages for approval.

## CLI

Propose local pages:

```powershell
node scripts/audit.mjs --propose-pages --input-type local --input C:\work\acme-site
```

Run a local technical audit after the site is served:

```powershell
node scripts/audit.mjs `
  --mode technical `
  --input-type local `
  --input C:\work\acme-site `
  --pages /,/services,/contact `
  --base-url http://127.0.0.1:4173 `
  --format markdown `
  --output audit-results\acme-technical
```

Run a public copy audit:

```powershell
node scripts/audit.mjs `
  --mode copy `
  --input-type public-url `
  --input https://www.example.com `
  --pages https://www.example.com/ `
  --intent intent.json `
  --format html `
  --output audit-results\example-copy
```

Run a public combined audit using its proposed default pages:

```powershell
node scripts/audit.mjs `
  --mode combined `
  --input-type public-url `
  --input https://www.example.com `
  --approve-default-pages `
  --intent intent.json `
  --format html `
  --output audit-results\example-combined
```

`--allow-partial` explicitly permits a report that records and omits a failed required measurement. Without it, technical and combined audits fail if Lighthouse cannot run.

## Lighthouse baseline

Comparable runs use `config/lighthouse-baseline.json` and `config/lighthouse.config.cjs`:

| Setting | Baseline |
|---|---|
| Lighthouse | 13.4.1 |
| Chrome | 150.0.7871.129 comparison baseline; exact runtime is recorded |
| Profile | Mobile, 412 x 823 CSS px, DPR 1.75 |
| CPU | 4x slowdown |
| Network | Simulated; 150 ms RTT/request latency, 1638.4 Kbps down, 750 Kbps up |
| Cache | Cold; storage reset before each run |
| Runs | Three per page |
| Categories | Performance, accessibility, best practices, SEO |
| Aggregation | Median category score, audit score, and numeric metric |

Standardization improves comparability; performance still varies. Lighthouse lab data does not replace CrUX or real-user field data, and TBT is not field INP.

## Results and comparison

Each audit stores `raw/audit-config.json`, `raw/audit-data.json`, three raw Lighthouse JSON files per tested page, one calculated median per page, and `reports/audit.md` or `reports/audit.html`. The recorded provenance includes target, date, local Git commit when available, build mode, Node/Lighthouse/Chrome versions, throttle settings, selected pages, run count, raw paths, report version, and SEO knowledge date.

Use `scripts/compare-audits.mjs` for an optional before-and-after comparison.

## Refresh SEO knowledge

Ask Codex to `update SEO practices`, `refresh SEO knowledge`, or `verify current SEO guidance`. The workflow reads the existing module, reviews official sources, prepares a review manifest, dry-runs the updater, inspects a generated diff, and applies only verified changes. It refuses timestamp-only updates, preserves previous files under `knowledge/seo/history/`, records reviewed sources and unverifiable advice, and appends the changelog.

The bundled knowledge version is `2026.07.22`, last verified `2026-07-22` against 23 authoritative sources. The default warning threshold is 90 days and the critical threshold is 180 days.

## Architecture

```text
SKILL.md                    mode router and safety contract
workflows/                  intake, discovery, execution, reporting, SEO refresh
knowledge/seo/              versioned practices, metadata, sources, changelog
knowledge/technical/        technical-only references
knowledge/copy/             copy-only references
config/                     defaults, Lighthouse, severity, staleness, tools
schemas/                    audit, intent, finding, Lighthouse, report, SEO contracts
scripts/lib/                inspectors, analyzers, synthesis, reports, orchestration
scripts/*.mjs               command-line entry points
templates/                  Markdown and HTML report conventions
tests/                      unit/integration tests and fictional fixtures
examples/                   local-repository and public-URL demonstrations
```

The mode router prevents copy-only audits from loading technical or Lighthouse modules and prevents technical-only audits from collecting intent or loading copy guidance.

## Validate

```powershell
npm test
npm run validate
```

Validate a generated audit:

```powershell
node scripts/validate-findings.mjs --input audit-results\raw\audit-data.json --output-root audit-results
```

The tests cover intake rules, mode isolation, both input types, route/sitemap discovery, Lighthouse commands/configuration/medians/measurement classes, HTML and metadata inspection, headings, CTAs, copy-intent comparison, prioritization, combined synthesis, both report formats, SEO staleness and update records, prompt-injection resistance, and sensitive-data redaction.

## Limitations

- Public HTML cannot prove a source file, framework component, CMS plugin, or code-level root cause.
- Automated accessibility tools cannot establish WCAG conformance.
- Lighthouse is lab data and varies with the machine, server, network, third parties, and page state.
- Indexing, query performance, and conversion impact require Search Console, analytics, logs, or field data.
- Dependency-light source and HTML inspection can miss highly dynamic or custom framework patterns.
- Authentication, consent, personalization, locale changes, and interaction-only content need a configured browser session, often Playwright MCP.
- The skill recommends repairs; it changes website files only after a separate explicit implementation request.

## Extension points

- Framework-specific route and metadata adapters.
- Playwright MCP flows for authenticated and interactive states.
- Richer Axe and manual accessibility worksheets.
- Search Console, CrUX, analytics, and server-log importers.
- Schema feature validators.
- Page-role samplers for ecommerce, editorial, SaaS, and local-business sites.
- Before/after trend dashboards using retained raw results.

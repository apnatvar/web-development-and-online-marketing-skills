# Generate and validate the report

Use only Markdown or self-contained local HTML.

Include summary, audit configuration, intent (or “not collected” for technical mode), tested pages, priorities, full findings, Lighthouse medians/raw paths, SEO verification date/staleness, reproducibility, and limitations. HTML uses expandable issue details, internal evidence links, score tables/bars, and no hosted backend.

Run:

```text
node scripts/validate-findings.mjs --input <output>/raw/audit-data.json --output-root <output>
```

Confirm required fields, intent, valid local paths, raw Lighthouse runs, correct medians, public uncertainty wording, working anchors/links, no duplicate findings, no secrets, no unresolved template markers, and the expected report file. Open and inspect HTML at mobile and desktop widths.

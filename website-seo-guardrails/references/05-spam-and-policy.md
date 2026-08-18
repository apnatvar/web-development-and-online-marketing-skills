# Spam and Policy Guardrails

Review current Google Search spam policies before high-risk launches. A technically indexable page can still be excluded algorithmically or through a manual action.

## Block or escalate

- **Scaled content abuse:** many unoriginal/low-value pages created mainly to manipulate rankings, whether produced by AI, humans, scraping, translation, stitching, or templates.
- **Doorway abuse:** substantially similar pages/sites targeting query or location variants that funnel users to the same destination.
- **Cloaking and sneaky redirects:** materially different content or destinations for crawlers and users.
- **Hidden text/link abuse and keyword stuffing:** concealed or unnatural content created to manipulate relevance.
- **Scraping:** copied or lightly transformed content without added value.
- **Link spam:** paid, exchanged, automated, embedded, or low-quality links intended to manipulate ranking.
- **Site reputation abuse:** third-party content hosted primarily to exploit the host site's ranking signals.
- **Expired domain abuse:** repurposing an expired domain primarily to exploit past reputation with low-value content.
- **Misleading functionality:** a page claims to provide a tool/service but primarily routes users to ads or deception.
- **Structured-data abuse:** markup that is false, invisible, irrelevant, outdated, or not representative of the page.
- **Hacked content, malware, phishing, malicious behavior, and user-generated spam.**

## Generative AI rule

AI assistance is not inherently prohibited. The risk is scale and purpose: mass-generating commodity pages for rankings without original value. Require human accountability, factual verification, original contribution, coherent site focus, controlled publishing, and an indexability review. Preserve prompts/provenance when it assists governance, but do not add “AI-generated” as a substitute for quality control.

## Link qualification

Qualify advertising, sponsorships, affiliate placements, gifts, and paid reviews with `rel="sponsored"` (optionally with `nofollow`). Mark user-generated links `ugc`; use `nofollow` for untrusted destinations. Disclosure to users and link qualification are separate requirements.

## Incident response

If a manual action or security issue exists: contain the cause, inventory affected URLs/content/links, remove or correct violations across the pattern—not only examples—document evidence, validate the clean state, and submit a factual reconsideration request only after remediation. Never file a reconsideration request claiming fixes that have not occurred.

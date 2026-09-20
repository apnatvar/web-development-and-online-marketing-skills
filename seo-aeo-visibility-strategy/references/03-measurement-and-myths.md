# Measurement and weak-shortcut checks

## Measurement framework

| Dimension | Metrics | Purpose |
| --- | --- | --- |
| Coverage | Indexed valuable URLs, question families covered, topic gaps | Confirms that retrievable answers exist. |
| Visibility | Impressions, position distributions, search-feature presence, generative-feature impressions where available | Measures retrieval and ranking exposure. |
| Demand capture | Clicks, CTR, branded/non-branded split, landing-page mix | Separates exposure from selection. |
| Authority/reputation | Relevant referring domains, credible unlinked mentions, branded demand, citations | Tracks external recognition. |
| AI | Prompt-family citation rate, explicit mention rate, cited URLs, context/sentiment, referral traffic | Separates being used as a source from being named. |
| Commercial | Qualified leads, purchases, assisted conversions, revenue/page, demos | Prevents traffic-only optimization. |
| Corpus quality | Index bloat, duplicate clusters, stale pages, broken links, experience metrics | Keeps the site healthy. |

Define a baseline, change window, comparison cohort, and review date. Annotate releases and compare like-for-like page families. Do not infer causality from a single ranking movement, one manual prompt, or a third-party visibility score.

## Initiative scorecard

For every proposed initiative record:

- target user and business outcome;
- affected page family;
- visibility layer addressed;
- expected impact and confidence;
- implementation and maintenance effort;
- prerequisites and owner;
- acceptance test;
- leading indicator and outcome metric;
- earliest sensible review date;
- stop, revise, or scale rule.

## Myth and shortcut checks

| Claim | Assessment | Better interpretation |
| --- | --- | --- |
| “You need special AI schema for AEO.” | False for Google Search. | Use supported structured data only when it matches visible content and current feature rules. |
| “Every page must be broken into tiny AI chunks.” | Unsupported as a requirement. | Use clear sections because they help users and retrieval; there is no magic chunk size. |
| “llms.txt improves Google Search AI visibility.” | False for Google Search as of the source review. | Google says it ignores the file for visibility/ranking; other systems may choose their own support. |
| “FAQ schema is an easy rich-result win.” | Obsolete for Google Search as of 2026. | FAQ content may still help users; verify current rich-result support before adding markup. |
| “More pages create topical authority.” | False. | Distinct useful coverage can help; scaled commodity pages create quality and index risks. |
| “Domain Authority is a Google metric.” | False. | DA/DR are third-party diagnostic metrics, not Google scores. |
| “Buy links or mentions to accelerate AEO.” | High risk and weakly grounded. | Earn relevant references and qualify paid relationships correctly. |
| “If an AI cites a page, the brand is visible.” | Not necessarily. | Track citations and explicit brand mentions separately. |
| “AI-written content is automatically bad for SEO.” | False. | Evaluate usefulness, originality, accuracy, and scale; low-value automated publishing can violate spam policies. |
| “Small sites need constant crawl-budget work.” | Usually false. | Prioritize index and sitemap hygiene unless evidence shows crawl/discovery constraints. |

## Reporting guardrails

- Distinguish observations, platform documentation, third-party findings, hypotheses, and recommendations.
- Date-stamp platform-dependent statements.
- Report uncertainty and missing access.
- Never convert correlation into a claimed ranking factor.
- Never promise outcomes that platforms control.
- Track changes long enough for the site, crawl frequency, and demand pattern involved.

# Select audit mode

Ask the user to choose one:

- `technical`: performance, accessibility, Lighthouse SEO/best practices, mobile/rendering, crawl/index controls, metadata, structure, links, and observable headers. Do not request business intent by default.
- `copy`: visible messaging compared with the user’s intent. Do not run Lighthouse or load technical modules.
- `combined`: one prioritized synthesis of technical and messaging issues. Require intent and run technical measurements.

If the user asks only “audit my site,” pause before analysis and obtain the choice. If the user already supplied a clear mode, do not ask again.

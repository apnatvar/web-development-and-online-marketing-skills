# Combine findings

1. Deduplicate the same underlying issue across tools and pages.
2. Preserve every evidence source and affected page.
3. Create a synthesized finding when a technical and copy problem share a repair; link the source finding IDs.
4. Remove source findings from the main priority list when the synthesized finding fully subsumes them; retain their evidence through related IDs.
5. Rank dependencies first: reachability/indexing, usable rendering, message/structure, conversion, then refinements.
6. Do not let Lighthouse score changes override higher user, search, or conversion impact.
7. Keep unsupported analytics/Search Console conclusions in `monitor` with the evidence needed to confirm them.

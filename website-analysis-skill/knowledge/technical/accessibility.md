# Accessibility audit guidance

Load only for technical or combined audits.

- Use Lighthouse/Axe for detectable rules, then add manual keyboard, focus, zoom/reflow, screen-reader landmark/name/role/value, error-message, motion, and comprehension checks.
- Do not claim WCAG conformance from an automated scan.
- Explain affected user behavior before citing a success criterion.
- Prioritize blocked tasks, unlabeled controls, keyboard traps, invisible focus, severe contrast failures, and inaccessible conversion steps over cosmetic semantics.
- Keep accessibility and SEO claims separate: semantic structure and alternatives help interpretation, but do not invent direct ranking effects.
- For local repositories, identify the shared component and route. For public URLs, describe the rendered fault and say that the exact component requires source access.

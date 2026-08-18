# Accessibility

[Back to index](../index.md)

Accessibility is part of performance and discovery: semantic server-rendered content remains understandable across assistive technology, slow devices, crawler rendering, and script failures.

## Core checks

- One logical H1 and sequential heading structure.
- Landmarks and visible hierarchy that match DOM order.
- Native links for navigation and buttons for actions.
- Keyboard access, visible focus, escape behavior, and focus return for overlays.
- Labels, names, descriptions, errors, and status announcements for controls.
- Informative alt text and decorative empty alt.
- Adequate contrast, zoom/reflow, touch targets, and non-color cues.
- Reduced-motion behavior and no essential information conveyed only through motion.

Loading fallbacks should reserve space without using an inaccurate ARIA label or continuously announcing decorative skeletons. Deferred content must become reachable by keyboard and assistive technology when loaded.

Test responsive navigation, dialogs, accordions, quizzes, search/filter interfaces, sticky/pinned sections, media controls, and error states. Automated tools catch only a subset; perform keyboard and screen-reader-oriented manual checks.

Related: [Page architecture](page-architecture.md), [Animations](animations.md), [Images and media](images-media.md), and [Validation](validation.md).

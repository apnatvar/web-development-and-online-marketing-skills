# Design system and responsive layout

Use this reference when creating or changing a business marketing site’s visual system, page composition, navigation, typography, responsive behavior, interaction feedback, or motion. It is not a template or required brand system.

Classify guidance as:
- **Correctness and accessibility invariants:** content remains readable and available; controls work by keyboard and touch; semantic relationships and focus are clear; layouts do not clip required content; motion preferences are respected.
- **Conditional implementation choices:** responsive breakpoints, sticky panels, animation tools, scroll containers, and loading behavior depend on content, framework, device, and measured need.
- **Optional visual direction:** type style, palette, card treatment, composition, and decorative motion are choices. Present viable options and tradeoffs without selecting a universal winner.

## Start with the page’s job

Before tuning visuals, identify the audience, decision, content priority, and next action. Put the central promise and next useful choice in the initial reading order. The hierarchy should help visitors answer “am I in the right place?”, “what can I do here?”, and “where should I go next?” without interpreting decoration.

Keep DOM order meaningful when CSS changes visual placement. A split hero, overlap, sticky side panel, or desktop grid should still read sensibly when styles are unavailable, the viewport narrows, text grows, or assistive technology follows source order. Do not rely on animation, hover, or image text to reveal essential meaning.

Keep all hero content, links, and controls available at every viewport and text size. A minimum-height hero is one way to create visual presence; allow it to expand or scroll when the content needs space. Account for browser chrome, safe areas, longer translations, large text, and multi-line buttons.

## Establish a small visual grammar

One optional approach is to establish type roles before page-specific sizes: display/heading, reading text, interface labels, and code or data. A controlled heading measure and fluid size can coexist with readable body line length and line height. A clamp() range can scale type across viewports, but test its smallest and largest values with real text. Balance headline wrapping without forcing explicit line breaks that fail with zoom or content changes.

A consistent spacing scale and small set of layout widths are one way to keep composition coherent; choose them when they fit the product and content. Let content size itself where possible. In grids and flex children, minmax(0, 1fr) and min-width: 0 can prevent intrinsic content from forcing a column wider than its container. Gap, padding, and gradual responsive spacing can reduce breakpoint overrides. Keep required content and actions visible at small widths.

Do not prescribe a palette, font family, border shape, or card style from a prior project. Those are product choices. Preserve contrast and readable states while applying the chosen identity. Decorative treatments such as ASCII, outlined type, grain, gradients, or geometric borders must not replace accessible text. Keep real text in the DOM and expose a stable name to assistive technology; hide purely decorative symbols and duplicated visual labels from the accessibility tree. Choose a semantic fallback font and avoid ASCII layouts whose columns depend on fixed character counts.

A compact visual system is one option for supporting scanning: repeated spacing, a consistent heading treatment, or a recognizable action style. Compare it with other approaches against the product’s identity and content. Cards, serif display type, animation, and asymmetrical composition are optional.

## Plan responsive behavior from content

Start with the narrow layout and expand when content needs another column. Use breakpoints where the composition stops working, not because a device model is popular. Check narrow and wide phones, tablet portrait and landscape, a short laptop viewport, and a large desktop. Responsive design includes more than width: test orientation, height, pointer precision, text scale, zoom, and motion preference.

At small widths, preserve the same information and choices in a useful order. Stack related columns, let buttons wrap, make cards content-sized, and keep important content visible without hover. Avoid turning equal choices into a carousel merely to save vertical space. Avoid fixed widths, fixed heights, non-wrapping headings, and global rules that indiscriminately set every h1 or h2 to width: 100%. Such selectors can override visually hidden heading utilities and create horizontal overflow; exclude .sr-only or equivalent utility classes from visual layout selectors.

Do not solve every overflow problem with overflow: hidden. Find whether a grid track, long URL, code sample, table, or intrinsic image is causing it. Use min-width: 0, sensible wrapping such as overflow-wrap: anywhere for unbreakable identifiers, or a local scroll container for content that genuinely needs two-dimensional reading. The page itself should not scroll horizontally for ordinary text. Tables and code blocks can have controlled local overflow where necessary, with a visible cue and intact keyboard access.

Check reflow and zoom against WCAG guidance: ordinary content should fit a 320 CSS-pixel viewport without two-dimensional scrolling, and text should resize to 200% without loss of content or function. These are checks, not substitutes for understanding the page structure. See [WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

## Navigation, sticky elements, and scroll containers

A header should expose the primary destinations and a clear menu control at each breakpoint. Use semantic header and nav elements with specific accessible labels. Add a skip link where it improves keyboard navigation. Do not make navigation depend on hover, and do not let decoration obscure the focus indicator.

For a mobile modal menu, consider native dialog and showModal() where suitable. Provide a useful accessible name, clearly labelled open and close controls, an obvious close path including Escape, and working focus behavior. Ensure focus returns sensibly after close, background scrolling is restored if it was locked, timers and listeners are cleaned up, and the panel can scroll when taller than the viewport. Follow the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and test keyboard operation; a native dialog does not remove the need to verify behavior.

Measure the real header and breadcrumb/subnavigation stack, then define a shared offset for sticky panels and anchor targets. Do not copy a guessed top offset into every component. Header changes can otherwise make a table of contents cover headings or trap a short screen. For tall sticky panels, constrain their height against the available viewport and allow their contents to scroll. Verify desktop, tablet, phone, short landscape, and browser zoom. Consider whether sticky behavior helps at each size; static content can be more usable on narrow screens.

Position: sticky is an optional layout behavior for an element that can add context while a related section scrolls. Check whether it remains within its section, clears global chrome, and fits the available viewport; otherwise use a static layout. On touch devices, CSS :hover may be sticky or simulated; do not use hover alone to trigger important state or freeze animation. Gate hover-only behavior with (hover: hover) and (pointer: fine), and preserve equivalent visible behavior for focus and touch.

Keep scrollable regions intentional. A modal menu, code sample, or long TOC may need its own scroll container; ordinary sections should follow normal document scroll. Avoid global smooth-scroll libraries unless a measured user need justifies their main-thread work and altered browser behavior. Native scrolling preserves platform controls and makes sticky positioning, history, anchors, and reduced-motion preferences easier to reason about.

## Affordances, keyboard access, and motion

Make clickability obvious and truthful. A card containing only explanatory text should not be exposed or styled as a link. If the whole card is a link, make its name and destination clear and keep nested controls semantically valid. When only a title or CTA is linked, style that link as the action. Feedback can range from a small link cue to a larger surface change; choose based on clarity, contrast, user preference, and surrounding design. Large color changes can distract or reduce contrast, so verify the resulting state.

Every interactive control needs visible keyboard focus with sufficient contrast and separation from nearby content. Hover and focus can share a small cue, but focus must not depend on hover. Maintain logical tab order, meaningful names, and adequate target size. Do not remove outlines without a clear replacement. For modal interfaces, test open, navigate, close with Escape, close with the button, and focus restoration.

Motion is an optional way to clarify an interaction or explain a relationship. If used, ensure it does not delay access to content, obscure text, imply a control where none exists, or take control away from normal scrolling. Profile complex cases; transform and opacity are often suitable properties but do not guarantee low cost. Respect prefers-reduced-motion: reduce by removing non-essential movement or providing a substantially reduced state. Essential content must remain present and readable when animation does not run.

## Motion and scroll-linked effects

Choose the smallest motion tool that explains the interaction. A CSS transition is enough for a button state; a CSS keyframe is appropriate for a short decorative entrance; a scroll-driven timeline can tie a non-essential illustration to reading progress; a JavaScript animation library such as GSAP is justified when the experience needs coordinated timelines, pinning, scrubbing, or complex sequencing. Do not add a timeline library for a few opacity or transform effects. Tool choice does not determine performance: the animated property, number of layers, main-thread work, and device all matter.

Keep a static, complete version as the baseline. Text, navigation, choices, diagrams, and actions must remain visible and ordered if JavaScript fails, the library chunk has not loaded, the browser lacks scroll-timeline support, or the visitor requests reduced motion. Animation may enrich content, not unlock it. Do not set copy to opacity zero until an observer or animation initializes; a delayed import, blocked script, or intersection callback can otherwise leave the page blank. Treat IntersectionObserver as a way to defer optional work, not a readiness dependency for essential content.

For CSS view timelines, scope animation to substantial non-essential blocks and gate it by both feature support and a deliberate viewport/orientation range. Keep a fallback with no animation. Animate opacity and transform when suitable; avoid moving large sections in ways that change reading order or cover sticky controls. Consider that scroll-linked effects can feel abrupt when the user scrolls quickly, resizes, rotates, uses keyboard scrolling, or navigates to an anchor. Verify each case. Respect prefers-reduced-motion by removing scroll-linked movement and non-essential transitions.

For GSAP or another imperative runtime, import it only for the route or component that needs it. Initialize only after the target DOM exists and the relevant viewport and motion preferences permit it. Scope selectors to the component root so duplicate instances or unrelated page sections cannot be captured. On cleanup, revert the animation context, remove listeners and observers, kill timelines and ScrollTriggers, and clear styles the animation wrote. Reinitialize carefully after resize or orientation change; avoid duplicate triggers during client navigation or development remounts. Do not pin content on narrow or short viewports without strong evidence that it remains usable. Pinning can trap focus, obscure following sections, distort browser scroll restoration, and create long blank regions on touch devices.

Sticky positioning is a layout behavior, not a substitute for a scroll animation. Use it for a relevant control or index that helps the visitor orient within the section. Compute its top offset from the actual fixed header and breadcrumb stack. Constrain tall sticky content to the available viewport and allow it to scroll internally; otherwise it can become inaccessible on short screens or at zoom. Disable or simplify sticky behavior where it collides with the mobile header, keyboard focus, or section boundaries. If a sticky footer animation pauses on hover, limit hover-specific pause behavior to fine pointers and preserve equivalent keyboard access.

If a footer word or identity animation is chosen, reserve enough width for the longest changing word so the line does not jump. Provide a readable text equivalent, hide duplicated fragments from assistive technology where appropriate, and stop or simplify motion for reduced motion. A static label, rotating word, or marquee are visual options; evaluate readability, motion, and layout stability for the audience.

## Visual QA workflow

Review representative widths and heights, both themes if available, and reduced motion. Inspect the first viewport and full page. Check source order, heading wrap, CTA visibility, target fit, horizontal overflow, clipping, sticky overlap, local scroll containers, keyboard focus, dialog behavior, loading/error/empty states, and long words or labels. Also test 200% text zoom and a 320 CSS-pixel reflow case.

Automated screenshots can locate visual differences, but do not treat them as proof of usability or accessibility compliance. Inspect a keyboard path and the interaction itself. Prefer a few reusable layout assertions—document width does not exceed viewport; key controls remain visible and reachable—plus human review over brittle tests for class names, exact pixel positions, or one theme. A screenshot taken mid-theme transition is not a settled-state reference.

## Separate requirements from design choices

Correctness and accessibility requirements apply regardless of style: semantic content and controls remain available; keyboard focus is visible; color and type stay readable; required content does not clip at narrow widths or zoom; interactions work without hover; and non-essential motion responds to reduced-motion settings.

Conditional techniques such as full-card interaction states, sticky content, scroll effects, or fixed-width decorative typography can help in one layout and hinder another. Evaluate their effect on the actual content, input mode, viewport, and zoom. Palette, type face, corner style, card layout, and animation character remain optional visual choices.

## References

- [WAI-ARIA Authoring Practices: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.2: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 2.2: Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [MDN: CSS media features for hover and pointer](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)

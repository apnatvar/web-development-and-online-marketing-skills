# Images, Fonts, and Media

[Back to index](../index.md)

## Images

Use the framework image component when compatible. Provide intrinsic dimensions or a constrained `fill` container and an accurate responsive `sizes` expression. A wrong `sizes` can cause the browser to download an unnecessarily large candidate.

Preload/priority only the likely LCP image. Do not mark every first card or carousel slide high priority. Lazy-load below-fold images, use appropriate quality, and preserve meaningful alt text. Decorative images should have empty alt and should not duplicate prose.

Remote images require configured origins and operational trust. Query strings may need correct XML escaping when reused in sitemaps. Keep owned brand/product assets stable; editorial photography should add meaning rather than repeated decoration.

## Fonts

Use `next/font` or an equivalent self-hosted strategy to avoid runtime stylesheet insertion. Limit families, subsets, styles, and weights to those actually used. Verify fallback metrics and CLS. Remote font acquisition during builds can reduce build reliability; local font files are appropriate when reproducible offline builds matter.

## Video and rich media

Use a poster, `playsInline`, and an intentional preload policy. Decorative video should be hidden from assistive technology and must not block content. Defer the source or behavior until near the viewport when possible. Respect reduced motion, data constraints, autoplay rules, and failure states.

Use click-to-load facades for Vimeo/YouTube and other third-party embeds when immediate playback is not essential. Defer `<model-viewer>`, Three.js, WebGL, maps, and similar runtimes until the user approaches or requests the experience; provide a static poster, dimensions, accessible description/action, device capability fallback, and cleanup. Do not ship a 3D engine globally for one route.

Validate LCP discovery, decoded size, transfer size, layout stability, and behavior at real breakpoints.

Related: [Performance](performance.md), [Bundles](bundles.md), [Animations](animations.md), and [Accessibility](accessibility.md).

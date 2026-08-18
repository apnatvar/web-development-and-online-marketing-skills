# Bundle Discipline

[Back to index](../index.md)

## Inspect before removing

Use the repository's bundle analyzer in a production build and inspect route chunks. Package size, install size, server dependency size, and browser transfer are different measurements. Confirm that a dependency reaches the client before optimizing it.

## Practices

- Delete unused components and dependencies.
- Import library subpaths or specific primitives when a barrel pulls unrelated code.
- Keep large data and server-only utilities outside client import graphs.
- Dynamically import expensive interactions, editors, charts, animation engines, or route-specific datasets.
- Avoid global client wrappers for convenience.
- Prefer a small existing icon system over multiple overlapping libraries.
- Add restricted-import lint rules only for known recurring regressions and include an actionable alternative.

Dynamic import is not automatically a win. A tiny above-fold component can become slower when split; measure network waterfalls and interaction timing. Do not split meaningful text out of initial HTML merely to lower a JavaScript number.

## Dependency decisions

Before adding a package, check whether the platform, CSS, or an existing dependency already provides the capability. Before replacing a package, assess accessibility, maintenance, browser support, and migration cost—not only bytes.

After changes, run the production build and focused interaction tests. Confirm that server-only secrets/modules did not cross a client boundary.

Related: [Performance](performance.md), [Rendering](rendering.md), [Prefetching](prefetching.md), and [Animations](animations.md).

# Rendering Strategy

[Back to index](../index.md)

## Decide from data requirements

- Static/prerendered: public content whose result does not depend on the request.
- Revalidated: public content that changes on a known cadence or publishing event.
- Dynamic: authentication, request headers/cookies, per-user state, or data that must be current on every request.
- Client fetched: live interaction after a meaningful server-rendered shell; not a default substitute for server rendering.

Read the installed Next.js documentation because caching and dynamic API behavior vary by version. Inspect build output to verify the result rather than inferring it from syntax.

## Server and Client Components

Server Components reduce browser JavaScript and can access server-only data, but their imported modules still affect server/build work. Client Components create a serialization and hydration boundary; keep props compact and serializable.

Use `Suspense` around independently slow or deferred regions. Provide a stable, accessible fallback with sensible intrinsic dimensions. Do not wrap an entire page in a loading boundary when only one widget waits.

## Route handlers

Mark stable public text/data handlers static and cacheable when the installed version supports it. Keep authenticated, request-sensitive, or mutation handlers dynamic. Return explicit content types and appropriate cache headers. Machine-readable endpoints need the same privacy and canonical discipline as pages.

## Failure modes

- Reading cookies, headers, request-bound search params, or other dynamic APIs high in the tree can force unnecessary request-time rendering.
- Uncached fetches and request-time computation can prevent otherwise stable routes from being prerendered.
- Fetching public page content only after hydration hides it from users and crawlers longer.
- A global provider can turn every route into a client subtree.
- Static output can become stale if publishing has no revalidation/redeploy path.

Validate the chosen tradeoff with build diagnostics, rendered HTML, and runtime behavior.

Related: [Page architecture](page-architecture.md), [Performance](performance.md), [Bundles](bundles.md), and [Validation](validation.md).

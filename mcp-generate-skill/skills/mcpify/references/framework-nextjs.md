# Next.js guidance

Read this only for Next.js repositories. Detect the installed version and actual router before assuming conventions.

## Discovery map

- App Router HTTP: `app/**/route.{ts,js}` or `src/app/**/route.{ts,js}`
- Pages Router HTTP: `pages/api/**` or `src/pages/api/**`
- Server Functions/Actions: files or functions with `use server`
- Middleware/proxy: `middleware.*`, `proxy.*`, auth library middleware, and framework config
- Domain/data access: `services`, `domain`, `use-cases`, `repositories`, `dal`, `lib`, or feature-local server modules
- Auth: Auth.js/NextAuth, Clerk, Supabase, custom sessions/JWT, or middleware plus DAL checks

## Security interpretation

Treat Route Handlers and Server Actions as public-facing entrypoints. UI visibility, layouts, middleware redirects, and action obscurity are not sufficient authorization. Trace secure checks at the action, data-access, or service boundary, including resource ownership and tenant membership.

Prefer a server-only service/DAL beneath both the web UI and MCP wrapper. Avoid importing client components, React-only modules, request-bound route wrappers, or browser session assumptions into the MCP server.

Watch for:

- authorization implemented only in page rendering or middleware;
- request context read implicitly from cookies/headers when MCP needs an explicit identity adapter;
- Server Actions that combine parsing, authorization, business logic, revalidation, and redirects;
- serialization of ORM objects or React/server-only values;
- cache/revalidation behavior that may hide mutation side effects;
- route body limits mistaken for MCP transport limits;
- Edge runtime modules incompatible with Node SDK packages, or the reverse.

Current official Next.js guidance recommends centralizing secure authorization in a data access layer and using DTOs to return only necessary data. Preserve an established alternative when it provides equivalent guarantees.


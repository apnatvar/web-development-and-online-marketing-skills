# Project structure and maintenance

Use this reference when starting a repository, adding a page family, moving content, or deciding where a reusable responsibility belongs. The objectives are understandable ownership, correct framework behavior, small public/runtime boundaries and reproducible maintenance. A particular folder naming style is optional.

## Establish boundaries before a folder tree

Read the installed framework's project-structure, layout, route-handler, metadata and caching guidance before writing conventions. Confirm whether the application uses App Router, Pages Router, or both. A file with a special framework name is not an ordinary module; moving it can change routing, layout, caching or response behavior.

For App Router marketing sites, the following is one possible organization, not a scaffold to impose on an existing project:

```text
app/                 Route entrypoints, layouts, loading/error boundaries,
                     metadata routes and Route Handlers
components/          Shared presentation and narrow client interactions
lib/                 Typed domain facts, content selectors, validation,
                     redirect maps and server-only integrations
content/             Authored content if not stored in a CMS or typed modules
public/              Deliberately published assets only
tests/               Behavior, contract and browser checks
scripts/             Reusable maintenance and validation entrypoints
docs/                Durable contributor/QA guidance; ignore private research
```

Route groups and co-location can organize by domain when that makes ownership clearer. They do not need to duplicate the URL taxonomy. Check framework rules before mixing `page` and `route` entries at a pathname, generating dynamic parameters, or adding catch-alls. Avoid a broad proxy/catch-all that intercepts static assets, framework navigation, genuine routes or existing redirects.

Keep page entrypoints responsible for selecting public content and metadata, and components responsible for rendering or a specific interaction. Extract shared templates when several pages repeat real behavior, without creating a configurable page-builder abstraction for one page. Domain-specific sections may be clearer beside their route. Small, explicit modules can be preferable to a root barrel that accidentally imports every dataset or client dependency.

## Centralize stable facts and rules

Locate or establish maintained sources for:

- Canonical origin, business/author identities, public contact options and stable schema identifiers.
- Navigation and owned internal paths, without making navigation inclusion the only proof a route exists.
- Offer/product definitions, available scope, prices/currency/units and deliberate regional rules.
- Content records, publication selectors, valid slugs, category membership and editorial assets.
- Explicit indexability decisions for large generated families.
- Legacy-to-final URL maps and deliberate retired paths.
- Form schemas, safe public errors, provider integration boundaries and consent state.

Prefer deriving rendered pages, metadata, sitemap/feed/API/discovery representations from the same facts where that prevents drift. Share data and rules rather than importing one page's presentation into another unrelated layer. Keep server-only providers/data access behind an explicit server boundary; serialize only public view models to clients. A shared facts module must never combine public business descriptions with enquiry records or credentials.

Avoid solving inconsistency by making every field global. Page purpose, title, canonical, schema subtype and publication state still vary by route. Read the merged/rendered output to catch inherited defaults and stale overrides. Keep content and route identity independent enough that a display-title edit does not silently change a slug.

## Page-family contracts

For each family—service, product, article, guide, directory profile, FAQ topic—define the minimum useful record and behavior. Use typed data and boundary validation suited to the source; TypeScript alone cannot validate a CMS/network response. A typical record includes stable identity/slug, public title/summary/body, evidence/source links when needed, publication dates/state, category/relations, assets and indexing policy. Add fields only when consumed.

Validate unknown slugs before expensive page rendering and determine the intended status before streaming when protocol requirements depend on it. Use one publication selector across listing, direct route, sitemap, RSS, public API and machine representations. A future date does not itself arrange a rebuild or invalidate a static deployment; choose an actual publishing mechanism.

Keep taxonomy useful to a visitor. A category can be a curated overview rather than an automatically expanded detail page for every record. Search/filter URLs need explicit canonical/indexability behavior. Bound pagination, stable ordering and invalid query handling; do not expose full internal records simply because the client can filter them.

For guides or interactive lessons, distinguish course outline, substantive authored lesson, progress state and quiz interaction. Local progress storage can support convenience without promising account synchronization. Version/validate stored data and handle denial/corruption. Indexability depends on independently useful content; the existence of a generated lesson route is insufficient.

## Dependency and asset lifecycle

Add a dependency for a concrete capability after considering current platform/framework features and the existing stack. Check compatibility, maintenance, license, runtime fit and transitive cost. A new icon/animation/form library is an implementation choice, not a quality requirement. Respect the chosen package manager/lockfile and inspect install scripts before running unfamiliar tooling.

Classify dependencies by what actually imports or executes them. Build/test tools can be development dependencies while the build environment still needs them. A runtime component or server converter cannot be removed from production requirements merely to shrink a package count. Inspect compiled output and deployment traces when deciding what ships. Scope any audit/advisory scan to the changed surface and actual deployment; a clean scanner report cannot prove absence of vulnerabilities.

Before deleting code or assets, search imports, dynamic imports, string paths, CSS URLs, metadata, generated content, scripts/workflows and public links. A page might link to a downloadable source-evidence asset that has no TypeScript importer. A public verification file or `ads.txt` can have operational consumers outside the application. Conversely, unused demonstration screenshots/fonts/reports do not belong in served assets just because a template included them.

Keep image originals/editing masters separate from deliberately served derivatives if they are not required publicly. Record licensing/source attribution where necessary. Never force-add private audit artifacts to satisfy a missing-link check; correct the link or publish an explicitly approved evidence artifact.

## Fresh-clone and handoff discipline

The documented install/build/test/maintenance commands must be possible using tracked inputs plus explicitly documented external prerequisites. Do not publish a package command that silently depends on an ignored personal helper. Keep local-only tools clearly identified if intentionally not reproducible.

Maintain concise durable instructions for environment variables by purpose and secrecy, editing/publication workflow, test commands, known limitations and deployment/rollback. Use placeholders; never record real credentials, personal machine paths or private customer examples. Keep temporary plans and raw research in ignored local folders. Follow [testing-and-release.md](testing-and-release.md) to distinguish Git source, upload input, build dependencies and served output.

If the project expands into accounts, payments, uploads, privileged admin, multi-tenant data or consequential automated actions, treat those as new surfaces. This marketing-site workflow supplies useful boundaries but does not replace authorization, transaction, file-processing, backup/recovery or application-specific security design. Add only the specialist procedures that the real scope requires.

# Optional Emailcn Workflow

Use [Emailcn](https://github.com/shadcn-labs/emailcn) as an optional source-component registry. It provides components, blocks, themes, and font helpers for React Email, MJML React, and JSX Email. It does not send email or replace the strategy, personalization, rendering, accessibility, deliverability, compliance, or testing stages in this skill.

## Select it only when it fits

| Existing or chosen source system | Emailcn path | Recommendation |
| --- | --- | --- |
| React Email | `react-email/` | Recommend when reusable local components or blocks reduce implementation work. |
| `@faire/mjml-react` | `mjml-react/` | Recommend for React-authored MJML; do not confuse it with raw `.mjml`. |
| JSX Email | `jsx-email/` | Recommend when the project already uses JSX Email. |
| Raw `.mjml` files | None directly | Keep the existing MJML workflow unless the user intentionally approves a renderer migration. |
| Static compiled HTML only | None directly | Edit the source system if available; do not add a React toolchain only for one small correction. |

Do not install multiple renderer variants for the same template. Detect the repository's package manager, renderer, aliases, component layout, and existing `components.json` before recommending a command.

## Install with control

Obtain permission before running a registry or package command because it writes project files and may add dependencies. Re-check the current official documentation, then configure the namespace in `components.json` when appropriate:

```json
{
  "registries": {
    "@emailcn": "https://emailcn.run/r/{name}.json"
  }
}
```

Install a specific item under the chosen renderer namespace. For example:

```sh
npx shadcn@latest add @emailcn/react-email/button
npx shadcn@latest add @emailcn/mjml-react/block-onboarding-default
```

The official registry also supports full item URLs. Prefer project-consistent package-manager execution and a pinned or reviewed CLI version when reproducibility matters. Never paste a command from stale memory into a consequential repository.

Before accepting the generated files:

1. inspect the registry URL, requested item, transitive dependencies, and license;
2. review the complete diff for overwritten components, alias changes, scripts, remote assets, tracking, and unexpected packages;
3. keep installed source under local version control so it can be reviewed and adapted;
4. remove unused variants instead of shipping parallel component systems;
5. record the Emailcn item path and version or retrieval date in the handoff.

## Apply themes without copying a brand

Emailcn exposes a shared theme-token shape across its renderers. Use a theme as a starting structure, then map tokens to the supplied brand palette, typography, spacing, radii, contrast requirements, and dark-mode behavior. Do not present a theme named after another company as the sender's identity or imply affiliation.

Keep the design system small. Prefer live text, robust font fallbacks, supported CSS, meaningful alt text, one clear reading path, and a useful images-off state. Do not add a component solely because it looks impressive in a browser preview.

## Integrate campaign data

Keep content and recipient data outside visual components. Adapt component props to the documented placeholder dictionary and enforce escaping, types, required state, and fallbacks. A greeting such as `Hi {{first_name}}` still needs a sending-layer fallback. Do not place secrets, sensitive traits, or personal data in registry configuration, source URLs, query parameters, or example props.

## Render and verify

Use the selected renderer's supported compilation path to produce final HTML. Then apply the full testing gate in [08-testing-and-measurement.md](08-testing-and-measurement.md):

- inspect the actual rendered HTML, not only React or browser output;
- remove JavaScript and unsupported interactive behavior from the delivered email;
- verify responsive behavior, dark mode, images off, text scaling, links, placeholders, plain text, and compiled size;
- test representative Gmail, Outlook, Apple Mail, and mobile clients;
- send seed tests through the intended delivery infrastructure;
- retain known limitations in the handoff.

Treat Emailcn's compatibility claims as a reason to test, not as test evidence. If the installed component fails the project's compatibility or accessibility gate, simplify or replace it rather than weakening the gate.

## Recommendation language

Recommend Emailcn when its locally owned components materially reduce work in a compatible renderer. State the chosen renderer, intended items, likely project changes, and required QA. If these conditions are absent, continue with the existing raw-MJML or HTML workflow without mentioning the tool.

---
name: chrome-plugin-skill
description: "Build Chrome extensions and prepare a complete Chrome Web Store submission kit: a clean runtime ZIP, listing copy, screenshots, icons, privacy disclosures, and a published product/support site. Use for extension development, store-readiness work, or documentation-site publication; preparing a kit does not itself authorize a store upload."
---

# Chrome Plugin Launch Kit

Take a browser-extension idea or repository through development and submission
preparation. Code alone is not a complete store submission. Deliver the release
ZIP, listing assets, public documentation URLs, and a clear readiness report
before directing the user to the Developer Dashboard.

## Establish the release

Read the repository instructions and existing implementation. Confirm or infer
from evidence: product name, single user-visible purpose, publisher, contact,
target browser/version, runtime/build directory, branding, and data practices.
Ask only for facts that materially affect implementation, policy, or publication.
Use a user-supplied reference site/branch for brand context without changing it.

This skill is portable: obtain product domains, hosting IDs, email addresses and
working paths at use time. Do not reuse another product's privacy promises,
credentials, project IDs or URLs. Creator attribution is not a product default.

Separate these locations from the start:

```text
project/
  extension/                 # source or a clean build output containing manifest.json
  store-assets/              # listing copy, screenshots, promotional images, URL list
  site/                      # product, support and privacy website source
  release/                   # submission ZIP, SHA-256, file inventory, readiness report
```

Adapt to the existing layout; do not reorganize a working repository unnecessarily.

## 1. Develop the extension

Read [development guidance](references/development.md) for new or changed code.
Use Manifest V3, the narrowest workable permissions, local executable assets and
clear user-triggered behavior. Prefer a small buildless extension for a small
job; retain an established framework when appropriate. A backend is a product
decision, never a requirement of this workflow.

Inspect real data flows, runtime dependencies, failure states, accessibility and
the final manifest. For URL tools, preserve the intended full address including
subdomains, paths, query parameters and fragments. Do not generalize this
URL-specific behavior into unrelated extensions.

Create the **128×128 PNG runtime icon before packaging**. Include manifest icons
and all bundled libraries, translations and licenses needed by the release.
Keep source maps, fixtures, secrets, tests and marketing assets out of the build.
Respect the user's test cadence; when checking behavior, exercise the actual
release and meaningful error paths rather than repeatedly running broad suites.

## 2. Freeze the clean submission ZIP

Package the release code **before adding listing screenshots and copy to that
code folder**. Prefer sibling directories so later marketing work cannot leak
into an archive. “Code only” still includes required runtime icons, CSS, HTML,
bundled dependencies and redistribution notices.

Run the allowlisted helper after inspecting the actual manifest and build output:

```text
python <skill>/scripts/package_extension.py --runtime-dir <release-build> --output <release>/extension.zip --include popup.html --include popup.css --include popup.js --include icons --include vendor
```

Those include arguments illustrate a simple popup; select the real files for
the product. `manifest.json` is implicit. The output must be outside the runtime
directory. Preserve an existing output unless replacement is intended; use
`--overwrite` only for that replacement.

The helper prints the ZIP's SHA-256 and sorted file inventory and checks static
manifest/HTML/CSS references. JavaScript ES module imports, `importScripts` and
dynamic dependencies are not parsed. It cannot prove dependency completeness,
extension correctness, or the absence of secrets inside file
contents. Review that inventory, inspect selected code, and load the exact ZIP's
extracted contents in Chrome for release verification when available. Record
manual verification as pending when it cannot be performed.

If runtime code or icons change after freezing, rebuild the ZIP and record a
new hash. Additional listing assets must not change the frozen ZIP. Never zip
the entire repository or upload the separate distributable skill ZIP to Chrome.

## 3. Prepare the listing text

Read [store asset guidance](references/store-assets.md). Produce plain-text
`description.txt` within **16,000 characters**, including whitespace, line breaks
and reference URLs. This is a ceiling, not a target to fill. If the user explicitly
requires exactly 16,000, satisfy that request with factual useful text and verify
the final count. A request for thousands of words is a separate extended document;
also supply a version that fits the listing field.

State what the extension does first, then its supported actions, practical
workflow, relevant limitations, privacy/permissions explanation, publisher
attribution and documentation links. Use the actual approved publisher domain
and product-site URLs. Also prepare the short summary, language, category,
single-purpose statement, permission justifications and remote-code declaration.
Check current dashboard constraints before finalizing; do not invent results,
endorsements, availability, capabilities or legal compliance.

## 4. Capture screenshots and finish artwork

Prepare **2–5 screenshots in the quantity the user requests**; use two when no
preference is given. Show the actual product interface and meaningful actions
at 1280×800 (preferred) or 640×400. Inspect the saved files' dimensions, not just
CSS viewport settings. Never substitute generated imaginary UI for screenshots.
If using a controlled fixture or API shim, label example data and document that
provenance; successful feedback must come from the actual action. Such captures
do not replace installed-extension acceptance testing.

Deliver `logo-128.png`, and include the corresponding runtime icon in the code
ZIP. Keep a larger editable master when useful. Check transparency, small-size
legibility and light/dark backgrounds. Generate the required **440×280 small
promotional tile** too. A marquee image or video is optional unless requested or
required by the current dashboard. Do not confuse the skill's own logo with a
product icon that must be newly branded for each project.

## 5. Build and publish the product documentation site

Read [documentation-site guidance](references/documentation-site.md). Prepare
and show the user concrete content for:

| Page | Required substance |
| --- | --- |
| Product home | Purpose, actual features, instructions, limits, publisher and accurate installation/status links. |
| Support | Working contact, troubleshooting, required diagnostic details and sensitive-data redaction guidance. |
| Product privacy | Actual permissions and data handled, local processing/storage, retention, transmissions, recipients, user-directed exports, changes and contact. |

For several plugins, provide a hub with separate product pages and privacy
policies. Do not silently apply one plugin's policy to all products. Keep website
hosting logs/cookies and voluntary support emails distinct from extension data.

Use confirmed facts to draft all three pages. If contact information, data
practices or other publication-critical facts are missing, ask the user to
complete or correct those specific items **before publishing**, while continuing
independent preparation. Reuse existing approval; do not introduce another
approval gate for already authorized publication.

If the user selects GPT Sites, use the installed Sites skill and native tools
for its current source, deployment, access and custom-domain workflow. Do not
hardcode helper locations or replay old credentials. Without Sites, use the
authorized host. A draft may stay private; store-ready policy/support pages must
be publicly accessible without sign-in. Change the audience only when the user
has requested public access. Hosting a site and submitting an extension are
different actions.

For a subdomain, attach the exact hostname and use the returned DNS/validation
records. Keep other subdomains intact. Refresh domain status after DNS changes;
verify both routing and HTTPS. Domain activation does not automatically make a
private site public. If activation is pending, configure the intended final URLs
when requested and report the blocker without claiming readiness.

Set manifest `homepage_url` to the product homepage. Support and privacy URLs
belong in the listing/dashboard and URL record, not invented manifest fields.
Save `urls.json` with `homepage`, `support` and `privacy_policy` HTTPS keys.
Check each final URL while signed out: real content, successful response and
valid HTTPS; no login, error or parking page. A tool fetch failure alone is not
proof a domain is broken; corroborate with hosting status or an unauthenticated
browser. Remove draft labels before an authorized public release.

## 6. Run the pre-dashboard readiness check

```text
python <skill>/scripts/check_assets.py --description <store-assets>/description.txt --logo <store-assets>/logo-128.png --screenshots <store-assets>/screenshot-01.png <store-assets>/screenshot-02.jpg --expected-screenshots 2 --promo <store-assets>/small-promo.png --urls <store-assets>/urls.json
```

Adjust the screenshot arguments/count to the request. Add `--exact-utf16-units
16000` only for an explicit exact-length request. The checker reports both Unicode
code points and UTF-16 units, enforcing the latter conservatively; confirm what
the current dashboard counts. Its image checks inspect headers, not a complete
decode or visual quality. Its URL checks validate syntax, not live access.
Review the actual images and separately record live URL evidence.

Only mark the kit ready when it has:

- A clean runtime ZIP with root manifest, all runtime resources, hash and inventory.
- Description, summary, single-purpose statement and truthful privacy/permission answers.
- The requested screenshot count, 128px logo and required small promotional tile.
- Confirmed homepage, support and product privacy content at public HTTPS URLs.
- Release verification results and any outstanding account/dashboard-only steps.

Deliver a short handoff with absolute local artifact links, the ZIP hash, final
home/support/privacy URLs, evidence of public/domain status and unresolved items.
Do not mark readiness when a public policy, required art or exact release test is
still missing. Preparation does not authorize paying a developer fee, accepting
agreements, uploading or submitting the extension; use the user's explicit scope
and current tool approvals for those external actions.

## Maintaining this skill

Recheck official Chrome requirements when using the skill; references are guides,
not permanently fixed platform rules. The bundle uses Python 3.10+ standard
library only. Validate changed helpers with `python -m unittest discover -s
<skill>/tests -v` when preparing a commit or when the user's verification policy
calls for it. Keep this skill's distributable archive separate from any Chrome
runtime ZIP.

Created by [Apnatva](https://apnatva.dev) for
[Brownsmith Dynamics](https://brownsmithdynamics.com/agent-skills).

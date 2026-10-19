# Extension development

## Build and release shape

- Start with a small Manifest V3 extension that does the stated user-visible job. Prefer plain HTML, CSS, and JavaScript unless the project already uses a framework or the requirements justify one.
- Do not add a backend, account system, analytics, or data collection unless the user asks for it and its purpose is clear.
- Request the narrowest permissions that implement the current feature. Use `activeTab` when access is needed only after a user invokes the extension; add `scripting` only if code must run in the page. Do not add broad host access or permissions for imagined future features.
- Keep executable code in the extension package. Follow Chrome’s current Content Security Policy and remote-hosted-code rules; do not use `eval` or load executable scripts remotely.
- Include the 128×128 PNG extension icon in the package and point the manifest at the real generated file. Check build output paths when using a framework: Chrome must load the packaged output, not source files that are absent from the release ZIP.

## User-facing behavior

- Make the popup usable with keyboard and assistive technology: labels, visible focus, readable contrast, and clear status and error messages.
- Handle expected browser failures, including unsupported or restricted pages, a missing active tab, denied permissions, and unavailable clipboard access. Explain what the user can do next; never claim success when an API failed.
- Invoke clipboard writes only from a user gesture where the browser requires one, and report success or failure.
- For URL tools, preserve and validate the exact URL components required by the feature, including path, subdomain, query, and fragment when relevant. Avoid lossy parsing or normalization that changes the destination.
- Use examples or fixture data only when clearly identified as examples. Do not present a mock response as a completed real action.

## Release decisions

- Keep user-requested tests or verification preferences. Otherwise, choose checks that exercise meaningful behavior and match the requested scope.
- Do not commit, submit to the Chrome Web Store, or change a listing’s public visibility unless the user explicitly requests that action.

## Primary Chrome references

- [Manifest V3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Permission minimum requirements](https://developer.chrome.com/docs/webstore/program-policies/policies#permissions)
- [`activeTab` permission](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab)
- [Extension Content Security Policy](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy)
- [Remote hosted code](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)
- [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies)

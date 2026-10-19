# Product and support site

## Choose the smallest useful site

- Default to a buildless static site. Add a framework or backend only when a required feature needs it.
- Confirm the product name, publisher, support contact, and factual product behavior from project materials or the user. Do not invent these details.
- Explain the product’s purpose, key features, limitations, and how to install it. Keep installation status accurate; do not imply that a draft or unpublished extension is available in the Store.
- Include a support route with troubleshooting guidance. Tell users how to redact sensitive information before sending diagnostic details.

## Privacy information

- Describe the extension’s actual data practices: what it reads or collects, whether processing stays on-device, what is stored and for how long, what is transmitted, who receives it, and any export, clipboard, or sharing behavior.
- Include relevant operational data such as developer-server logs when known, and distinguish those logs from data the extension intentionally sends. Ask for missing facts that materially affect the disclosure; do not guess.
- Keep the site, extension behavior, Store privacy fields, and any privacy policy consistent. Local processing or storage can still involve user data and should be disclosed where applicable.
- Link to the current Chrome Web Store user-data and limited-use policies. Do not claim legal compliance or invent a policy statement; current requirements can change.

## Sites hosting and publication

- If the user chooses Sites, follow the installed Sites skill and its current helpers and outputs. Do not copy fixed IDs, script versions, or assumptions from an old run.
- Reuse the existing hosting project and listing links when present. Preserve the intended audience; default to private unless the user explicitly asks for a public site.
- Treat a custom-domain connection and public audience as separate settings. Use the exact CNAME/TXT values returned by the hosting provider. Do not assume a DNS provider or invent records.
- Before calling a site live, confirm the domain’s SSL is active and its page loads unauthenticated over HTTPS with a successful response, rather than a login page, 404, or parking page. `noindex` discourages search indexing; it does not restrict access.
- Before a requested public release, remove draft or editorial labels and check the visible page. Keep publishing actions within the user’s explicit request.

## Primary references

- [Chrome Web Store user data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Chrome Web Store Limited Use policy](https://developer.chrome.com/docs/webstore/program-policies/limited-use)
- [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program-policies)

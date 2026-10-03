# building

Adapt this stage to the owner's app. The request tracker is a fictional teaching example.

## Open a workspace and get the first preview running

Bring the request-tracker brief from the MVP guide. A browser-based builder is a reasonable first workspace when it includes a preview, source export, and a clear deployment path. A local coding agent needs a project folder, an editor or app, and the runtime required by that project. Ask it to inspect what is installed before suggesting downloads.

A terminal is a place to run text commands; a runtime runs the application; a dependency is code the project uses. Ask the agent to list the exact startup command, the folder in which to run it, what success looks like, and how to stop it. Follow the project's own instructions instead of assuming every app uses the same command. A local preview address such as localhost is visible on your machine; it is not yet your public website.

Before changing an existing project, save a recoverable snapshot. For a new project, ask for the smallest implementation that meets the brief and runs in the chosen environment. Let the agent explain whether it is creating a static browser app or an app with server-side work, since that changes deployment and data handling.

Example request to adapt:

Use my approved brief. First inspect the workspace and explain the minimum setup. Then make the smallest working request tracker with fictional records, a usable empty state, and no live integrations. Tell me exactly how to open the preview. Do not add a database, paid API, accounts, or deployment unless we have agreed that scope.

## Build one behavior, inspect it, then continue

Describe defects through actions and expected results: I changed request A to Done, but request B changed too. Include a screenshot and relevant error text after removing private information. Ask the agent to investigate one reproducible problem and rerun its checks; repeatedly asking it to fix everything gives you little evidence about what changed.

1. Create the list and add-request form. Try an empty title and a valid title yourself.
2. Add edit and status-change behavior. Check that editing one record leaves another record untouched.
3. Add deletion with confirmation. Test both cancel and confirm.
4. Agree the storage behavior, then add it. Reload the browser and confirm what should survive. Keep an export you can open independently.
5. Check phone width, keyboard navigation, visible focus, labels, loading/error states, and the empty list.
6. Save a named working snapshot before adding another feature. Keep a note of what changed and how you checked it.

Example request to adapt:

Reproduce this problem before changing code. Explain the likely cause in plain language. Make the smallest fix, check the affected workflow and a neighboring one, then show the result and any remaining uncertainty. Preserve unrelated work and the last working version.

## Decide when the app needs a server and real permissions

A browser-only tracker is useful for learning. Its storage can be cleared, and a second browser or device has a different copy. Publishing that interface does not create shared records. If two people must see the same requests, the next version needs an agreed shared data service and access rules.

For that next version, ask for a data diagram in ordinary language: what is stored, where it is stored, who may read or change it, and how a record is removed or recovered. A login screen identifies a user; permission checks decide what that user can do. Hiding a button is not an access rule. The server or managed database must enforce ownership for direct requests too.

Keep practice and production environments separate. Use fictional test accounts and records. Have the agent explain environment variables: named settings supplied by the runtime or hosting platform. Some settings are public; secrets must stay in the server's protected environment. Ask for independent review before collecting sensitive records, taking payments, or relying on unreviewed code for consequential business actions.

## Keep enough evidence to recover and hand over

- An owner-controlled source repository and a named last working version.
- A short explanation of screens, data location, and any services the app needs.
- Instructions to start the preview, run checks, build the app, and stop it.
- A record of known limits, test failures, configuration names, and costs without secret values.
- A change summary you can read before approving another release.


# deployment

Adapt this stage to the owner's app. The request tracker is a fictional teaching example.

## Put the tested app online one step at a time

For the request-tracker practice app, use a managed platform that supports the project's actual output. A static browser app can often be deployed as built files; an app with server functions needs compatible server hosting. Ask the agent to identify which you have before choosing a provider. Shared PHP hosting is not automatically suitable for a Node.js application.

Use the provider's temporary HTTPS address first. A domain is your chosen website name; DNS directs that name to the host; HTTPS protects the connection. You can add a custom domain after the temporary address works. Keep the domain and hosting accounts under your control.

1. Save the tested source version and ask for the exact build command, output folder, runtime needs, and deployment instructions for this project.
2. Create or select your own hosting project. Review current pricing, usage limits, and billing controls before confirming it.
3. Connect the repository or upload the build output using the provider's supported method. Check that the uploaded folder is the build output, not an arbitrary source folder.
4. Supply the required configuration through the host's settings. Keep secrets out of browser-delivered variables. Use separate test and production values.
5. Deploy to the temporary URL, read the build/deployment log, and open it in a separate browser session.
6. Repeat add/edit/delete/export, reload, phone-width and any account-boundary checks. Verify that the real service data source is the intended one.
7. If a custom domain is needed, follow the host's exact DNS instructions, verify HTTPS, and retest routes directly and after reload.

## Use the log to fix deployment errors

A build failure means the host could not prepare the app; a runtime failure happens after it starts. Copy the relevant error message after removing secrets and ask the agent to compare the local and hosting environments. Common differences include runtime versions, missing configuration, a wrong output folder, or a service that accepts requests from the preview address but not the public one.

If the home page loads but a nested URL fails on refresh, ask whether the project uses browser routing, server routes, or generated files and which host configuration fits it. Do not fix a broken API or permission check by opening access to everyone. Diagnose the actual failed step.

Example request to adapt:

The preview works but deployment fails. Inspect this sanitized log and the project's deployment configuration. Explain whether this is a build, runtime, routing, or external-service issue. Propose the smallest change, describe its risk, and rerun the relevant checks. Keep the working release available for rollback.

## Prepare recovery before inviting users

Rollback means returning to a previous working release. Use the host's release history or redeploy the saved source version, and check that you can identify the version being served. A database change may prevent old code from working; ask for a compatible migration and recovery plan before altering production data.

Source history is not a database backup. For shared data, schedule backups, specify the maximum tolerable data loss, restore a backup into a separate environment, and confirm the records are usable. For the browser-only demo, export records and disclose that clearing storage or switching website address/browser can remove access to them.

Name who checks error logs, renews the domain, updates dependencies, responds to a failed integration, and reviews spending. Enable suitable cost notifications or caps where the provider supports them, and check what they actually enforce. Test the contact route and record how to disable a malfunctioning app. A VPS adds system patching, access management and recovery work; choose it when somebody has accepted that responsibility.

## Keep a one-page operating note

- Public URL, project owner, support/contact route, and intended users.
- Repository and deployed version; exact start, check, build and deployment instructions.
- Data location, access rules, backup/restore evidence and deletion procedure.
- Configuration names and where to set them, with secret values excluded.
- Monthly fixed costs, usage-based services, alert settings and shutdown procedure.
- Last tested date, known limitations, rollback steps and the next small improvement.


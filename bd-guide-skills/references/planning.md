# planning

Adapt this stage to the owner's app. The request tracker is a fictional teaching example.

## Start here: build a request tracker with fictional data

You can work through this path without learning a programming language first. You will still need to describe the result, inspect it, and check that it behaves as promised. The practice project is a request tracker: add a fictional request, view the list, edit its status, delete it after confirmation, and export your records.

Use one person, one browser, and made-up records for the first version. Leave payments, customer logins, email sending, and live integrations out of the first build. A small complete workflow is easier to understand than several impressive screens that do not work together.

Read the MVP guide first, then AI-assisted building, testing, and infrastructure. Keep a project folder containing your brief, screenshots, test results, and launch notes. Each guide produces something you can use in the next stage.

1. Write the problem: I lose track of requests and need to see which ones are new, in progress, or done.
2. Name the first user: me, using fictional data in one browser.
3. List the fields: request title, notes, status, and date created. Decide which are required.
4. Describe success: I can add, find, update, delete, and export a request without losing another record.
5. Choose a stopping point: a tested browser-only demonstration before real users, accounts, or shared data.

## Give the AI a brief you can check

A requirement says what the app needs to do. An acceptance check explains how you will know it did it. Write both in ordinary language before asking for code. The model can suggest missing cases, but you decide what belongs in this first version.

For the request tracker, define allowed status values and what happens when the title is empty. Decide whether deleting a record requires confirmation, whether cancelling leaves it untouched, and what an empty list should show. Include phone-sized screens, clear labels, keyboard access, and helpful error messages.

Keep a short list of assumptions. Browser storage belongs to that browser and website address; it is not a shared database or a backup. If the real goal is a team app, say that now so the later data and permissions work is planned rather than hidden.

Before collecting real records, decide which details are necessary, who can view and change them, how long they are kept, and how an owner can delete or export them. Agree whether a team shares every request or sees only assigned requests. Use those decisions as testable rules rather than assuming a login makes the data private.

Example request to adapt:

Help me define a small request tracker for one beginner. Use fictional data. Before coding, propose the screens, fields, allowed statuses, storage choice, acceptance checks, and what we are deferring. Explain each technical term when it first matters. Ask about choices that change the outcome. Keep the first version small enough for me to inspect.

## Own the accounts, source, and spending limit

Use an AI builder that gives you a working preview and access to the source files, or an assistant that can work inside a project folder. Create the project, source repository, hosting, and any later database account under an account you control. Enable the account's two-step verification and keep recovery details somewhere private.

A repository is the project's saved source and change history. A commit is a named snapshot; a branch is a separate line of changes. You can use GitHub's web interface or a desktop client, and ask the agent to explain its equivalent workflow. You do not need to memorize Git commands to understand which version is saved and which version is live.

Set a spending ceiling before enabling model APIs, hosting upgrades, or a database. Ask what costs depend on usage, how you will see the bill, and how to stop the service. Store passwords and API keys in the appropriate secret settings, never in an ordinary prompt, screenshot, public repository, or browser-delivered code.


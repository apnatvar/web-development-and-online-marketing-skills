# testing

Adapt this stage to the owner's app. The request tracker is a fictional teaching example.

## Test the request tracker as its user

You do not need to read the code to check the promised workflow. Write the expected result before trying it, use fictional records, and record the actual result. An agent saying that its build passes is useful evidence, but your own acceptance check tests whether it solved the problem you described.

Start with two records so you can notice one action accidentally changing another. Run the following checks in the preview and repeat the important ones on the deployed version. If shared accounts were added, use two different test users and a signed-out session.

1. Add a valid request. It appears once with the correct title and initial status.
2. Submit an empty title. The app explains the problem and creates no record.
3. Edit request A. Request B keeps its original values.
4. Cancel deletion. The record remains. Confirm deletion. Only that record disappears.
5. Reload and reopen the browser. Records behave according to the agreed storage rules.
6. Export records. Open the export and check that it contains the expected fields and values.
7. Use only the keyboard and a phone-width view. You can identify and operate every required control.
8. Try a long title, unusual characters, and an empty list. Text stays readable and the interface remains usable.

## Check the cases a smooth demonstration misses

If the app uses a network service, test a slow or unavailable connection. The user should receive a clear status rather than a false success message. Try submitting twice while the first action is running; decide whether the app prevents duplicates or safely treats the repeated action as the same request.

For shared records, check the agreed roles: a private record must stay private, while an intentionally shared record must be available only to the allowed team. Ask the agent to test a direct server or database request as well as the visible screen, including a signed-out request. Give it the expected read, edit and delete boundaries; let it produce automated tests appropriate to the stack. If your app has no server, shared accounts, or network requests, record those checks as outside the current scope rather than claiming they passed.

A lint check catches some code-quality issues; a type check checks certain value mismatches; a build check confirms that the project can produce its deployable output. None of those proves that a customer workflow, permission rule, or backup works. Ask what each check established and what still needs a browser or operational check.

Example request to adapt:

Create a test report with columns for scenario, expected result, actual result, evidence, and pass/fail. Run the checks that fit this project and state what you did not test. Prioritize losing data, unauthorized access, duplicate actions, and false success messages. Fix failures and rerun the affected checks before saying it is ready.

## Use a small release gate

Ask a second person or reviewer to repeat the main task with your written instructions. Record the version and date of the test. Change the code after that check and you need to retest the affected behavior. For a learning demo, show fictional examples and label its storage limits clearly.

- The agreed add/edit/delete/export workflow passes in the preview and deployed app.
- No known critical data-loss or access-control failure remains.
- The source and configuration can be recovered, and a previous working release is identified.
- For stored shared data, a backup has been restored into a separate test environment and checked.
- The owner can see failures and costs, has a support contact, and knows how to pause the app.
- The first user group is small enough to support, with clear limits and a way to report problems.


# Proposal and Approval

## Required proposal format

Use this compact structure before any edit:

```text
Target: <skill and repository>
Trigger: <new fact, failure, correction, or maintenance request>
Evidence: <direct sources, dates, versions, confidence>

Proposed changes
1. <file/section>: <exact addition, removal, or behavior change>
2. ...

Impact: <tasks/users/dependencies affected>
Risks: <regression, safety, compatibility, token/tool cost>
Validation: <baseline and candidate tests>
Rollback: <commit, patch, tag, or backup>
External actions: <none, or exact installs/commits/publishing>

May I apply this exact proposal?
```

Include removals and migrations explicitly; “refresh documentation” is not a sufficient scope. Link evidence close to the claim it supports.

## What counts as approval

Approval must be an affirmative response to the concrete proposal. Silence, a prior broad preference, permission to research, or the fact that a file is writable does not count. A user may approve part of a proposal; apply only that part.

Ask again when newly discovered work would materially change:

- target skill or repository;
- files outside the proposal;
- public interface, placeholders, paths, outputs, or dependencies;
- safety/compliance policy;
- external state, installation, commit, push, publication, or notification;
- expected downtime, cost, or data handling.

Minor implementation details needed to realize the approved behavior do not require re-approval when they stay inside the named files, risks, and tests.

## Emergency information

If evidence reveals a critical unsafe instruction, stop using that instruction and tell the user. Still obtain approval before changing the stored skill unless a higher-priority policy explicitly mandates remediation. Distinguish “do not execute this now” from “permission to rewrite the artifact.”

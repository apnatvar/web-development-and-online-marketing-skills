# Sources and Inspiration

Last reviewed: 2026-08-11. Recheck these sources before relying on current Hermes or agent-skill behavior.

## Hermes learning-loop inspiration

- [NousResearch Hermes Agent repository](https://github.com/NousResearch/hermes-agent) — describes a closed learning loop that creates skills from experience and improves them during use.
- [Hermes Agent skills documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/) — documents agent-managed skills, background review, and a configurable human write-approval gate.
- [Hermes Agent curator documentation](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/curator.md) — describes maintenance, staleness, consolidation, and review of skill collections.
- [Hermes Agent Self-Evolution](https://github.com/NousResearch/hermes-agent-self-evolution) — uses candidate variants, execution traces, evaluation, constraint gates, and a proposed pull request rather than treating reflection alone as proof.

This skill adopts the evidence and evaluation loop but deliberately requires a user-approved proposal before every write. It is a portable maintenance workflow, not an implementation of Hermes internals and not an autonomous background updater.

## Design principles

- Treat skills as versioned operational dependencies, not informal notes.
- Separate discovery, evidence gathering, proposal, approval, implementation, and evaluation.
- Preserve human authority and rollback at the mutation boundary.
- Require comparative evidence because self-judgment can reinforce errors, verbosity, and overfitting.
- Update any relevant user-owned skill; do not create a recursion that only edits the updater.

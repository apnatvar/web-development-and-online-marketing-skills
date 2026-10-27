# Template lookup command reference

Run commands through `python scripts/template_lookup.py`. The CLI accepts either one complete command string or separate command-line tokens. When passing one string, quote values containing spaces, for example `"customer onboarding"`. Results are JSON for the writing agent to use; the CLI selects and explains templates but does not generate finished prose.

## Find templates

```text
/templates [platform] [objective]
/templates [--platform VALUE] [--format VALUE] [--objective VALUE] [--tone VALUE]
           [--framework VALUE] [--length VALUE] [--audience VALUE] [--id VALUE]
```

The positional shorthand interprets the first term as platform and the second as objective; more than two terms is an error. Flags may be repeated to require all listed values. Results are compact and include each matching template's ID, name, objectives, and use cases. No matches produce `count: 0` and an empty list. Filter values are metadata checks, not writing tone instructions.

```text
/template ID [--info]
```

Returns the complete template metadata and structure for the exact ID. IDs are never fuzzy substituted; unknown IDs return a useful error and nonzero status. `--info` is accepted as an explicit metadata request.

## Prepare writing

```text
/write ID [--topic "..."] [--tone VALUE] [--mode auto|structure|draft|guided]
/write --template ID [--topic "..."] [--tone VALUE] [--mode auto|structure|draft|guided]
/recommend --topic "..." [--platform VALUE] [--objective VALUE] [--format VALUE]
           [--tone VALUE] [--framework VALUE] [--length VALUE] [--audience VALUE]
```

`/write` returns the complete selected template, the supplied parameters, and an instruction plan. `auto` is the default: the writing agent drafts when required inputs are available and uses guided prompts/placeholders or asks for missing inputs otherwise. `structure` asks for the scaffold, `draft` asks the writing agent to complete the prose, and `guided` gives a structure plus prompts/placeholders. `--tone` here is a generation override and does not change which template ID is retrieved. In `/recommend`, tone is a metadata filter used to find templates; after selection, pass a separate `/write --tone ...` override if the desired writing tone differs.

`/recommend` accepts topic as optional context and filters candidates by any supplied metadata; it works without a topic. Topic matching is not an automatic semantic search; the agent considers the topic against the returned candidate descriptions and use cases.

## Adapt existing content

```text
/rewrite --template ID [--topic "..."] [--tone VALUE] [--mode auto|structure|draft|guided]
/repurpose --from SOURCE_ID --to TARGET_ID [--topic "..."]
/compare ID ID
```

For `/rewrite` and `/repurpose`, provide the source text in the conversation. If it is missing, the writing agent should ask for it rather than inventing source material. Rewrite preserves the source meaning while following the selected template. Repurpose returns both source and target templates so the agent can retain the source's key points while reshaping them for the target format. Compare returns the full templates side by side as structured JSON.

## Template metadata contract

The registry at `assets/templates/index.json` contains schema version `1` and a list of compact entries. Each entry declares `id`, `name`, `description`, `platforms`, `format`, `objectives`, `tones`, `use_cases`, `framework`, `length`, `audiences`, and a path relative to `assets/templates`. The referenced JSON contains the full metadata plus `required_inputs`, `optional_inputs`, `structure`, `customization`, and `limitations`. Input-map keys are placeholder names; each corresponding string describes what value to provide. Preserve unknown or missing inputs as questions or visible placeholders rather than fabricating facts.

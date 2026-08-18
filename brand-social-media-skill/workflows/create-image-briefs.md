# Create image briefs

1. Read the campaign visual mode and `knowledge/image-guidelines.md`.
2. If mode is `none`, record visuals as skipped and stop.
3. For each mapped asset, use `templates/image-brief.md` and record platform, purpose, aspect ratio, subject, composition, hierarchy, text-overlay guidance, brand considerations, accessibility, negative constraints, prompt, filename, and associated output.
4. Save platform-specific briefs beside the associated content. Consolidate prompts in `assets/image-prompts.md` and structured records in `assets/image-manifest.json`.
5. Prefer real screenshots for product UI. Label mockups explicitly.
6. Ask the user to approve briefs before calling an image-generation tool, unless they explicitly enabled automatic visual generation for this campaign.
7. Save generated assets under `assets/generated/`, preserve source assets under `assets/source/`, update the image manifest, and write alt text.

Do not assume an image tool exists. Briefs and prompts are valid final outputs.


# Image guidelines

## Modes

Support `none`, `briefs`, `prompts`, and `generate`. Treat `generate` as enabled only when the user explicitly approves automatic generation. Otherwise stop after briefs or prompts.

## Brief fields

For every visual, record platform, purpose, associated content, aspect ratio, subject, composition, visual hierarchy, text-overlay guidance, brand considerations, accessibility notes, negative constraints, generation prompt, and filename.

## Integrity

- Use a real product screenshot or label the image as a mockup.
- Do not fabricate UI capabilities, customers, logos, testimonials, results, or certifications.
- Avoid dense text baked into images.
- Keep important information in the post copy as well as the visual.
- Write useful alt text for each informative image; mark decorative images explicitly.
- Include captions or a transcript for spoken video content.

Store narrative prompts in `assets/image-prompts.md` and records in `assets/image-manifest.json`. Save source assets under `assets/source/` and generated assets under `assets/generated/`.


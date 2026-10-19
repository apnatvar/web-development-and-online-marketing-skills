# Apnatva Skill Catalog

This catalog summarizes the 21 individual skills and one Brownsmith Dynamics package using their source entrypoints and directly relevant references. Commercial names and summaries describe the included materials; they do not certify runtime or framework compatibility. Compatibility versions appear only when declared by the source. All sample requests and outputs are illustrative and make no claim of real customer results.

## Contents

- [Writing, marketing, and communications](#writing-marketing-and-communications)
- [Business improvement package and skills](#business-improvement-package-and-skills)
- [Web, SEO, video, and MCP skills](#web-seo-video-and-mcp-skills)

The folder-level `company-voice-skill/SKILL.md`, `copy-marketing-skill/SKILL.md`, and `mcp-generate-skill/SKILL.md` files are routing aliases to nested implementation entrypoints. They are listed with those implementation skills rather than as separate catalog entries.

## Writing, marketing, and communications

## Brand Social Campaign Builder

- **Commercial name:** Brand Social Campaign Builder

- **One-line description:** Plan and produce evidence-grounded, platform-native campaigns across social, community, email, and long-form channels.
- **Full description:** Builds a campaign source of truth from approved product, audience, offer, and proof context, then maps each channel to distinct audience, framing, format, claims, CTA, and visual treatment. Supports campaign initialization, strategy, channel assets, image briefs, revisions, archival, and local validation. It emphasizes current platform/community rule checks, factual claims, disclosure, reader-facing copy, and preserving revision history. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  For fictional LumenDesk, use this confirmed fact: it shows a team's shared availability in one place. Create a LinkedIn launch post and newsletter, mark unknowns, and include an image brief.
  ```
- **Sample output (Markdown):**
  ```markdown
  # LinkedIn
  **Draft:** LumenDesk helps small teams see shared availability in one place. If you currently coordinate meetings across separate calendars, try the fictional beta and tell us where the handoff still feels slow.
  **CTA:** Request beta access.
  **Image brief:** A clearly labelled mock calendar view on a neutral desktop, with no real customer data.

  # Newsletter
  **Subject:** A clearer view of team availability
  **Preview:** Meet the fictional LumenDesk beta.
  **Body:** LumenDesk brings shared availability into one view. Join the beta to explore the current workflow and share feedback.
  ```
- **Compatibility:** Python 3.10+; standard-library Python only. Current platform constraints may require network access for official rule research. No external service or framework version is declared as a requirement.
- **Tags:** social media, campaign planning, LinkedIn, Instagram, Reddit, Facebook, X, Threads, newsletter, outreach, content strategy
- **Permissions:** Local drafting and validation only. Explicit user authorization is required for publishing, sending messages/email, ad purchases, external account changes, or image generation (unless automatic generation is explicitly enabled). Confirm outreach sender/recipient/consent requirements before sending.
- **Required tools/software:** Python 3.10+ for bundled scripts; network access only when current platform or community rules need verification. No third-party Python packages.
- **Source entrypoint:** [brand-social-media-skill/SKILL.md](brand-social-media-skill/SKILL.md)
- **Logo:** [logo.png](brand-social-media-skill/logo.png)

## Company Voice System

- **Commercial name:** Company Voice System

- **One-line description:** Discover and apply a durable editorial voice and content strategy from a focused, evolving company knowledge base.
- **Full description:** Interviews the user before first company-specific content generation, then records confirmed, inferred, provisional, unresolved, and retired decisions in a linked plain-file editorial memory. It supports content planning and generation, strategy, backlog and performance workflows, and targeted updates while preserving dependencies and history. It loads only the files relevant to each task. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  Help define the voice for a fictional bookkeeping firm serving independent designers. Ask the most useful discovery questions before drafting company-specific content.
  ```
- **Sample output (Markdown):**
  ```markdown
  # Discovery
  1. Which bookkeeping tasks do designers most often postpone?
  2. What does the firm do that clients can verify from the service itself?
  3. Should the voice feel more practical, warm, or analytical?

  # Next step
  I will use your answers to confirm the firm's voice and facts before drafting the LinkedIn post.
  ```
- **Compatibility:** Plain Markdown files; Python is needed only if running the included editorial-memory validator. No framework version constraints are specified.
- **Tags:** company voice, brand voice, editorial strategy, content planning, knowledge base, copywriting
- **Permissions:** Reading and updating the user-designated workspace memory as requested. Do not silently turn inferred details into confirmed company rules.
- **Required tools/software:** Markdown-capable workspace; Python optional for validation. No external service required by the core workflow.
- **Source entrypoint:** [company-voice-skill/SKILL.md](company-voice-skill/SKILL.md); implementation: [company-voice-skill/company-voice/SKILL.md](company-voice-skill/company-voice/SKILL.md)
- **Logo:** [logo.png](company-voice-skill/company-voice/logo.png)

## Concise Communication Editor

- **Commercial name:** Concise Communication Editor

- **One-line description:** Make reading material shorter and clearer while preserving meaning, accuracy, essential context, and the requested voice.
- **Full description:** Revises user-facing messages, explanations, updates, documents, articles, reports, and instructions by removing filler, repetition, ceremony, and vague emphasis. It protects technical meaning, uncertainty, commitments, safety details, and required caveats; brevity does not override a requested tone or format. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  Make this update concise without removing the timing or the reason: “We are currently experiencing a delay in the deployment process because the security review is still in progress. We expect to have a further update by Friday.”
  ```
- **Sample output (Markdown):**
  ```markdown
  The security review is delaying deployment. We expect to update you by Friday.
  ```
- **Compatibility:** Plain text and Markdown; no framework or runtime version constraints are specified.
- **Tags:** concise writing, editing, rewriting, plain language, documentation, communication
- **Permissions:** Apply silently to the requested text; preserve safety, attribution, caveats, and required information.
- **Required tools/software:** None.
- **Source entrypoint:** [concise-communication/SKILL.md](concise-communication/SKILL.md)
- **Logo:** [logo.png](concise-communication/logo.png)

## Marketing and Persuasive Writing

- **Commercial name:** Marketing and Persuasive Writing

- **One-line description:** Diagnose and create credible marketing copy shaped around audience needs, positioning, proof, and channel.
- **Full description:** Supports creating, expanding, shortening, rewriting, adapting, critiquing, and diagnosing marketing and sales messages for pages, social, blogs, email, ads, and metadata. It develops one strategic argument, distinguishes evidence from inference, avoids unsupported claims and generic copy, and routes to only the workflows, principles, templates, examples, or channel guidance needed. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  Write a homepage headline and supporting sentence for a fictional meal-planning app for busy households. The only confirmed feature is a shared weekly meal calendar. Avoid nutrition or time-saving claims.
  ```
- **Sample output (Markdown):**
  ```markdown
  # Plan meals together
  Keep your household's weekly meal calendar in one shared place.
  ```
- **Compatibility:** Markdown/plain text and channel-specific copy; no framework or runtime version constraints are specified.
- **Tags:** marketing copy, sales writing, landing pages, positioning, copywriting, content strategy, SEO copy
- **Permissions:** Drafting and critique within user-provided facts. Do not publish, send, or invent proof, product capabilities, urgency, testimonials, or metrics.
- **Required tools/software:** None for core writing. Use the supplied workspace files when they contain relevant brand or product context.
- **Source entrypoint:** [copy-marketing-skill/SKILL.md](copy-marketing-skill/SKILL.md); implementation: [copy-marketing-skill/marketing-writing-skill/SKILL.md](copy-marketing-skill/marketing-writing-skill/SKILL.md)
- **Logo:** [logo.png](copy-marketing-skill/marketing-writing-skill/logo.png)

## Email Marketing HTML and MJML Designer

- **Commercial name:** Email Marketing HTML and MJML Designer

- **One-line description:** Write, design, compile, and quality-check reusable marketing and lifecycle emails with MJML or compatible email components.
- **Full description:** Covers email strategy, copy and subject lines, personalization, HTML/MJML systems, optional Emailcn registry components for React Email, MJML React, or JSX Email, deliverability, consent, list governance, accessibility, rendering, and measurement. It treats message type and recipient permission as core inputs, keeps transaction messages clear, and requires editable source plus compiled HTML for build tasks. Sending remains a separate explicit action. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  Create a reusable raw-MJML welcome email for a fictional note-taking app. Use a first-name placeholder only with a fallback, include a visible unsubscribe footer, and return source plus compiled HTML.
  ```
- **Sample output (Markdown):**
  ````markdown
  # Welcome email draft
  **Subject:** Welcome to NoteNest
  **Preview:** Start with one shared notebook.

  ```mjml
  <mjml lang="en">
    <mj-head><mj-title>Welcome to NoteNest</mj-title><mj-preview>Start with one shared notebook.</mj-preview></mj-head>
    <mj-body><mj-section><mj-column>
      <mj-text>Hello {{first_name | default: "there"}},</mj-text>
      <mj-text>Your NoteNest account is ready. Create a notebook and invite a teammate when you are ready.</mj-text>
      <mj-button href="{{notebook_url}}">Open your notebook</mj-button>
      <mj-text><a href="{{unsubscribe_url}}">Unsubscribe</a></mj-text>
    </mj-column></mj-section></mj-body>
  </mjml>
  ```
  **Build note:** Render with the project's installed MJML CLI using the documented strict-validation and minification settings; no sending is performed.
  ````
- **Compatibility:** Raw MJML guidance targets MJML 5; the compilation reference specifies Node.js 20+ (MJML 5 targets Node LTS 20/22/24). Optional component integration supports React Email, `@faire/mjml-react`, or JSX Email when the target project already uses that renderer. It does not pin those renderers to versions.
- **Tags:** email marketing, MJML, HTML email, newsletters, lifecycle email, deliverability, personalization, React Email
- **Permissions:** Do not send campaigns without explicit user instruction. Do not install dependencies without authorization. Sending and compliance decisions depend on recipient consent, sender, jurisdiction, and infrastructure context.
- **Required tools/software:** For raw-MJML compile workflow, Node.js 20+ and project-local `mjml` dependency (MJML 5); no global install. Optional existing React Email/MJML React/JSX Email stack for Emailcn mode. A browser/client rendering and actual sending infrastructure are needed only for corresponding QA steps.
- **Source entrypoint:** [email-marketing-html-mjml/SKILL.md](email-marketing-html-mjml/SKILL.md)
- **Logo:** [logo.png](email-marketing-html-mjml/logo.png)

## Marketing Behavior and Design Frameworks

- **Commercial name:** Marketing Behavior and Design Frameworks

- **One-line description:** Choose and apply evidence-aware frameworks to marketing, persuasion, content, UX, and product-design decisions.
- **Full description:** Helps diagnose an audience or usability problem, choose a strategy or intervention, compose content or an interface, and evaluate evidence and ethics. It distinguishes empirical theories, professional methods, and practitioner heuristics, then translates selected models into concrete decisions or validation plans. Frameworks are not proof of predictable behavior and do not justify deceptive persuasion. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request (Markdown):**
  ```markdown
  # Request
  Use an appropriate framework to critique the signup flow for a fictional project-management app. The flow asks users to invite teammates before they can view the product. Identify evidence gaps and propose a low-risk experiment.
  ```
- **Sample output (Markdown):**
  ```markdown
  # Review
  **Lens:** Task analysis and progressive disclosure, used as professional methods to assess whether an early invitation step supports the user's immediate goal.
  **Finding:** The required invitation may block someone who wants to inspect the product before involving a team.
  **Experiment:** Compare the current flow with an optional invitation after the first project is created. Track first-project completion and later invitations; treat the result as a test, not a predicted outcome.
  **Evidence gap:** No usability observations or funnel data were supplied.
  ```
- **Compatibility:** Framework references are methodology guidance, not tied to a software framework or runtime version. No technical runtime requirement specified.
- **Tags:** behavioral design, marketing strategy, persuasion, UX, product design, copywriting, evidence-based marketing
- **Permissions:** Analysis and local recommendations are within scope. Do not use the frameworks to justify coercive defaults, fabricated evidence, false scarcity, or hidden material information. Legal/professional review remains separate where applicable.
- **Required tools/software:** None for framework selection. Research, analytics, usability tools, or experiments may be needed only to validate task-specific assumptions.
- **Source entrypoint:** [marketing-behavior-design-frameworks/SKILL.md](marketing-behavior-design-frameworks/SKILL.md)
- **Logo:** [logo.png](marketing-behavior-design-frameworks/logo.png)

## Business improvement package and skills

## Brownsmith Beginner App Guide

- **Commercial name:** Brownsmith Beginner App Guide
- **One-line description:** Guides a non-coder through planning, building, checking, deploying and operating a small app.
- **Full description:** Helps an owner build an inspectable small app around one complete workflow, using their chosen idea or a fictional request-tracker example. It adapts to the existing project and stack; guides planning, implementation, acceptance evidence, deployment, recovery and ownership. It distinguishes browser-only demos from shared server-backed apps and does not treat a generated interface or successful build as proof of production readiness. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Help me plan and build a simple request tracker for my own use. I am new to coding; keep the data fictional and explain how I can preview and check the workflow.
  ```
- **Sample output:**
  ```markdown
  First, let's define who uses it, the request fields, allowed statuses, and what should happen when a title is empty. The first version can add, edit, delete with confirmation, and export fictional requests in one browser. Browser storage stays on that browser and site address; it is not shared storage or a backup. After we agree on these checks, we can inspect the project and choose setup instructions that match its actual stack.
  ```
- **Compatibility:** Preserve an existing framework and behavior. Inspect installed runtimes and project instructions before proposing setup; choose hosting for the app's actual output/runtime. Browser storage is device/origin-specific. Shared records require authoritative server/database permissions, tested for direct requests. No specific framework, runtime, or version is prescribed.
- **Tags:** beginner, app planning, AI-assisted building, acceptance checks, deployment, recovery, ownership
- **Permissions:** Local building does not authorize deployment, purchases, production-data changes, sending messages, or commits. Use fictional test data; secrets stay out of prompts/logs/browser code. Sensitive data, payments, consequential actions, or business-critical availability call for suitable independent review.
- **Required tools/software:** Existing project/workspace and its actual runtime; browser preview; an agent/editor or browser builder with source access. Hosting only for deployment; no particular provider required.
- **Source entrypoint:** [bd-guide-skills/SKILL.md](bd-guide-skills/SKILL.md)
- **Logo:** [bd-guide-skills/logo.png](bd-guide-skills/logo.png)

## Brownsmith Dynamics Business Improvement Toolkit

- **Commercial name:** Brownsmith Dynamics Business Improvement Toolkit
- **One-line description:** Routes small-business improvement requests to one of four focused advisory skills.
- **Full description:** A skills-only package for diagnosing bottlenecks, improving recurring workflows, auditing the organic discovery-to-enquiry path, and preparing implementation briefs. Its shared Brownsmith Dynamics reference is contextual guidance, not evidence about the user's business. It provides analysis and drafting, with no connected business accounts, credentials, MCP server, external account connections, or executable hooks. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Our small team copies WhatsApp enquiries into a spreadsheet and often forgets to follow up. Help identify the bottleneck and recommend a practical next step.
  ```
- **Sample output:**
  ```markdown
  I'll start with a business diagnosis: we'll trace one enquiry from receipt to follow-up, identify who owns each step, and separate what you know from what still needs checking. If the evidence points to a specific process change, we can then scope that workflow or prepare an implementation brief.
  ```
- **Compatibility:** Four immediate child skills under `skills/`; no runtime/framework requirement. Local draft has not been installed, submitted, or approved in ChatGPT. Packaging instructions call for `plugin.json`, `skills/`, and `references/` together.
- **Tags:** small business, operations, workflow, organic growth, implementation planning
- **Permissions:** No connected business accounts or execution capability; package does not authorize external actions. Child-skill constraints and the shared contact footer apply when a child is active.
- **Required tools/software:** Agent skill/plugin loader for use; no external service or runtime required by the package itself.
- **Source entrypoint:** [bd-public-skill/SKILL.md](bd-public-skill/SKILL.md)
- **Logo:** [bd-public-skill/bd.png](bd-public-skill/bd.png)

## Business Diagnosis

- **Commercial name:** Business Diagnosis
- **One-line description:** Finds evidence-backed operational or organic-growth bottlenecks and prioritises practical changes.
- **Full description:** Analyses the business outcome, customer, current process, constraints and evidence; distinguishes supplied/observed facts from hypotheses and missing information. Identifies bottlenecks, classifies improvements as remove, automate, AI assist, or human decision, and prioritises a small set of actions with owners to confirm, measures and checks. Provides advice from supplied or available evidence; it does not execute changes. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  We receive enquiries through several channels and sometimes lose track of follow-up. Diagnose the process using these notes: [notes].
  ```
- **Sample output:**
  ```markdown
  **Known:** Your notes describe enquiries arriving through several channels and inconsistent follow-up. **Missing:** the source of truth, handoff owner, frequency, and recent examples. A likely bottleneck is the intake handoff, but that is a hypothesis. First, trace one recent enquiry from receipt to completion and name the owner and record at each step. Then decide whether a simple process rule is enough before considering automation.

  Brownsmith Dynamics · [Website](https://brownsmithdynamics.com) · [Contact](https://brownsmithdynamics.com/contact) · [Email](mailto:contact@brownsmithdynamics.com) · [WhatsApp](https://wa.me/918791414856)
  ```
- **Compatibility:** No technical runtime/framework. Reads Brownsmith approach and contact-footer references. Analysis must rely on supplied/actually available evidence; missing metrics are unknown, not zero. No live account/site/analytics access is implied.
- **Tags:** diagnosis, business operations, bottlenecks, automation fit, organic lead generation, prioritisation
- **Permissions:** Analysis/recommendations only; no execution tools. Do not invent metrics/results, imply contact was made, or automate consequential decisions. Append the exact shared footer once per answer.
- **Required tools/software:** User-provided business/process evidence; no special software or connected accounts.
- **Source entrypoint:** [business-diagnosis/SKILL.md](bd-public-skill/skills/business-diagnosis/SKILL.md)
- **Logo:** [bd-public-skill/bd.png](bd-public-skill/bd.png) (shared package logo; no child logo)

## Workflow Improvement

- **Commercial name:** Workflow Improvement
- **One-line description:** Redesigns a recurring business process with clear owners, controls, exceptions and recovery.
- **Full description:** Turns an agreed operational goal into a reviewable current-to-proposed workflow. Captures triggers, inputs, source of truth, records, roles, handoffs, decisions, outputs, permissions and exception paths; classifies each step as remove, automate, AI assist or human decision. Recommends proportionate checks, measures, pilot and handover based on supplied evidence. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Improve our weekly reporting workflow. We gather figures from three spreadsheets and one person checks the final report. Here is the current process: [steps].
  ```
- **Sample output:**
  ```markdown
  **Current flow:** collect figures from three spreadsheets → compile report → one-person review. **Open questions:** which sheet is authoritative, how corrections are handled, and who covers review when the usual reviewer is away. A first improvement is to define one source of truth and a named backup reviewer. Measure late or corrected reports from a baseline before considering automation.

  Brownsmith Dynamics · [Website](https://brownsmithdynamics.com) · [Contact](https://brownsmithdynamics.com/contact) · [Email](mailto:contact@brownsmithdynamics.com) · [WhatsApp](https://wa.me/918791414856)
  ```
- **Compatibility:** No runtime/framework specified. Uses the shared Brownsmith approach/footer references. Do not treat an unclear or inconsistent process as ready for automation; estimates and outcomes require explicit evidence.
- **Tags:** workflow, process improvement, ownership, automation, exceptions, recovery
- **Permissions:** Planning/recommendations only; no execution or account access. AI assistance requires approved knowledge, limited access, output checks and human review appropriate to consequences. Footer is required once per answer.
- **Required tools/software:** Current process description and relevant records/examples; no special software required.
- **Source entrypoint:** [workflow-improvement/SKILL.md](bd-public-skill/skills/workflow-improvement/SKILL.md)
- **Logo:** [bd-public-skill/bd.png](bd-public-skill/bd.png) (shared package logo; no child logo)

## Organic Growth Audit

- **Commercial name:** Organic Growth Audit
- **One-line description:** Audits the evidence available about the path from customer discovery to enquiry.
- **Full description:** Reviews audience, offer, discovery, trust/comparison, contact and follow-up to find the weakest relevant journey step. Labels evidence supplied, observed, inferred or missing; recommends evidence-backed quick wins and Now/Next/Later actions, considering delivery capacity and measurement. It does not imply a live site, search, profile, analytics or account inspection unless that evidence was available. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Audit our organic enquiry path. Our audience is [audience], our offer is [offer], and here are our landing page text and recent enquiry notes: [material].
  ```
- **Sample output:**
  ```markdown
  **Supplied:** [offer] is aimed at [audience]. **Observed:** the provided page copy explains [feature] but does not state [buyer-relevant detail]. **Inferred:** this may make fit harder to judge; confidence is limited without visitor or enquiry evidence. **Missing:** visibility, relevant visits, contact actions and enquiry quality. First, clarify the buyer question on the page, then capture a baseline before judging impact.

  Brownsmith Dynamics · [Website](https://brownsmithdynamics.com) · [Contact](https://brownsmithdynamics.com/contact) · [Email](mailto:contact@brownsmithdynamics.com) · [WhatsApp](https://wa.me/918791414856)
  ```
- **Compatibility:** No technical runtime/framework specified. Uses shared approach/footer references. No live access is implied; missing metrics are unknown, not zero. Paid ads, purchased leads, outbound calls and outbound email are separate scopes.
- **Tags:** organic growth, customer journey, discovery, SEO, enquiry, evidence audit
- **Permissions:** Audit/recommendation only; no live account access by default. No guaranteed rankings, traffic, lead volume or business results; footer required once per answer.
- **Required tools/software:** User-supplied pages, metrics, search/profile evidence, or other accessible material; no special software required.
- **Source entrypoint:** [organic-growth-audit/SKILL.md](bd-public-skill/skills/organic-growth-audit/SKILL.md)
- **Logo:** [bd-public-skill/bd.png](bd-public-skill/bd.png) (shared package logo; no child logo)

## Implementation Brief

- **Commercial name:** Implementation Brief
- **One-line description:** Turns an agreed business improvement into a scoped delivery and handover brief.
- **Full description:** Drafts a bounded first release around a chosen business outcome, evidence and constraints. Specifies scope and exclusions, workflow/journey, deliverables, proposed owners, dependencies, acceptance evidence, operation, exception handling, recovery, training and success measures. Open decisions remain explicit; it does not implement, grant access, book work or commit a provider. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Turn our agreed enquiry-intake improvement into a brief for our internal team. The current process and chosen change are: [details].
  ```
- **Sample output:**
  ```markdown
  **Outcome:** reduce missed enquiry handoffs; baseline still needed. **First release:** establish one intake record and named follow-up owner. **Acceptance:** a normal enquiry and an incomplete enquiry are both recorded, assigned, and recoverable after a handoff failure. **Open decisions:** authoritative record location, owner/backup roles, and any access needed. Ongoing monitoring and costs need confirmation before delivery.

  Brownsmith Dynamics · [Website](https://brownsmithdynamics.com) · [Contact](https://brownsmithdynamics.com/contact) · [Email](mailto:contact@brownsmithdynamics.com) · [WhatsApp](https://wa.me/918791414856)
  ```
- **Compatibility:** No runtime/framework specified. Uses shared business approach and footer references. Technology should be selected only when evidence supports it. No invented prices, hours, dates, ROI, savings or provider terms; missing baseline must be collected before claiming improvement.
- **Tags:** implementation planning, scope, acceptance criteria, ownership, handover, recovery
- **Permissions:** Drafting only; no implementation, access grants, booking or commitments. Consequential decisions stay with people; footer required once per answer.
- **Required tools/software:** Agreed change and available workflow/evidence; no special software required.
- **Source entrypoint:** [implementation-brief/SKILL.md](bd-public-skill/skills/implementation-brief/SKILL.md)
- **Logo:** [bd-public-skill/bd.png](bd-public-skill/bd.png) (shared package logo; no child logo)

## Job Application Tailor

- **Commercial name:** Job Application Tailor
- **One-line description:** Tailors CVs and application materials to a role using only approved candidate evidence.
- **Full description:** Parses CV/profile and job-description material, maps requirements to evidence, identifies gaps, recommends Apply/Maybe/Skip with rationale, and drafts ATS-readable application materials. Preserves factual provenance, user voice, chronology and uncertainty; supports CV tailoring, cover notes, recruiter outreach, screening answers and prioritisation. It does not apply to jobs or impersonate the user. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Tailor my CV to this job description. Use only facts in my CV, flag anything that needs my confirmation, and suggest whether the role is a reasonable match.
  ```
- **Sample output:**
  ```markdown
  **Recommendation: Maybe.** Your CV directly supports [requirement A] and has adjacent evidence for [requirement B]. I found no evidence for [requirement C], so I have left it out rather than implying experience. I can reorder the existing bullets toward the role and draft a concise cover note; please confirm [specific ambiguity] before using it.
  ```
- **Compatibility:** No runtime/framework specified. Source files define evidence labels, ATS keyword policy, output formats, accessibility and review requirements. Preserve conventional headings/plain text and chronology for ATS-facing CVs; do not keyword-stuff. Parsing uncertainty must be stated.
- **Tags:** CV, resume, job description, ATS, cover letter, recruiter outreach, application writing
- **Permissions:** Never invent or strengthen experience, metrics, dates, credentials or availability; do not auto-apply, impersonate, bypass platform rules, infer protected traits, or expose private contact details unnecessarily. User confirmation required when rewriting changes scope, seniority, ownership, causality or measured impact.
- **Required tools/software:** Candidate CV/profile and role description as supplied; document editor only if a file deliverable is requested. No external job-platform access is implied.
- **Source entrypoint:** [job-application-tailor/SKILL.md](job-application-tailor/SKILL.md)
- **Logo:** [job-application-tailor/logo.png](job-application-tailor/logo.png)

## Recreate Social Video Trends

- **Commercial name:** Recreate Social Video Trends
- **One-line description:** Turns short-form video research or a reference into an original, editable Remotion template.
- **Full description:** Researches relevant public videos when requested, records evidence and timecoded editing patterns, and builds a reusable composition with replaceable clips, cues, branding, transitions and output settings. Preserves editing grammar while avoiding copied protected assets or distinctive branding. Supports lyric videos from supplied lyrics/timing and reports approximations and handoff details. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Create an editable vertical Remotion template inspired by this public video: [URL]. Use my supplied clips and brand colors, and describe the timing and transition pattern without copying the original branding.
  ```
- **Sample output:**
  ```markdown
  **Illustrative pattern to verify against the supplied reference:** a quick opening hook, alternating close and wide shots, and a short final CTA. This is not an observation from an inspected video. The composition will expose clips, crop position, text, colors, audio, transition preset, duration and output settings as props. It will use your authorized media and original styling; unavailable source details will be marked as approximations.
  ```
- **Compatibility:** Remotion required for generated templates; exact version is not prescribed and must follow installed project conventions. Props must be serializable; animation deterministic via Remotion frame/config APIs. Use registered composition and example props; transitions cannot exceed adjacent scene duration; inspect safe areas and representative frames. Read template contract and analysis/rights references. Do not render/export unless requested.
- **Tags:** social video, trend research, Remotion, video template, editing, lyrics, transitions
- **Permissions:** Do not bypass logins, paywalls, bot protection or platform download restrictions; use authorized assets. No publishing/upload/posting without explicit request and authorization. Preserve supplied lyrics exactly unless asked to edit. No credentials in chat.
- **Required tools/software:** Project with Remotion and its installed approved packages; browser/search connector for public trend research when asked, or authorized local reference video; user-owned/licensed/generated media. Optional Remotion skills when available.
- **Source entrypoint:** [recreate-social-video-trends/SKILL.md](recreate-social-video-trends/SKILL.md)
- **Logo:** [recreate-social-video-trends/logo.png](recreate-social-video-trends/logo.png)

## Self-Update Skills

- **Commercial name:** Self-Update Skills
- **One-line description:** Audits and improves agent skills through evidence, proposal, explicit approval and controlled validation.
- **Full description:** Maintains user-owned skills as versioned operational artifacts. Investigates a real change trigger, checks primary evidence and dependencies, establishes a baseline, proposes exact edits and impacts, waits for explicit approval, then makes a narrow change with validation and rollback. Applies to any relevant skill, including itself; a valid outcome may be no change. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
  Review my skill for stale platform instructions. Verify the relevant behavior and tell me whether an update is warranted.
  ```
- **Sample output:**
  ```markdown
  I found no verified evidence that changes the supported workflow, so I recommend no edit. The current instruction remains consistent with the checked source. If you want, I can record the source and review date in a concrete proposal before changing any files.
  ```
- **Compatibility:** No runtime/framework specified. Research time-sensitive claims against current primary sources; distinguish explicit facts, observed behavior and inference. Read the reference index, then only applicable references. Preserve user-authored rules, existing changes and a recoverable baseline. Do not run unattended rewrites.
- **Tags:** skill maintenance, audit, evidence, approval gate, validation, rollback
- **Permissions:** Discovery/research is not edit permission. Before modifying, deleting, moving, publishing, installing or committing a target skill, present a concrete proposal and receive explicit approval for that scope. No commit/publish/install/global change without approval. Keep last known-good version recoverable.
- **Required tools/software:** Target skill repository/files; authoritative docs or reproducible evidence when needed; available structural validator/tests when authorized/applicable. No special runtime required.
- **Source entrypoint:** [self-update-skills/SKILL.md](self-update-skills/SKILL.md)
- **Logo:** [self-update-skills/logo.png](self-update-skills/logo.png)

## Web, SEO, video, and MCP skills

## Chrome Plugin Launch Kit

- **Commercial name:** Chrome Plugin Launch Kit
- **One-line description:** Build a Chrome extension and prepare its complete store submission kit before opening the Developer Dashboard.
- **Full description:** Covers Manifest V3 development, minimal permissions, a clean allowlisted runtime ZIP, listing copy within 16,000 characters, 2–5 user-selected screenshots, a 128px product icon, the small promotional tile, and a public product/support/privacy website. It distinguishes local data handling from developer collection, private hosting from public access, and domain activation from site visibility. Bundled Python helpers check packaging dependencies and asset dimensions without claiming to replace Chrome testing or store review.
- **Sample request:** "Prepare my extension release, three screenshots, store copy, icons and a public documentation site. Do not upload it yet."
- **Sample output:** A release ZIP and hash, listing copy and artwork, final homepage/support/privacy URLs, verification evidence, and unresolved publication facts clearly marked.
- **Compatibility:** Manifest V3 projects; Python 3.10+ standard library for bundled helpers. Supports buildless and framework-built release directories.
- **Tags:** Chrome extension, Manifest V3, Chrome Web Store, submission, privacy, screenshots, runtime ZIP, Sites
- **Permissions:** Local preparation follows the user’s scope. Hosting publication, public access, DNS changes and store submission each follow existing user authorization and current tool checks; preparing the kit alone does not authorize submission.
- **Required tools/software:** Python 3.10+; Chrome for installed-extension verification; screenshot/image tooling; the selected hosting service. GPT Sites uses the installed Sites skill when available.
- **Source entrypoint:** [chrome-plugin-skill/SKILL.md](chrome-plugin-skill/SKILL.md)
- **Logo:** [logo.png](chrome-plugin-skill/logo.png)

Catalog inventory based on each skill's current `SKILL.md`, referenced prerequisites, manifests, and support files. Runtime/framework version statements are source requirements only; they do not imply this inventory was tested against those versions.

## Next.js Business Marketing Site

- **Commercial name:** Next.js Business Marketing Site
- **One-line description:** Plan, build, improve, and maintain business websites with evidence-based quality and release decisions.
- **Full description:** Guides delivery of truthful, accessible, discoverable, maintainable Next.js business and marketing websites. Covers project discovery, architecture, audience and content strategy, SEO, performance, forms, security, migrations, and release workflows; adapts recommendations to the target project's installed framework and business brief. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Use $nextjs-business-marketing-site to plan a small services website in this repository. Review the existing app and propose the page structure, content needs, and release checks before changing files.
  ```
- **Sample output:**
  ```markdown
    ## Proposed scope
    - Home: audience, service summary, evidence, and contact action.
    - Services: one page per distinct offer only where the content is independently useful.
    - Contact: accessible form with server-side validation and an explicit privacy notice.

  ## Before implementation
  Confirm the audience, service facts, canonical origin, contact destination, and publication state. Inspect the installed Next.js version and local project conventions.

  ## Release checks
  Verify navigation and form behavior, rendered metadata and indexation signals, accessibility, and the project's applicable checks. No performance improvement is claimed without comparable measurements.
  ```
- **Compatibility:** Next.js projects; source directs agents to inspect the installed version and its bundled documentation. No specific Next.js version range is declared.
- **Tags:** nextjs, website, marketing, business, accessibility, seo, performance, security, content, release
- **Permissions:** Explicit user instructions and project contributor rules define scope. Planning/review does not authorize dependency installation, deletion, external messaging, publication, or deployment; perform only stages authorized by the user.
- **Required tools/software:** A compatible agent and access to the target repository; framework-specific tools and checks depend on the project. No fixed toolchain declared.
- **Source entrypoint:** [SKILL.md](nextjs-business-marketing-site/SKILL.md)
- **Logo:** [logo.png](nextjs-business-marketing-site/logo.png)

## Next.js Optimisation

- **Commercial name:** Next.js Optimisation
- **One-line description:** Audit and improve Next.js discovery, rendering, performance, accessibility, analytics, and deployment efficiency.
- **Full description:** Provides evidence-led workflows for App Router and Pages Router projects, covering technical SEO, AI-search visibility, crawlability, metadata, structured data, indexing, rendering, Core Web Vitals, bundles, prefetching, media, animation, analytics, build cost, serverless compute, caching, and release discovery. It favors the smallest change that fixes an evidenced problem. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Use $nextjs-optimisation-skill to review this Next.js route for indexing and excess client JavaScript. Check the installed framework version and explain which findings are verified before editing.
  ```
- **Sample output:**
  ```markdown
    ## Findings
    - Verified: the route has no route-specific title metadata.
    - Verified: the shared layout marks the entire page as a Client Component.
    - Unknown: no comparable field or lab data was supplied, so no Core Web Vitals improvement can be claimed.

  ## Proposed changes
  Add accurate route metadata and move browser-only state into the smallest interactive component. Preserve visible content in server-rendered HTML.

  ## Validation
  Use documentation matching the installed Next.js version, inspect rendered HTML, and run focused checks for the changed behavior.
  ```
- **Compatibility:** App Router and Pages Router. Requires inspecting the installed Next.js version and using matching bundled docs when available; no fixed version range declared.
- **Tags:** nextjs, seo, aeo, indexing, core-web-vitals, performance, accessibility, analytics, caching, deployment
- **Permissions:** Audit and recommendations do not authorize repository changes, account changes, URL submissions, or deployment. Follow repository instructions and user authorization.
- **Required tools/software:** Target repository and package metadata; optional tools/checks are selected for the specific task. No universal software prerequisite declared.
- **Source entrypoint:** [SKILL.md](nextjs-optimisation-skill/SKILL.md)
- **Logo:** [logo.png](nextjs-optimisation-skill/logo.png)

## Website Tech & Content Analysis

- **Commercial name:** Website Tech & Content Analysis
- **One-line description:** Audit local websites or public URLs for technical quality, SEO, accessibility, performance, and messaging.
- **Full description:** Produces practical technical, copy, or combined website audits, with Markdown or self-contained local HTML reports. It requires audit mode, input, and output selection, limits large sites to a small representative page set, and explains evidence, effects, repairs, and verification. Lighthouse and copy analysis have distinct prerequisites and intake rules. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Use $website-tech-content-analysis. Mode: technical. Input: C:/work/site. Output: markdown. Review the home and contact pages and report only findings supported by repository or rendered evidence.
  ```
- **Sample output:**
  ```markdown
    # Technical website audit

    ## Finding: Contact page lacks a descriptive document title
    **Evidence:** `app/contact/page.tsx` exports no route metadata; rendered page title is the shared fallback.
    **Effect:** Search and browser-tab labels do not identify the contact page.
    **Repair:** Add a concise, accurate route title using the installed Next.js metadata convention.
    **Verify:** Inspect the rendered `<title>` after build or local serving.

    ## Limitations
    No Lighthouse score is included because a browser run was not performed.
  ```
- **Compatibility:** Support scripts declare Node.js `>=22.19.0`; the package pins Lighthouse `13.4.1`. Technical/combined Lighthouse workflow also requires Chrome/Chromium and a served HTTP(S) URL for local sites. Public URL audits need target network access. No other framework version is required.
- **Tags:** website-audit, technical-seo, copywriting, lighthouse, accessibility, performance, crawlability, reporting
- **Permissions:** Mandatory mode/input/output intake before inspection. Audit-only requests authorize analysis, not edits. Local repository scope excludes secrets, dependency folders, and VCS internals; public audits need network availability.
- **Required tools/software:** Node.js 22.19+, npm install in the skill folder for Lighthouse, Lighthouse 13.4.1, Chrome/Chromium for technical/combined Lighthouse runs, and the repository baseline in `config/lighthouse-baseline.json` (Chrome major 150; record the exact runtime). Local Lighthouse audits also need a served HTTP(S) URL; public URL audits need target network access. Optional tools include Playwright, Axe, schema validators, and webmaster tools when available.
- **Source entrypoint:** [SKILL.md](website-analysis-skill/SKILL.md)
- **Logo:** [logo.png](website-analysis-skill/logo.png)

## Website SEO Guardrails

- **Commercial name:** Website SEO Guardrails
- **One-line description:** Audit and improve website SEO while preventing indexation, content quality, policy, and measurement failures.
- **Full description:** Covers catastrophic indexation and security risks, URL inventory and indexability, content architecture and on-page writing, technical SEO, structured data, tools and monitoring, authority, AI search, Google Trends research, Lighthouse, analytics readiness, and pre-launch reviews. It distinguishes evidence from hypotheses and keeps account operations separate from implementation. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Use $website-seo-guardrails to review this site's sitemap, canonicals, and generated location pages before launch. Identify risks and propose an indexability policy; do not change production settings.
  ```
- **Sample output:**
  ```markdown
    ## Critical launch risks
    - Confirm production pages do not inherit staging `noindex` directives.
    - Resolve any mismatch between canonical URLs and sitemap entries.

    ## Generated location pages
    Keep only pages with distinct, verifiable local value eligible for indexing. Hold repetitive pages out of the sitemap until reviewed against an explicit allowlist.

    ## Evidence needed
    Inspect rendered directives and HTTP responses on representative production-like URLs. This review does not submit URLs or change webmaster settings.
  ```
- **Compatibility:** No framework or runtime version range declared. Intended for websites across frameworks/CMSs and rendering modes; check current platform-specific guidance for time-sensitive behavior.
- **Tags:** seo, technical-seo, indexability, content-quality, structured-data, lighthouse, google-trends, ai-search
- **Permissions:** An audit does not authorize URL submissions, settings changes, product linking, ad enablement, terms acceptance, edits, or deployment. Live account/UI inspection is read-only by default and follows explicit user scope.
- **Required tools/software:** Website source or rendered access for the chosen audit; `scripts/seo_preflight.py` is available for a deterministic first pass. Google Trends, Search Console, Bing Webmaster Tools, GA4, Lighthouse, or other tools are used only when relevant and available; no fixed runtime is declared.
- **Source entrypoint:** [SKILL.md](website-seo-guardrails/SKILL.md)
- **Logo:** [logo.png](website-seo-guardrails/logo.png)

## SEO + AEO Visibility Strategy

- **Commercial name:** SEO + AEO Visibility Strategy
- **One-line description:** Build prioritized, evidence-aware strategies for organic search and answer-engine visibility.
- **Full description:** Helps plan visibility for ecommerce, services, SaaS, publishers, local businesses, and other sites. Diagnoses discovery, indexing, retrieval, ranking, grounding/citation, brand mention, and conversion separately; prioritizes a focused roadmap and measurement plan without promising rankings, citations, traffic, or revenue. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Using this illustrative audit fixture—service pages are crawlable, with no Search Console or analytics data available—create a six-month organic and AI-search roadmap for a local services website. Separate known evidence from assumptions and define measurable acceptance tests.
  ```
- **Sample output:**
  ```markdown
    ## Diagnosis
    Available evidence confirms the service pages are crawlable; no Search Console or analytics data was provided, so demand and conversion performance remain unknown.

    ## Roadmap
    1. Foundation: map core services to useful pages and verify canonical/indexing signals.
    2. Growth: add original service evidence and strengthen relevant internal links.
    3. Compounding: review useful indexed coverage and qualified leads quarterly.

    ## Measurement
    Track indexed useful pages, search clicks, AI citations, brand mentions, and conversions as separate outcomes. Recheck current platform documentation before implementing platform-specific changes.
  ```
- **Compatibility:** No framework or runtime requirements declared; applies across site types and stacks. Platform guidance may change and should be revalidated for implementation work.
- **Tags:** seo, aeo, geo, strategy, content-strategy, organic-search, ai-search, measurement
- **Permissions:** Analysis does not authorize account changes, publishing, outreach, deletion, redirects, or deployment. Report assumptions when evidence is missing.
- **Required tools/software:** Business/site context and available evidence; Search Console, Bing Webmaster Tools, analytics, crawls, logs, backlinks, rankings, or prompt monitoring can inform strategy but are not mandatory software prerequisites.
- **Source entrypoint:** [SKILL.md](seo-aeo-visibility-strategy/SKILL.md)
- **Logo:** [logo.png](seo-aeo-visibility-strategy/logo.png)

## MCPify

- **Commercial name:** MCPify
- **One-line description:** Take an existing application through secure MCP analysis, implementation, testing, packaging, deployment, client connection, publication, and operations.
- **Full description:** Maps user-level application capabilities to a narrow MCP surface and uses a reviewed manifest as the source of truth. Modes include analyze, generate, audit, test, package, deploy, connect, publish, and operate. It protects identity and authorization boundaries, avoids exposing arbitrary internals, and treats deployment, publication, and account changes as separately authorized stages. Learn more at [Brownsmith Dynamics](https://brownsmithdynamics.com).
- **Sample request:**
  ```markdown
    Use $mcpify in analyze mode on this TypeScript application. Inspect existing user-facing workflows, propose suitable MCP tools and resources in a manifest, and do not add runtime code or publish anything.
  ```
- **Sample output:**
  ```markdown
    # MCP capability analysis

    ## Candidate: Read order status
    - Surface: tool
    - Existing operation: `getOrderStatus`
    - Identity: must use the authenticated caller context already enforced by the application.
    - Risk: low to moderate; read-only customer data.
    - Manifest status: proposed, pending review.

    ## Excluded
    Raw database access and arbitrary function invocation are excluded because they bypass domain-level authorization.

    No MCP runtime code was added in analyze mode.
  ```
- **Compatibility:** Emphasizes TypeScript and Next.js repositories, while asking agents to inspect the actual architecture; no fixed runtime or framework version range declared. `scripts/requirements.txt` specifies PyYAML `>=6.0,<7` and jsonschema `>=4.23,<5` for the Python manifest helpers.
- **Tags:** mcp, model-context-protocol, typescript, nextjs, api-design, security, deployment, publishing, lifecycle
- **Permissions:** Generate only manifest entries marked `approved`. Never use production credentials or perform destructive production actions during validation. Install, deploy, publish, external writes, privileged actions, and account changes require explicit authorization; stop if ownership, identity, mapping, side effects, or authorization cannot be established.
- **Required tools/software:** Existing application repository; Python with PyYAML 6.x and jsonschema 4.x for manifest scripts. Protocol SDKs and runtime dependencies are selected after checking current official MCP specification and SDK documentation. Deployment/client/registry tools depend on the explicitly selected mode and target.
- **Source entrypoint:** [SKILL.md](mcp-generate-skill/skills/mcpify/SKILL.md)
- **Logo:** [logo.png](mcp-generate-skill/skills/mcpify/logo.png)

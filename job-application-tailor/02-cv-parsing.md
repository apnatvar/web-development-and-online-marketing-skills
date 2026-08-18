# CV Parsing Workflow

When a CV is provided:

1. Extract raw text.
2. Preserve the original raw text.
3. Detect sections.
4. Extract candidate data.
5. Store all extracted items as cv_parsed.
6. Show a review table.
7. Ask the user to approve, edit, or reject each item.

Do not treat parsed data as final truth until reviewed.

Extract:
- name
- email
- phone
- links
- summary
- education
- experience
- skills
- projects
- certifications
- metrics

Flag uncertain parses.

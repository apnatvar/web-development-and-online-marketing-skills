# User Intake Workflow

Start with a conversation that collects profile data in small sections.

Ask for:
- target role titles
- target country and locations
- preferred work mode
- industries to target
- current CV
- work history
- education
- skills
- projects
- certifications
- metrics
- tools and technologies
- constraints
- claims to avoid

For each answer, store the information as structured profile data.

Every stored item must include:
- value
- source: user_intake
- evidenceStatus: user_claimed
- userApproved: false unless the user confirms it
- notes if uncertain

If the user says a claim is final and approved, mark it as user_approved.

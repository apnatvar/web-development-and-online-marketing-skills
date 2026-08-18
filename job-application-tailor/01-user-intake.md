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

For each answer used in the task, maintain a working evidence record. Do not require a database, application profile, or persistent storage.

Each record should include:
- claim or value
- source, such as user intake or source CV
- evidence status: user_claimed unless the user confirms it
- approval status
- uncertainty notes when needed

If the user confirms a claim for use, mark it as user_approved. Keep the record only as long as needed for the requested work unless the user asks for a reusable profile artifact.

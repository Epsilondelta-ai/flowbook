# /flowbook — Flowchart Documentation Generator

Analyze codebase and generate Mermaid flowchart documentation using Flowbook.

Load the **flowbook** skill and execute the full flowchart generation workflow.

When prompted with `/flowbook`, you MUST:

1. Load the `flowbook` skill (SKILL.md) for detailed instructions
2. Analyze the codebase for logical flows (API routes, auth, state management, business logic)
3. Set up Flowbook if not already initialized (`npx flowbook@latest init`)
4. Generate `.flow.md` files with Mermaid diagrams for every significant flow
5. Run `npm run flowbook` to verify the build

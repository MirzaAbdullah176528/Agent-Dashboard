# Project Conventions

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- next-themes

## Code Style

- Do not add code comments of any kind, including JSDoc, unless explicitly asked for them.
- Do not invent new design tokens — always reuse the CSS variables defined in globals.css.
- Follow the existing file/folder structure; do not restructure the project without asking.

## Accessibility

- Every interactive component must be keyboard-navigable and pass WCAG 2.1 AA contrast.

## Dependencies

- Ask before adding any new npm dependency that isn't already in package.json.

## Reporting

- After generating any component, list the files you created or changed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

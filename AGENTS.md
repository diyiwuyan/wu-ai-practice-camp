# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Product Decisions

- Brand name: 武同学AI实践营; use the orange-book-inspired orange palette with warm paper neutrals.
- Selected visual direction: the second generated homepage concept in `/Users/wangxiaoxian/.codex/generated_images/019f7f5f-e604-72a3-8114-5173f1164ea6/exec-d10edb6d-b46c-496d-beab-696700f451df.png`.
- Product emphasis: practical learning first, then knowledge accumulation, Skill recommendations, and learner-contributed cases; keep free WorkBuddy learning alongside paid advanced courses.

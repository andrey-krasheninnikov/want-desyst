# AGENTS.md

## Agent skills

### Issue tracker

Issues live in GitHub Issues for `andrey-krasheninnikov/want-desyst`.
See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels.
See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context glossary and ADR layout.
See `docs/agents/domain.md`.

### Want interfaces

For Want interface, component, and UI-copy work, use the repository skill at `skills/want-design/SKILL.md`.

## Implementation contracts

Use Bun 1.3.14 and the root scripts. Work from the issue-specific persistent worktree. Read GLOSSARY.md, DESIGN.md and relevant docs/adr before changes.

Keep foundation code independent of React and product services. React components use public props, semantic tokens and the installed Radix primitives. Never import wallpapers catalogue data, APIs, telemetry, advertising or routes into public packages. Consumers own persistence and localized copy.

Preserve the approved product theme, labels, keyboard behavior, RTL, 44 px targets and reduced-motion/transparency fallbacks. Do not add a visual redesign or decorative divider rules. Package exports, compiled CSS, assets, declarations and a separate consumer check form one contract.

After context compaction, fully re-read applicable instructions, every selected skill and its required references before continuing. Preserve the current review budget and successful checks when their inputs are unchanged.

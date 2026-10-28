# 0001: Shared foundations and a React adapter

Status: accepted.

The foundation package owns JSON tokens, compiled CSS, locally served fonts, logo assets and opt-in browser effects. JSON keeps numeric geometry and motion values independent of CSS. The build derives semantic CSS variables from that source.

The React adapter owns the existing Radix primitives and generic brand, media, contact, theme and comment compositions. React and React DOM remain peer dependencies. The adapter depends on the matching foundation release. Public ESM exports and TypeScript declarations define the package boundary.

Product themes remain separate from application workflows. The first theme preserves Want Wallpapers. Routes, catalogue records, API access, analytics, advertising, authentication, persistence and localization dictionaries stay in consumers. Components receive labels, view data and callbacks.

The Astro showcase uses local fixtures and public package imports. It supplies a local theme controller and examples; it does not connect to wallpapers services.

The first public npm release is 0.1.1 as @want-foundation/desyst-foundation and @want-foundation/desyst-react. The existing v0.1.0 source tag remains unchanged. Other framework adapters, including Flutter, can consume the foundation tokens later. They are outside the first migration. Changes to public exports and observable behavior require a version and migration notes.

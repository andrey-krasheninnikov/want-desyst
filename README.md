# Want Desyst

Shared design foundations and UI kits for Want products across web and mobile.

## Organization

- Shared foundations: platform-independent design tokens, typography, brand assets, logos and visual guidelines.
- Framework adapters: reusable components for each framework. The first adapter targets React on the web; Flutter and other frameworks can follow.
- Product layers: themes, branded components, logo compositions and reusable product-specific compositions.

Web packages will be distributed through public npm releases with explicit versions. Package names and exports will be established during the first migration.

## First migration

The first planned migration extracts the shared web UI kit from [Want Wallpapers](https://github.com/andrey-krasheninnikov/want-wallpapers), including its reusable components, themes, fonts, liquid glass styles, shared effects and component showcase.

Catalogue data, API access, analytics, advertising and application routes remain in Want Wallpapers. Shared components expose the inputs and events that products need without depending on those services.

This repository currently contains repository conventions and licensing. It does not yet contain a UI-kit implementation or a published package.

## Repository conventions

Read [AGENTS.md](AGENTS.md) for the issue tracker, triage vocabulary and domain documentation rules. Track work in [GitHub Issues](https://github.com/andrey-krasheninnikov/want-desyst/issues).

The repository uses one design-system domain context. Add glossary entries and architecture decisions when a concrete term or decision needs recording.

## License

[MIT](LICENSE). Preserve the existing licenses and notices of any components, fonts or brand resources brought into this repository.

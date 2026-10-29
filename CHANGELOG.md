# Changelog

## 0.3.0

### Added

- Optional shimmerDelayMs bounds and the want:background-shimmer event for controlled background waves. Existing consumers retain the default interval and cleanup function.

### Migration

Upgrade foundation and React together to 0.3.0. Existing calls need no changes. Consumers may supply wave-delay bounds and dispatch the background event for an immediate wave.

## 0.2.0

### Added

- A reusable Want design skill covering brand, voice, composition, typography, motion, UI/UX, and React integration.
- The foundation package's want-design-install command, with project, personal, and custom destinations and preservation of existing installations.
- Checkbox, DropdownMenu, Toast, Tooltip, Combobox, Popover, Table, Pagination, FileUpload, and Progress, with local showcase examples.
- A 17-preset typography scale, Typography and Prose, Japanese/Arabic fonts, custom loaders, shimmers, and animated text.
- Reusable Glow and semantic error, warning, info, and success snackbars.

### Changed

- Use the same five brand/status accents in both themes, with separate readable text roles.
- Add state motion to controls and compact, theme-aware feedback surfaces.
- Center navigation and breadcrumb content while preserving 44 px targets.
- Keep Glow visible under reduced transparency. Reduced motion stops its waves; forced colors hide the decoration.

### Migration

Upgrade foundation and React together to 0.2.0. Existing component calls need no changes. Status surfaces use bright accents with dark ink; use status-text tokens for inline colored copy. New compositions receive controlled values, labels, and callbacks from the consumer. Place Glow in a glow-host and expose pause controls for persistent motion. Install the Want skill separately when needed; importing the UI packages does not install it.

## 0.1.2

### Added

- Public DateField, UrlField, OpenUrl and Window components with consumer-supplied labels.
- Calendar keyboard controls, responsive examples and independent package checks.

### Migration

Upgrade foundation and React together to 0.1.2. Existing component calls need no changes. New DateField calls supply a locale and DateFieldLabels; new UrlField calls supply an openLabel.

## 0.1.1

### Changed

- Publish the foundation and React adapter as @want-foundation/desyst-foundation and @want-foundation/desyst-react. Installation examples use the organization-scoped names.

## 0.1.0

### Added

- Framework-independent tokens, compiled theme styles, local fonts, logo assets and optional interaction effects.
- React 19 primitives and controlled brand, media, contact, theme and comment compositions.
- A local Astro showcase, package installation examples and an isolated consumer check.

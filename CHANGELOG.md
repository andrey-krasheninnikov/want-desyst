# Changelog

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

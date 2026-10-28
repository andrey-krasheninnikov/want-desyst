# Want Desyst

Shared design foundations and UI kits for Want products across web and mobile.

## Packages

- @want-desyst/foundation: JSON tokens, compiled CSS, local fonts, brand assets and opt-in browser effects.
- @want-desyst/react: React 19 primitives and generic product compositions built on Radix.

Both packages start at version 0.1.0. Keep their versions aligned. The first theme preserves Want Wallpapers; Flutter and other adapters can consume the foundation later.

## Install a release

For a published release, install the matching versions:

```sh
npm install @want-desyst/foundation@0.1.0 @want-desyst/react@0.1.0 react@^19 react-dom@^19
```

Import the stylesheet once in the application's entry point. The font stylesheet is optional and serves its font files locally.

```tsx
import '@want-desyst/foundation/styles.css';
import '@want-desyst/foundation/fonts.css';
import { Button, Field, FieldLabel, Input } from '@want-desyst/react';

export function Example() {
  return <Field>
    <FieldLabel htmlFor="name">Name</FieldLabel>
    <Input id="name" autoComplete="name" />
    <Button type="button">Continue</Button>
  </Field>;
}
```

No stylesheet copying, source aliases or scanning library sources with Tailwind is required. Consumers may bring their own layout styles through className and override semantic variables intentionally. React and React DOM are peers and are not bundled.

## Public contracts

Foundation exports its tokens as JSON at @want-desyst/foundation/tokens.json and as the tokens JavaScript export. The assets export includes @want-desyst/foundation/assets/wallpapers.svg. Importing the JavaScript entry is safe during SSR.

React exports the existing accordion, alert, badge, breadcrumb, button, card, dialog, field, input, label, navigation menu, radio group, select, separator, sheet, skeleton, switch, tabs and textarea families. Their public variants and native element props remain available.

Shared compositions are BrandLogo, BrandLockup, MediaCard, ContactCard, ThemeToggle and CommentFeed. Each exports its props type. Supply product names, images, labels, URLs, locale, prepared comment authors and action callbacks. CommentFeed does not fetch, reorder or limit records. ThemeToggle is controlled through theme and onThemeChange; consumers own saved preferences, system-theme subscriptions and telemetry.

Set data-theme="light" or data-theme="dark" on the document root for explicit selection. Also toggle the dark class for class-based Tailwind states. Without an explicit choice, the stylesheet follows the system color preference.

## Optional effects

```ts
import { initInteractionEffects, burstConfetti, initBackgroundMotion } from '@want-desyst/foundation';

const disposeInteractions = initInteractionEffects();
const disposeBackground = initBackgroundMotion({ background, control });
const disposeConfetti = burstConfetti(clickedElement);

// Dispose when the owning page unmounts.
disposeInteractions();
disposeBackground();
disposeConfetti();
```

The background container uses the page-background class with one child element. The control supplies data-pause-label and data-play-label. Mount it outside the content flow inside a positioned, clipped page wrapper. The default storage key is want-background-motion; storageKey may override it. Keep this decoration outside administration and reading surfaces.

Effects do not subscribe to application download events or start downloads. Call confetti beside the native download action. Reduced motion, unsuitable pointers and forced colors disable decorative interaction effects.

## Develop and verify

```sh
bun install --frozen-lockfile
bun run build
bun run check
bun test tests
bun run test:ui
bun run test:consumer
bun run dev
```

The Astro showcase lives in apps/showcase and uses local fixtures. Browser checks cover keyboard focus, themes, RTL, controls and decorative-effect cleanup. Test reports and screenshots stay outside the source tree. The consumer check installs packed artifacts in a temporary separate project and removes that project afterward.

## Release

Build and verify the final candidate before publishing. Inspect both tarballs, keep only distribution files and license notices, and publish foundation before React with public access. Use the repository release tag v0.1.0 for the initial release. Never overwrite a published version; reconcile a registry response before retrying a timed-out publish.

The initial npm organization is want-desyst. Publishing requires a signed-in owner with the required npm authentication. Credentials never belong in source files. Registry availability is confirmed as part of release, separately from the source merge.

## Boundaries and licensing

Read AGENTS.md, DESIGN.md, GLOSSARY.md and docs/adr. Repository workflow configuration lives in docs/agents and can be edited directly.

The initial source is Want Wallpapers main at 27370a2b8228b54e0c1b9432f01373bc8bf000ef. The catalogue, backend, application routes, analytics and advertising stay there. Consumer adoption is tracked separately in https://github.com/andrey-krasheninnikov/want-wallpapers/issues/174.

MIT applies to this repository's code. Preserve the included font licenses and third-party notices. Brand resources retain their existing notices.

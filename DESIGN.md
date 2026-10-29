# Want Desyst visual contract

The first product theme preserves the approved Want Wallpapers presentation. Shared primitives use semantic tokens, filled neutral surfaces and compact typography. The source of truth is packages/foundation/tokens.json.

Graphite background is #141414, main text #E8E8E8 and the primary action #5962F0. Light and dark palettes retain the source values. Preserve the original SVG logo separately from semantic action colors.

Days One is the display face and Manrope is the body face. Japanese uses Noto Sans JP and Arabic uses Noto Sans Arabic. Fonts are local and optional through the fonts stylesheet. Body and inputs stay at least 16 px; labels stay at least 14 px. Controls retain 44 px touch targets.

Fields have 12 px corners, media and panels 24 px, prominent surfaces 32 px and CTA buttons capsule corners. Group content with fills, spacing and type. Outline variants remain filled; separators do not draw decorative rules. Focus retains the fill with a 2 px primary outline and 3 px offset. Forced colors use the system focus.

Liquid glass uses 68% neutral tint, 20 px blur and 120% saturation. Reading surfaces stay opaque. Reduced transparency, unsupported backdrop filtering and forced colors use opaque fills.

Component motion follows state changes: buttons compress on press, disclosure icons rotate, radio indicators appear, and tabs, accordions, dialogs, sheets and popovers animate on entry or exit. Use the existing 120 ms feedback and 180 ms transition tokens. Sheet movement follows its physical side; dialog centering and popover placement stay intact. Reduced motion removes these animations.

Card glow follows the source 2.6-second wave without tilt or movement. The wand follows active links and buttons, preserves selection and native cursors, and excludes ordinary text, editable fields and media. It emits at most three 12 px sparks with .45 peak opacity. Confetti lasts 800 ms and does not control downloads.

The background sphere is opt-in, with an explicit pause/resume control. It stops for hidden documents and reduced motion and disposes timers, observers and listeners. All decorative effects respect reduced motion, pointer capabilities and forced colors.

Use logical spacing, document direction and isolated technical text. Mirror navigation arrows in RTL, never artwork or logos. Keep the showcase useful at 320 px and demonstrate both themes, keyboard navigation and Arabic direction.

Typography has 17 presets backed by platform-neutral token values. Display headings keep Days One; body copy keeps Manrope, with the existing locale fonts. Body text remains at least 16 px and supporting text at least 14 px. The new scale is opt-in through Typography and Prose.

Feedback accents are identical in both themes: primary #5962F0, success #7DF04A, info #28D7F5, warning #FFD43B and error #FF526D. Status surfaces use those colors with #141414 ink. Separate text roles preserve readable inline status text on the light and dark canvas.

Toast and snackbar feedback form compact floating islands. The surface and copy follow the current theme; only the 32 px icon plate carries the status accent. Use an 18 px radius, a soft inset highlight and 44 px action targets. Desktop actions sit beside the message; narrow layouts move actions below it. Entry settles over 360 ms, the status icon follows over 420 ms, and exit takes 180 ms. Errors stay until dismissal unless the consumer supplies a duration.

Loaders, shimmer and Glow expose pause controls through their props. Glow combines a broad ambient halo with two expanding waves, staggered by 1.8 seconds over a 3.6-second cycle. Animate wave transforms and opacity; keep the blur and shadow geometry static. Text changes and snackbar entry and exit use short state animations. Reduced transparency preserves Glow and its waves. Reduced motion disables animated loops and transitions; forced colors keep functional indicators while hiding decorative glow.

The reusable Want interface skill lives in [skills/want-design/SKILL.md](skills/want-design/SKILL.md). Its references cover brand and UI, voice, motion, and React integration. Exact numeric values remain in the foundation tokens.

Consumers may set background wave-delay bounds and request a wave through want:background-shimmer on the background container. Manual requests restart only the light wave, preserve the other animation phases and respect the same pause and accessibility state.

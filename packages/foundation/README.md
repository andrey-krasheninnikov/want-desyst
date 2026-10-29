# @want-foundation/desyst-foundation

Shared design tokens, compiled styles, local fonts and brand resources. Import @want-foundation/desyst-foundation/styles.css and optionally @want-foundation/desyst-foundation/fonts.css. Read tokens through @want-foundation/desyst-foundation/tokens.json.

Browser effects are opt-in and return cleanup functions. Call burstConfetti with the clicked control; application events and downloads remain with the consumer.

See the repository README for usage, compatibility and release instructions.

## Want design skill

Install the bundled brand, UI/UX, motion, composition, and product-voice skill from the target project's root:

```sh
npx --yes --package=@want-foundation/desyst-foundation@0.2.0 want-design-install
```

The default destination is `.agents/skills/want-design`. Add `--global` for `~/.agents/skills/want-design`, or `--dest PATH` for another parent skills directory. Matching installations are unchanged; different installations are never overwritten. See the [repository instructions](https://github.com/andrey-krasheninnikov/want-desyst/tree/v0.2.0#Want-design-skill) for invocation and updates.

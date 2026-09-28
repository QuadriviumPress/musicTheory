# AGENTS.md

## Standard

This book follows the [QuadriviumPress MyST baseline](https://github.com/QuadriviumPress/bindery/blob/main/doc/myst-baseline.md) and the [presentation skill](https://github.com/QuadriviumPress/bindery/blob/main/skills/quadrivium-myst-presentation/SKILL.md).

## Commands

```bash
npm run start
npm run build
npm run verify
npm run check
```

`npm run check` is the production-equivalent verification and HTML build.

## Intentional differences

- `verify` runs `node scripts/verify-book.mjs`.
- `scripts/setup-pwa.mjs` uses theme color `#7a3553` so the installed app matches this book's branding.
- `package.json` `license` is `MIT` for the tooling. The textbook content license is `CC-BY-SA-4.0` in `myst.yml`.

## Presentation gap

Figures, captions, and quotations are raw HTML, and chapters have no `{exercise}` or `{solution}` directives. That older web-textbook markup is left in place until a later presentation pass.

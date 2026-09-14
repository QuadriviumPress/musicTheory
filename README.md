# Open Music Theory

This repository contains the MyST Markdown edition of **Open Music Theory**, an
open, interactive textbook for college-level music theory and aural skills.
The original Jekyll pages have been migrated into a structured MyST book while
preserving their figures, handouts, source files, audio, and embedded media.

## Develop locally

Use Node 22 and npm 10, then install the pinned dependencies:

```bash
npm ci
npm run start
```

The preview server watches the Markdown and configuration for changes.

## Validate and build

```bash
npm run verify
npm run check
npm run build
```

The production site is written to `_build/html`. For a GitHub Pages project
site, set its base path while building:

```bash
BASE_URL=/musicTheory npm run build
```

## Project structure

| Path | Purpose |
| --- | --- |
| `myst.yml` | Book metadata, table of contents, and theme configuration |
| `index.md` | Landing page |
| `chapters/` | Migrated and maintained textbook chapters |
| `assets/graphics/` | Figures, handouts, and notation source files |
| `assets/audio/` | Audio examples |
| `images/` | Site branding and landing-page imagery |
| `SOURCES.md` | Source and license attribution |
| `scripts/` and `pwa/` | Validation, build, and offline-reading support |

Textbook content is available under CC BY-SA 4.0. Template and build-system
code is available under the MIT License; see `LICENSE` and
`LICENSE-CONTENT.md`.

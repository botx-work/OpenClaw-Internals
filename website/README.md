# OpenClaw Repowiki Website

This is the Docusaurus documentation site for OpenClaw. Content is synced from the `../repowiki/` directory.

## Development

```bash
# 1. Sync content from repowiki source
node sync-docs.js

# 2. Start dev server
npm start
```

- English docs: http://localhost:3000/
- Chinese docs: http://localhost:3000/zh/快速开始

## Build & Deploy

```bash
# Build static site
npm run build

# Deploy to GitHub Pages
USE_SSH=true yarn deploy
# or
GIT_USER=<your-github-username> yarn deploy
```

## Content Sync

`sync-docs.js` handles all content synchronization:
- Copies `repowiki/en/content/` → `docs/`
- Copies `repowiki/zh/content/` → `docs-zh/`
- Sanitizes MDX (escapes invalid HTML tags, removes `<cite>` blocks)
- Applies sidebar ordering via `_category_.json` and `sidebar_position` frontmatter
- Regenerates `sidebars.ts` and `sidebars-zh.ts`

> `docs/` and `docs-zh/` are auto-generated. Do not edit them manually.

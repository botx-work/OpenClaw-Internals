# OpenClaw Internals

> **A comprehensive technical guide to remote control & stream platform architecture.**
> 深入理解 Openclaw 架构设计、自研通信协议与跨平台自动化控制实现。

[![Built with Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus-brightgreen)](https://docusaurus.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/Website-Live-blue)](https://openclaw-internals.botx.work/)

🌐 **Live Site**: https://openclaw-internals.botx.work/

**English** | [简体中文](README.zh.md)

## 📖 Overview

This repository contains the internal technical documentation for **OpenClaw** — a cross-platform personal AI gateway featuring a self-designed communication protocol, multi-channel messaging (WhatsApp, Telegram, Discord, Slack, iMessage, WeChat, and more), and cross-platform automation control. The docs are auto-generated from the **Repowiki** knowledge base and cover architecture design, protocol internals, and platform integration.

### Features

- 🌐 **Bilingual** — English (`/`) and Chinese (`/zh/`) documentation
- 📊 **Mermaid diagrams** — architecture charts rendered client-side
- 🔄 **Auto-sync** — one script syncs all content from the repowiki source
- 📁 **Structured sidebar** — ordered by the official repowiki topic hierarchy

## 📂 Repository Structure

```
OpenClaw-Insight/
├── repowiki/           # Source content (auto-updated by repowiki sync)
│   ├── en/content/     # English markdown docs
│   ├── zh/content/     # Chinese markdown docs
│   └── en/meta/        # Metadata (catalog structure, relations)
└── website/            # Docusaurus site
    ├── docs/           # Synced English docs (auto-generated)
    ├── docs-zh/        # Synced Chinese docs (auto-generated)
    ├── sync-docs.js    # Content sync & sanitization script
    ├── sidebars.ts     # Auto-generated English sidebar
    ├── sidebars-zh.ts  # Auto-generated Chinese sidebar
    └── docusaurus.config.ts
```

> ⚠️ `docs/` and `docs-zh/` are **auto-generated**. Do not edit them manually — run `node sync-docs.js` instead.

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/BotX-Work/OpenClaw-Insight.git
cd OpenClaw-Insight/website

# Install dependencies
npm install
```

### Sync Content from Repowiki

Before starting the dev server, sync the repowiki content into the Docusaurus docs directories:

```bash
node sync-docs.js
```

This script:
- Clears `docs/` and `docs-zh/` and repopulates them from `repowiki/`
- Sanitizes MDX (escapes unrecognized HTML tags, removes `<cite>` blocks)
- Generates `_category_.json` order files and `sidebar_position` frontmatter
- Regenerates `sidebars.ts` and `sidebars-zh.ts`

### Start Dev Server

```bash
npm start
# or
yarn start
```

The site will be available at:
- **English docs**: http://localhost:3000/
- **Chinese docs**: http://localhost:3000/zh/快速开始

### Build

```bash
npm run build
```

Static output is written to `build/`.

## 🌍 Deployment

### GitHub Pages (Recommended)

The site is configured to deploy to `https://openclaw.github.io/repowiki`.

**Using SSH:**
```bash
USE_SSH=true yarn deploy
```

**Using HTTPS:**
```bash
GIT_USER=<your-github-username> yarn deploy
```

This builds the site and pushes it to the `gh-pages` branch automatically.

### Manual / Other Hosts

Build the site and serve the `build/` directory with any static host (Vercel, Netlify, Cloudflare Pages, etc.):

```bash
npm run build
npx serve build/
```

## 🔄 Keeping Docs Up to Date

When the repowiki source is updated:

```bash
# From the website/ directory
node sync-docs.js

# Verify the output
npm start
```

If deploying automatically (CI/CD), add `node sync-docs.js` as a build step before `npm run build`.

## ⚙️ Configuration

Key files:

| File | Purpose |
|------|---------|
| `docusaurus.config.ts` | Site metadata, plugins, navbar |
| `sync-docs.js` | Content sync logic and MDX sanitization |
| `src/pages/index.tsx` | Root redirect to Getting Started |
| `src/css/custom.css` | Custom theme overrides |

## 📝 License

MIT © OpenClaw

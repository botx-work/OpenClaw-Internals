# OpenClaw Internals

> **A comprehensive technical guide to remote control & stream platform architecture.**
> 深入理解 Openclaw 架构设计、自研通信协议与跨平台自动化控制实现。

[![Built with Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus-brightgreen)](https://docusaurus.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/网站-在线-blue)](https://openclaw-internals.botx.work/)

🌐 **在线访问**: https://openclaw-internals.botx.work/

[English](README.md) | **简体中文**

## 📖 简介

本仓库是 **OpenClaw** 的内部技术文档站。OpenClaw 是一个跨平台的个人 AI 网关，具备自研通信协议、多通道消息接入（WhatsApp、Telegram、Discord、Slack、iMessage、微信等）和跨平台自动化控制能力。文档内容涵盖架构设计、协议原理与平台集成，由 **Repowiki** 知识库自动生成。

### 特性

- 🌐 **双语支持** — 英文（`/`）和中文（`/zh/`）文档
- 📊 **Mermaid 图表** — 架构图在浏览器中客户端渲染
- 🔄 **一键同步** — 一行命令将 repowiki 内容同步到站点
- 📁 **有序侧边栏** — 按官方 repowiki 的主题层级排列

## 📂 目录结构

```
OpenClaw-Insight/
├── repowiki/           # 源内容（由 repowiki 同步工具自动更新）
│   ├── en/content/     # 英文 Markdown 文档
│   ├── zh/content/     # 中文 Markdown 文档
│   └── en/meta/        # 元数据（目录结构、关联关系）
└── website/            # Docusaurus 站点
    ├── docs/           # 同步后的英文文档（自动生成，勿手动修改）
    ├── docs-zh/        # 同步后的中文文档（自动生成，勿手动修改）
    ├── sync-docs.js    # 内容同步 & MDX 清洗脚本
    ├── sidebars.ts     # 自动生成的英文侧边栏
    ├── sidebars-zh.ts  # 自动生成的中文侧边栏
    └── docusaurus.config.ts
```

> ⚠️ `docs/` 和 `docs-zh/` 均为**自动生成**，请勿手动编辑，应通过 `node sync-docs.js` 重新生成。

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm 或 yarn

### 安装依赖

```bash
git clone https://github.com/BotX-Work/OpenClaw-Insight.git
cd OpenClaw-Insight/website
npm install
```

### 同步 Repowiki 内容

启动开发服务器前，先将 repowiki 内容同步到 Docusaurus 文档目录：

```bash
node sync-docs.js
```

此脚本会：
- 清空并重建 `docs/` 和 `docs-zh/`
- 清洗 MDX（转义非标准 HTML 标签、移除 `<cite>` 引用块）
- 生成 `_category_.json` 排序文件和 `sidebar_position` 前置参数
- 重新生成 `sidebars.ts` 和 `sidebars-zh.ts`

### 启动开发服务器

```bash
npm start
```

打开浏览器访问：
- **英文文档**：http://localhost:3000/
- **中文文档**：http://localhost:3000/zh/快速开始

### 构建

```bash
npm run build
```

静态文件输出到 `build/` 目录。

## 🌍 部署

### Vercel（推荐）

站点已配置为部署到 `https://openclaw-internals.botx.work/`。

## 🔄 内容更新

当 repowiki 源内容更新后：

```bash
# 在 website/ 目录下执行
node sync-docs.js
npm start  # 预览验证
```

如需 CI/CD 自动部署，在 `npm run build` 前加一步 `node sync-docs.js` 即可。

## ⚙️ 配置文件说明

| 文件 | 作用 |
|------|------|
| `docusaurus.config.ts` | 站点元数据、插件、导航栏配置 |
| `sync-docs.js` | 内容同步逻辑和 MDX 清洗 |
| `src/pages/index.tsx` | 根路径重定向到"快速开始" |
| `src/css/custom.css` | 自定义主题样式 |

## 📝 许可证

MIT © OpenClaw

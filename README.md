# XION User Map Generator

A developer tool for quickly deploying and interacting with User Map and Treasury contracts on the XION blockchain.

## 🚀 What is this?

The XION User Map Generator is a web application that helps developers:

1. **Deploy Smart Contracts** - Easily deploy User Map and Treasury contracts to the XION blockchain
2. **Configure Frontend Projects** - Generate environment variables for your frontend applications
3. **Quick Start Development** - Choose between web and mobile frontend templates with one-click setup

## 🛠️ Technical Stack

- 🧱 **pnpm workspaces** for dependency management  
- ⚡ **Turborepo** for build orchestration  
- 🧪 **TypeScript** with strict settings  
- 🛠️ **Vite 6** for blazing-fast dev and build  
- 🌈 **Tailwind CSS 4** via `@tailwindcss/vite`  
- ⚛️ **React 19** with automatic runtime  
- 🔗 **Cosmos SDK** integration for XION blockchain interaction
- 🔐 **Abstraxion** for XION wallet authentication

---

## 🗂 Folder Structure

```
.
├── apps
│   └── web         # Main React app (Vite + Tailwind)
├── packages
│   ├── ui          # Shared component library
│   └── utils       # Shared utility functions
├── turbo.json      # Turbo task config
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🧰 Requirements

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io) v8+
- [Turbo](https://turbo.build/) v2.5+

---

## 📦 Install

```bash
pnpm install
```

---

## 🧪 Run Dev Server

```bash
pnpm dev
```

Starts the `apps/web` dev server (via Vite). UI and utils are linked locally and auto-watched.

---

## 🔨 Build All Packages

```bash
pnpm build
```

Builds all packages and apps using Turbo tasks, respecting dependency order.

---

## 📚 Packages

### 📦 `@my/ui`

- Built with `vite build`
- Uses Tailwind 4 via `@tailwindcss/vite`
- Generates type declarations with `vite-plugin-dts`
- CSS and components are exported
- Consumed by `apps/web`

### 🧰 `@my/utils`

- Built with `tsup`
- Outputs ESM-only code
- Typed with `tsup` and local `tsconfig`
- Consumed by `apps/web`

---

## ✅ Features

- Shared code across apps and packages with strict types
- ESM-first module resolution
- Modern Tailwind 4 (no PostCSS config)
- Works with Vite dev/build and tsc builds
- Fully local and reproducible (no external registry)

---

## 🔗 License

MIT

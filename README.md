# Basic Monorepo template

A modern, ESM-only monorepo starter built from scratch using the latest tooling:

- 🧱 **pnpm workspaces** for dependency management  
- ⚡ **Turborepo** for build orchestration  
- 🧪 **TypeScript** with strict settings  
- 🛠️ **Vite 6** for blazing-fast dev and build  
- 🌈 **Tailwind CSS 4** via `@tailwindcss/vite`  
- ⚛️ **React 19** with automatic runtime  
- 📦 Shared packages: `@my/ui` and `@my/utils`

> This is a from-scratch setup with zero legacy overhead — designed to power design systems, app frontends, tooling, and future dapps.

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

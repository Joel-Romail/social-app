# CLAUDE.md

## Project Overview

Social App — a Next.js 16 web application built with React 19, TypeScript, and Tailwind CSS v4. Uses the Next.js App Router. Currently in early development (v0.1.0).

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19.2.3 with React Compiler enabled
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Language:** TypeScript 5 (strict mode)
- **Linting:** ESLint 9 with `eslint-config-next` (core-web-vitals + typescript)
- **Package manager:** npm

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
    layout.tsx      # Root layout (fonts, metadata, global providers)
    page.tsx        # Home page
    globals.css     # Global styles and Tailwind imports
public/             # Static assets served at /
```

This is a single-package project (not a monorepo).

## Common Commands

```bash
npm run dev       # Start dev server (next dev)
npm run build     # Production build (next build)
npm run start     # Start production server (next start)
npm run lint      # Run ESLint
```

## Key Conventions

- **Path aliases:** Use `@/*` to import from `src/*` (e.g., `import Foo from '@/components/Foo'`)
- **App Router:** All routes live under `src/app/`. Use file-based routing conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.)
- **React Compiler:** Enabled in `next.config.ts` — avoid manual `useMemo`/`useCallback` unless profiling shows the compiler misses an optimization
- **Tailwind v4:** Configured via PostCSS plugin; theme customization is done with CSS variables in `globals.css`, not a `tailwind.config` file
- **TypeScript strict mode:** All code must pass strict type checking
- **ESLint flat config:** Configuration in `eslint.config.mjs` using the new flat config format

## No Testing Framework Yet

No test runner (Jest, Vitest, etc.) is currently configured. When adding tests, prefer Vitest for its native TypeScript and ESM support with Next.js.

## No CI/CD Yet

No GitHub Actions or other CI pipelines are configured.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev          # Start dev server
npm run build        # Type-check + build to docs/
npm run build-only   # Build without type-check
npm run type-check   # Run vue-tsc type checking
npm run lint         # Run oxlint then eslint (both with --fix)
npm run format       # Prettier format src/
npm run preview      # Preview production build
```

> No test suite is configured yet.

## Architecture

A Vue 3 + TypeScript + Vite SPA. The build output goes to `docs/` (not `dist/`) for GitHub Pages deployment.

**Stack:** Vue 3 (Composition API, `<script setup>`), Pinia, Vue Router, Tailwind CSS v4 (Vite plugin), TypeScript, ESLint + oxlint + Prettier.

**Data flow:** All recipe data is static JSON imported directly from `src/mock/recipe.json`. The `src/composables/useRecipe.ts` composable exists but is currently empty — `src/views/Recipe.vue` imports the JSON directly. The recipe JSON schema includes: metadata, timings, ingredients (grouped with pricing), steps (referencing ingredient IDs), cost breakdown, nutrition, storage.

**Current app structure:**
- `App.vue` — renders `<Navbar>` + `<Recipe>` directly (no router-view yet; router is mounted but has no routes)
- `src/views/Recipe.vue` — the main recipe card view with print support, ingredient list with costs, and step-by-step method
- `src/components/Navbar.vue` — sticky top bar ("MILLE FICHES" branding)
- `src/stores/counter.ts` — scaffold Pinia store (unused placeholder)
- `@` alias resolves to `src/`

**Linting:** Two-pass linting — oxlint runs first (`-D correctness`), then ESLint with `eslint-plugin-oxlint` to skip rules already covered by oxlint. Prettier is separate from lint (run `format` explicitly).

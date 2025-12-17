# fiche-patisserie

A small Vue + Vite app that displays technical recipe sheets for pastry chefs — ingredient lists, steps, and metadata presented as simple, printable cards.

## About

This project is a lightweight front-end application intended to display clear, printable recipe sheets ("fiches techniques") for patisserie professionals. It uses mock data for quick iteration and is built with **Vue 3**, **TypeScript**, and **Vite**.

## Key features ✅

- Display pastry recipe sheets (title, ingredients, steps, timings, and metadata)
- Mock data stored in `mock/recipe.json` for quick testing
- Built with `Vue 3`, `TypeScript`, and `Vite`

## Quick start 🔧

1. Install dependencies:
```sh
npm install
```
2. Run the dev server:
```sh
npm run dev
```
3. Build for production:
```sh
npm run build
```

## Editing recipes ✏️

- Update or add recipes in `mock/recipe.json`.
- Main view: `src/views/Recipe.vue` and composable logic in `src/composables/useRecipe.ts`.

## Contributing 🤝

- Fork the repo, create a feature branch, and open a pull request with a short description of your changes.


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

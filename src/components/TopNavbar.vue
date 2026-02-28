<template>
  <header class="border-b border-gray-300 bg-white py-4 sticky top-0 z-10">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <button class="p-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
          <circle cx="6" cy="6" r="6" fill="none" stroke-width="1"></circle>
          <path fill="none" stroke-width="1" d="M10.5 10.5 L16 16"></path>
        </svg>
      </button>
      <RouterLink to="/">
        <div class="text-2xl font-bold">MILLE FICHES</div>
      </RouterLink>

      <nav class="flex items-center gap-4 text-sm font-medium">
        <RouterLink to="/" class="hover:opacity-60 transition-opacity">Fiches</RouterLink>
        <RouterLink to="/recipes" class="hover:opacity-60 transition-opacity">Recettes</RouterLink>
        <RouterLink to="/ingredients" class="hover:opacity-60 transition-opacity">Ingrédients</RouterLink>
      </nav>
    </div>
  </header>

</template>

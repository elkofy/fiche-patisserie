<template>
  <header class="border-b border-gray-300 bg-white py-4 sticky top-0 z-10">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <button class="p-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 16 16">
          <circle cx="6" cy="6" r="6" fill="none" stroke-width="1"></circle>
          <path fill="none" stroke-width="1" d="M10.5 10.5 L16 16"></path>
        </svg>
      </button>

      <nav class="flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-2xl font-bold hover:opacity-70 transition-opacity"
        >
          MILLE FICHES
        </RouterLink>
        <RouterLink
          to="/"
          class="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          active-class="font-bold text-black"
        >
          Fiches
        </RouterLink>
        <RouterLink
          to="/recipes"
          class="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          active-class="font-bold text-black"
        >
          Recettes
        </RouterLink>
        <RouterLink
          to="/ingredients"
          class="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          active-class="font-bold text-black"
        >
          Ingrédients
        </RouterLink>
      </nav>

      <RouterLink
        to="/technicalsheets/new"
        class="bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
      >
        + Nouvelle fiche
      </RouterLink>
    </div>
  </header>
</template>

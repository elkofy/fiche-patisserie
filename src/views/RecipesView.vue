<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'

const store = useRecipesStore()
const { list, loading, error } = storeToRefs(store)

onMounted(() => store.fetchAll())

async function handleDelete(id: number) {
  if (confirm('Supprimer cette recette ?')) {
    await store.remove(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold mark w-fit">Recettes</h1>
        <RouterLink
          to="/recipes/new"
          class="bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + Nouvelle recette
        </RouterLink>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-16">Chargement…</div>

      <div v-else-if="error" class="text-red-600 text-center py-16">{{ error }}</div>

      <div v-else-if="list.length === 0" class="text-gray-400 text-center py-16">
        Aucune recette. Créez-en une !
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          v-for="recipe in list"
          :key="recipe.ID"
          class="border border-gray-400 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="py-4 px-4 text-lg font-black text-center uppercase border-b-3 border-black">
            {{ recipe.name }}
          </div>

          <div v-if="recipe.image" class="h-36 overflow-hidden">
            <img :src="recipe.image" :alt="recipe.name" class="w-full h-full object-cover" />
          </div>

          <div class="p-4">
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ recipe.description }}</p>

            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in recipe.tags"
                :key="tag"
                class="px-2 py-1 text-xs border border-gray-400 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="text-xs text-gray-500 mb-4 space-y-1">
              <div v-if="recipe.timings?.totalTime">
                Durée : {{ recipe.timings.totalTime }} min
              </div>
              <div v-if="recipe.yield?.servings">
                Portions : {{ recipe.yield.servings }}
              </div>
              <div v-if="recipe.recipeIngredients?.length">
                {{ recipe.recipeIngredients.length }} ingrédient(s)
              </div>
            </div>

            <div class="flex gap-2">
              <RouterLink
                :to="`/recipes/${recipe.ID}`"
                class="flex-1 text-center bg-gray-800 text-white rounded-full px-3 py-2 text-sm font-medium hover:opacity-80"
              >
                Voir
              </RouterLink>
              <RouterLink
                :to="`/recipes/${recipe.ID}/edit`"
                class="flex-1 text-center bg-white border border-black text-black rounded-full px-3 py-2 text-sm font-medium hover:opacity-70"
              >
                Modifier
              </RouterLink>
              <button
                class="text-red-600 hover:opacity-70 text-sm px-2"
                @click="handleDelete(recipe.ID)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

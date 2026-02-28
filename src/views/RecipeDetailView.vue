<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const { current: recipe, loading, error } = storeToRefs(store)

onMounted(() => store.fetchOne(Number(route.params.id)))

async function handleDelete() {
  if (recipe.value && confirm('Supprimer cette recette ?')) {
    await store.remove(recipe.value.ID)
    router.push('/recipes')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div v-if="loading" class="text-gray-500 text-center py-16">Chargement…</div>

    <div v-else-if="error" class="text-red-600 text-center py-16">{{ error }}</div>

    <template v-else-if="recipe">
      <!-- Hero -->
      <section class="grid grid-cols-1 lg:grid-cols-2 my-4 container mx-auto px-4 gap-12">
        <div
          v-if="recipe.image"
          class="h-32 lg:h-80 lg:row-start-1 lg:col-start-2 overflow-hidden rounded-lg"
        >
          <img :src="recipe.image" :alt="recipe.name" class="w-full h-full object-cover" />
        </div>

        <div class="flex flex-col justify-center py-8 lg:pr-10">
          <div class="flex gap-2 mb-4">
            <RouterLink
              :to="`/recipes/${recipe.ID}/edit`"
              class="bg-white border border-black text-black rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-70"
            >
              Modifier
            </RouterLink>
            <button
              class="text-red-600 hover:opacity-70 text-sm px-3 py-2 border border-red-200 rounded-full"
              @click="handleDelete"
            >
              Supprimer
            </button>
          </div>

          <h1 class="text-4xl font-bold mb-3 tracking-tight">{{ recipe.name }}</h1>
          <p class="text-lg text-gray-600 mb-5">{{ recipe.description }}</p>

          <div class="flex flex-wrap gap-2 mb-5">
            <span
              v-for="tag in recipe.tags"
              :key="tag"
              class="px-3 py-2 text-xs font-medium border border-gray-400 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <div class="text-sm space-y-1">
            <div v-if="recipe.mold?.shape">
              Moule : {{ recipe.mold.shape }}
              <template v-if="recipe.mold.dimensions?.length">
                Ø{{ recipe.mold.dimensions.length }}cm
              </template>
            </div>
            <div v-if="recipe.yield?.servings">
              Portions : {{ recipe.yield.servings }}
            </div>
            <div v-if="recipe.timings?.totalTime">
              Durée totale : {{ recipe.timings.totalTime }} min
            </div>
          </div>
        </div>
      </section>

      <div class="w-full border-b border-gray-300 mb-4"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        <!-- Ingredients -->
        <div class="lg:col-span-1">
          <div class="border border-gray-400 rounded-2xl overflow-hidden">
            <div class="py-4 px-4 text-lg font-black text-center uppercase border-b-3 border-black">
              Ingrédients
            </div>
            <div class="p-5">
              <ul class="space-y-3">
                <li
                  v-for="ri in recipe.recipeIngredients"
                  :key="ri.ingredientId"
                  class="flex justify-between items-center"
                >
                  <span class="text-gray-600 text-sm">
                    {{ ri.ingredient?.name ?? `Ingrédient #${ri.ingredientId}` }}
                    <span v-if="ri.notes" class="text-xs text-gray-400 ml-1">({{ ri.notes }})</span>
                  </span>
                  <span class="text-sm font-medium">{{ ri.quantity }} {{ ri.unit }}</span>
                </li>
              </ul>

              <div
                v-if="!recipe.recipeIngredients?.length"
                class="text-gray-400 text-sm"
              >
                Aucun ingrédient.
              </div>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold mb-8 mark w-fit">Méthode</h2>
          <div class="space-y-8">
            <div
              v-for="step in recipe.steps"
              :key="step.order"
            >
              <h4 class="text-lg font-bold mb-2">
                Étape {{ step.order }} : {{ step.title }}
              </h4>
              <p class="text-gray-600 mb-1">{{ step.description }}</p>
              <p v-if="step.duration" class="text-sm text-gray-400">
                Durée : {{ step.duration }} min
              </p>
              <p v-if="step.notes" class="text-sm text-gray-500 italic mt-1">
                💡 {{ step.notes }}
              </p>
            </div>
            <div v-if="!recipe.steps?.length" class="text-gray-400">
              Aucune étape définie.
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

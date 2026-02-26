<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTechnicalSheetsStore } from '@/stores/technicalSheets'

const route = useRoute()
const router = useRouter()
const store = useTechnicalSheetsStore()
const { current: sheet, loading, error } = storeToRefs(store)

onMounted(() => store.fetchOne(Number(route.params.id)))

function handlePrint() {
  window.print()
}

async function handleDelete() {
  if (sheet.value && confirm('Supprimer cette fiche technique ?')) {
    await store.remove(sheet.value.id)
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div v-if="loading" class="text-gray-500 text-center py-16">Chargement…</div>

    <div v-else-if="error" class="text-red-600 text-center py-16">{{ error }}</div>

    <template v-else-if="sheet">
      <!-- Hero -->
      <section class="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 my-4 container mx-auto px-4 gap-12">
        <div
          v-if="sheet.image"
          class="h-32 lg:h-96 lg:row-start-1 lg:col-start-2 overflow-hidden rounded-lg lg:rounded-none"
        >
          <img :src="sheet.image" :alt="sheet.title" class="w-full h-full object-cover" />
        </div>

        <div
          class="container mx-auto px-4 lg:col-start-1 lg:col-end-2 flex flex-col justify-center py-8 lg:pr-10"
        >
          <div class="flex flex-row gap-2 mb-4">
            <button
              class="bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-80"
              @click="handlePrint"
            >
              🖨️
            </button>
            <RouterLink
              :to="`/technicalsheets/${sheet.id}/edit`"
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

          <h1 class="text-5xl font-bold mb-4 tracking-tight">{{ sheet.title }}</h1>
          <p class="text-xl text-gray-600 mb-6">{{ sheet.description }}</p>

          <div class="mb-6 flex flex-wrap gap-2">
            <span
              v-for="tag in sheet.tags"
              :key="tag"
              class="px-3 py-2 text-xs font-medium border border-gray-400 rounded-full hover:opacity-70"
            >
              {{ tag }}
            </span>
          </div>

          <div class="flex flex-col gap-1 text-sm">
            <div v-if="sheet.mold">
              Moule : {{ sheet.mold.shape }} Ø{{ sheet.mold.dimensions.length }}cm
            </div>
            <div v-if="sheet.yield?.servings">
              Portions : {{ sheet.yield.servings }}
              <span v-if="sheet.yield.portions?.type">{{ sheet.yield.portions.type }}</span>
            </div>
            <div v-if="sheet.timings?.totalTime">
              Durée : {{ sheet.timings.totalTime }} min
            </div>
            <div v-if="sheet.difficulty">Niveau : {{ sheet.difficulty }}</div>
          </div>
        </div>
      </section>

      <div class="w-full border-b border-gray-300 mb-4"></div>

      <!-- Recipes -->
      <div class="container mx-auto px-4 pb-12">
        <h2 class="text-2xl font-bold mb-6 mark w-fit">Recettes</h2>

        <div v-if="!sheet.recipes?.length" class="text-gray-400">
          Aucune recette associée.
        </div>

        <div v-else class="space-y-10">
          <div
            v-for="recipe in sheet.recipes"
            :key="recipe.id"
            class="border border-gray-400 rounded-2xl overflow-hidden"
          >
            <div class="py-4 px-4 text-lg font-black uppercase border-b-3 border-black">
              {{ recipe.name }}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
              <!-- Ingredients -->
              <div class="lg:col-span-1">
                <h4 class="text-base font-bold mb-4">Ingrédients</h4>
                <ul class="space-y-3">
                  <li
                    v-for="ri in recipe.recipeIngredients"
                    :key="ri.ingredientId"
                    class="flex justify-between items-center"
                  >
                    <span class="text-gray-600 text-sm">
                      {{ ri.ingredient?.name ?? `#${ri.ingredientId}` }}
                    </span>
                    <span class="text-sm font-medium">
                      {{ ri.quantity }} {{ ri.unit }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Steps -->
              <div class="lg:col-span-2">
                <h4 class="text-base font-bold mb-4 mark w-fit">Méthode</h4>
                <div class="space-y-6">
                  <div v-for="step in recipe.steps" :key="step.order">
                    <h5 class="font-bold mb-1">
                      Étape {{ step.order }} — {{ step.title }}
                    </h5>
                    <p class="text-gray-600 text-sm mb-1">{{ step.description }}</p>
                    <p v-if="step.duration" class="text-xs text-gray-400">
                      Durée : {{ step.duration }} min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

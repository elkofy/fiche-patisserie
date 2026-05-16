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
      <section class="container mx-auto px-4 py-8 max-w-3xl">
        <div v-if="recipe.imageUrl" class="h-56 rounded-2xl overflow-hidden mb-6">
          <img :src="recipe.imageUrl" :alt="recipe.name" class="w-full h-full object-cover" />
        </div>

        <div class="flex gap-2 mb-6">
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

        <h1 class="text-4xl font-bold mb-4 tracking-tight">{{ recipe.name }}</h1>

        <div class="text-sm text-gray-600 space-y-1 mb-6">
          <div v-if="recipe.timings?.totalTime">
            Durée totale : {{ recipe.timings.totalTime }} min
          </div>
        </div>

        <!-- Équipements -->
        <div v-if="recipe.equipements?.length" class="mb-6">
          <h2 class="text-sm font-medium mb-2">Équipements</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="eq in recipe.equipements"
              :key="eq"
              class="px-3 py-1 text-xs border border-gray-400 rounded-full"
            >
              {{ eq }}
            </span>
          </div>
        </div>
      </section>

      <div class="w-full border-b border-gray-300"></div>

      <!-- Content -->
      <div class="container mx-auto px-4 max-w-3xl grid grid-cols-1 lg:grid-cols-3 gap-12 py-10">
        <!-- Ingrédients -->
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
                  </span>
                  <span class="text-sm font-medium">{{ ri.quantity }}</span>
                </li>
              </ul>
              <div v-if="!recipe.recipeIngredients?.length" class="text-gray-400 text-sm">
                Aucun ingrédient.
              </div>
            </div>
          </div>
        </div>

        <!-- Étapes -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold mb-8 mark w-fit">Méthode</h2>
          <div class="space-y-8">
            <div v-for="(step, idx) in recipe.steps" :key="idx">
              <h4 class="text-lg font-bold mb-2">
                Étape {{ idx + 1 }} — {{ step.verb }}
              </h4>
              <p class="text-gray-600 mb-1">{{ step.actionDetail }}</p>
              <a
                v-if="step.videoUrl"
                :href="step.videoUrl"
                target="_blank"
                class="text-sm text-blue-600 hover:underline"
              >
                Voir la vidéo
              </a>
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

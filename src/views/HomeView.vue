<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useTechnicalSheetsStore } from '@/stores/technicalSheets'

const store = useTechnicalSheetsStore()
const { list, loading, error } = storeToRefs(store)

onMounted(() => store.fetchAll())

async function handleDelete(id: number) {
  if (confirm('Supprimer cette fiche technique ?')) {
    await store.remove(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold mark w-fit">Fiches Techniques</h1>
        <RouterLink
          to="/technicalsheets/new"
          class="bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + Nouvelle fiche
        </RouterLink>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-16">Chargement…</div>

      <div v-else-if="error" class="text-red-600 text-center py-16">{{ error }}</div>

      <div v-else-if="list.length === 0" class="text-gray-400 text-center py-16">
        Aucune fiche technique. Créez-en une !
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          v-for="sheet in list"
          :key="sheet.ID"
          class="border border-gray-400 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="py-4 px-4 text-lg font-black text-center uppercase border-b-3 border-black">
            {{ sheet.title }}
          </div>

          <div v-if="sheet.image" class="h-40 overflow-hidden">
            <img :src="sheet.image" :alt="sheet.title" class="w-full h-full object-cover" />
          </div>

          <div class="p-4">
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ sheet.description }}</p>

            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in sheet.tags"
                :key="tag"
                class="px-2 py-1 text-xs border border-gray-400 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="text-xs text-gray-500 mb-4 space-y-1">
              <div v-if="sheet.timings?.totalTime">Durée : {{ sheet.timings.totalTime }} min</div>
              <div v-if="sheet.yield?.servings">Portions : {{ sheet.yield.servings }}</div>
              <div v-if="sheet.difficulty">Niveau : {{ sheet.difficulty }}</div>
            </div>

            <div class="flex gap-2">
              <RouterLink
                :to="`/technicalsheets/${sheet.ID}`"
                class="flex-1 text-center bg-gray-800 text-white rounded-full px-3 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Voir
              </RouterLink>
              <RouterLink
                :to="`/technicalsheets/${sheet.ID}/edit`"
                class="flex-1 text-center bg-white border border-black text-black rounded-full px-3 py-2 text-sm font-medium hover:opacity-70 transition-opacity"
              >
                Modifier
              </RouterLink>
              <button
                class="text-red-600 hover:opacity-70 text-sm px-2"
                @click="handleDelete(sheet.ID)"
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

<style>
.mark {
  --mark-color: #f8db75;
  --mark-skew: 0.25em;
  --mark-height: 1em;
  --mark-overlap: 0.3em;
  margin-inline: calc(var(--mark-overlap) * -1);
  padding-inline: var(--mark-overlap);
  background-color: transparent;
  background-image: linear-gradient(to bottom right, transparent 50%, var(--mark-color) 50%),
    linear-gradient(var(--mark-color), var(--mark-color)),
    linear-gradient(to top left, transparent 50%, var(--mark-color) 50%);
  background-size:
    var(--mark-skew) var(--mark-height),
    calc(100% - var(--mark-skew) * 2 + 1px) var(--mark-height),
    var(--mark-skew) var(--mark-height);
  background-position:
    left center,
    center,
    right center;
  background-repeat: no-repeat;
  color: inherit;
}
</style>

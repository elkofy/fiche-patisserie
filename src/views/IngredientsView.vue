<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useIngredientsStore } from '@/stores/ingredients'

const store = useIngredientsStore()
const { list, loading, error } = storeToRefs(store)

onMounted(() => store.fetchAll())

async function handleDelete(id: number) {
  if (confirm('Supprimer cet ingrédient ?')) {
    await store.remove(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold mark w-fit">Ingrédients</h1>
        <RouterLink
          to="/ingredients/new"
          class="bg-gray-800 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          + Nouvel ingrédient
        </RouterLink>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-16">Chargement…</div>

      <div v-else-if="error" class="text-red-600 text-center py-16">{{ error }}</div>

      <div v-else-if="list.length === 0" class="text-gray-400 text-center py-16">
        Aucun ingrédient enregistré.
      </div>

      <div v-else class="border border-gray-400 rounded-2xl overflow-hidden">
        <div class="py-4 px-4 text-lg font-black uppercase border-b-3 border-black">
          Liste des ingrédients
        </div>

        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
              <th class="px-4 py-3">Nom</th>
              <th class="px-4 py-3">Catégorie</th>
              <th class="px-4 py-3">Unité</th>
              <th class="px-4 py-3">Prix unitaire</th>
              <th class="px-4 py-3">Allergènes</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ing in list"
              :key="ing.ID"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium">{{ ing.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ ing.category ?? '—' }}</td>
              <td class="px-4 py-3 text-gray-600">{{ ing.unit }}</td>
              <td class="px-4 py-3 text-gray-600">{{ ing.unitPrice.toFixed(2) }} €</td>
              <td class="px-4 py-3">
                <span v-if="ing.allergen" class="px-2 py-0.5 text-xs border border-gray-300 rounded-full">
                  {{ ing.allergen }}
                </span>
                <span v-else class="text-gray-400">—</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-3 justify-end">
                  <RouterLink
                    :to="`/ingredients/${ing.ID}/edit`"
                    class="text-gray-600 hover:text-black text-xs underline"
                  >
                    Modifier
                  </RouterLink>
                  <button
                    class="text-red-600 hover:opacity-70 text-xs"
                    @click="handleDelete(ing.ID)"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

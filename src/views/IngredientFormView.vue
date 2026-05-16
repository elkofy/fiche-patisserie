<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useIngredientsStore } from '@/stores/ingredients'
import * as api from '@/services/api'

const route = useRoute()
const router = useRouter()
const store = useIngredientsStore()
const { loading, error } = storeToRefs(store)

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

const name = ref('')
const unit = ref('g')
const unitPrice = ref(0)
const category = ref('')
const allergensRaw = ref('')

onMounted(async () => {
  if (isEdit.value) {
    const ing = await api.getIngredient(id.value)
    if (ing) {
      name.value = ing.name
      unit.value = ing.unit
      unitPrice.value = ing.unitPrice
      category.value = ing.category ?? ''
      allergensRaw.value = ing.allergen ?? ''
    }
  }
})

async function handleSubmit() {
  const payload = {
    name: name.value,
    unit: unit.value,
    unitPrice: unitPrice.value,
    category: category.value || undefined,
    allergen: allergensRaw.value.trim() || undefined,
  }

  if (isEdit.value) {
    await store.update(id.value, payload)
    if (!store.error) router.push('/ingredients')
  } else {
    const created = await store.create(payload)
    if (created) router.push('/ingredients')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8 max-w-lg">
      <h1 class="text-2xl font-bold mb-8 mark w-fit">
        {{ isEdit ? 'Modifier l\'ingrédient' : 'Nouvel ingrédient' }}
      </h1>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium mb-1">Nom *</label>
          <input
            v-model="name"
            required
            data-testid="ingredient-name"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Farine de blé"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Unité *</label>
            <input
              v-model="unit"
              required
              data-testid="ingredient-unit"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              placeholder="g, kg, L, pièce…"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Prix unitaire (€)</label>
            <input
              v-model.number="unitPrice"
              type="number"
              min="0"
              step="0.01"
              data-testid="ingredient-price"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Catégorie</label>
          <input
            v-model="category"
            data-testid="ingredient-category"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Farine, Produit laitier, Fruit…"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">
            Allergènes (séparés par des virgules)
          </label>
          <input
            v-model="allergensRaw"
            data-testid="ingredient-allergens"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Gluten, Lactose, Oeuf…"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="loading"
            data-testid="ingredient-submit"
            class="bg-gray-800 text-white rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-80 disabled:opacity-50"
          >
            {{ loading ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer' }}
          </button>
          <button
            type="button"
            class="bg-white border border-black text-black rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-70"
            @click="router.back()"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

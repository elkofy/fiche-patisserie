<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes'
import { useIngredientsStore } from '@/stores/ingredients'
import type { RecipeIngredient, Step } from '@/types/api'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()
const ingredientsStore = useIngredientsStore()
const { loading, error } = storeToRefs(recipesStore)
const { list: ingredientList } = storeToRefs(ingredientsStore)

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

// Form fields
const name = ref('')
const description = ref('')
const image = ref('')
const tagsRaw = ref('')
const totalTime = ref(60)
const servings = ref(4)

// Ingredients
const recipeIngredients = ref<RecipeIngredient[]>([])

function addIngredientRow() {
  recipeIngredients.value.push({
    ingredientId: 0,
    quantity: 0,
    unit: 'g',
    optional: false,
  })
}

function removeIngredientRow(index: number) {
  recipeIngredients.value.splice(index, 1)
}

// Steps
const steps = ref<Step[]>([])

function addStep() {
  steps.value.push({
    order: steps.value.length + 1,
    title: '',
    description: '',
    duration: 0,
    unit: 'minutes',
  })
}

function removeStep(index: number) {
  steps.value.splice(index, 1)
  steps.value.forEach((s, i) => { s.order = i + 1 })
}

onMounted(async () => {
  await ingredientsStore.fetchAll()
  if (isEdit.value) {
    await recipesStore.fetchOne(id.value)
    const r = recipesStore.current
    if (r) {
      name.value = r.name
      description.value = r.description
      image.value = r.image ?? ''
      tagsRaw.value = (r.tags ?? []).join(', ')
      totalTime.value = r.timings?.totalTime ?? 60
      servings.value = r.yield?.servings ?? 4
      recipeIngredients.value = r.recipeIngredients?.map((ri) => ({ ...ri })) ?? []
      steps.value = r.steps?.map((s) => ({ ...s })) ?? []
    }
  }
})

async function handleSubmit() {
  const payload = {
    name: name.value,
    description: description.value,
    image: image.value || undefined,
    tags: tagsRaw.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    timings: {
      totalTime: totalTime.value,
      totalUnit: 'minutes',
    },
    yield: {
      servings: servings.value,
      portions: { type: 'portion', quantity: servings.value },
    },
    recipeIngredients: recipeIngredients.value.filter((ri) => ri.ingredientId > 0),
    steps: steps.value,
    mold: undefined,
  }

  if (isEdit.value) {
    await recipesStore.update(id.value, payload)
    if (!recipesStore.error) router.push(`/recipes/${id.value}`)
  } else {
    const created = await recipesStore.create(payload)
    if (created) router.push(`/recipes/${created.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <h1 class="text-2xl font-bold mb-8 mark w-fit">
        {{ isEdit ? 'Modifier la recette' : 'Nouvelle recette' }}
      </h1>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Basic info -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom *</label>
          <input
            v-model="name"
            required
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Crème pâtissière"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="description"
            rows="2"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">URL image</label>
          <input
            v-model="image"
            type="url"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Tags (séparés par des virgules)</label>
          <input
            v-model="tagsRaw"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Durée totale (min)</label>
            <input
              v-model.number="totalTime"
              type="number"
              min="1"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Portions</label>
            <input
              v-model.number="servings"
              type="number"
              min="1"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
        </div>

        <!-- Ingredients -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium">Ingrédients</label>
            <button
              type="button"
              class="bg-white border border-black text-black rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-70"
              @click="addIngredientRow"
            >
              + Ajouter
            </button>
          </div>

          <div v-if="recipeIngredients.length === 0" class="text-gray-400 text-sm">
            Aucun ingrédient ajouté.
          </div>

          <div class="space-y-3">
            <div
              v-for="(ri, idx) in recipeIngredients"
              :key="idx"
              class="flex gap-2 items-center"
            >
              <select
                v-model.number="ri.ingredientId"
                class="border border-gray-400 rounded-lg px-2 py-2 text-sm flex-1"
              >
                <option value="0" disabled>Choisir…</option>
                <option
                  v-for="ing in ingredientList"
                  :key="ing.id"
                  :value="ing.id"
                >
                  {{ ing.name }}
                </option>
              </select>
              <input
                v-model.number="ri.quantity"
                type="number"
                min="0"
                step="0.1"
                placeholder="Qté"
                class="border border-gray-400 rounded-lg px-2 py-2 w-20 text-sm"
              />
              <input
                v-model="ri.unit"
                placeholder="unit"
                class="border border-gray-400 rounded-lg px-2 py-2 w-16 text-sm"
              />
              <button
                type="button"
                class="text-red-600 hover:opacity-70 text-sm shrink-0"
                @click="removeIngredientRow(idx)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium">Étapes</label>
            <button
              type="button"
              class="bg-white border border-black text-black rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-70"
              @click="addStep"
            >
              + Ajouter une étape
            </button>
          </div>

          <div v-if="steps.length === 0" class="text-gray-400 text-sm">
            Aucune étape définie.
          </div>

          <div class="space-y-4">
            <div
              v-for="(step, idx) in steps"
              :key="idx"
              class="border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-500">Étape {{ step.order }}</span>
                <button
                  type="button"
                  class="text-red-600 hover:opacity-70 text-xs"
                  @click="removeStep(idx)"
                >
                  Supprimer
                </button>
              </div>
              <input
                v-model="step.title"
                placeholder="Titre de l'étape"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
              <textarea
                v-model="step.description"
                placeholder="Description…"
                rows="2"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
              <input
                v-model.number="step.duration"
                type="number"
                min="0"
                placeholder="Durée (min)"
                class="border border-gray-400 rounded-lg px-3 py-2 w-32 text-sm"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
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

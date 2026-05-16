<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes'
import { useIngredientsStore } from '@/stores/ingredients'
import type { RecipeIngredient, Step } from '@/types/api'
import ImageUpload from '@/components/ImageUpload.vue'
import VerbSelect from '@/components/VerbSelect.vue'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()
const ingredientsStore = useIngredientsStore()
const { loading, error } = storeToRefs(recipesStore)
const { list: ingredientList } = storeToRefs(ingredientsStore)

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

const name = ref('')
const imageUrl = ref('')
const totalTime = ref(60)
const equipements = ref<string[]>([])
const equipementInput = ref('')

function addEquipement() {
  const val = equipementInput.value.trim()
  if (val) {
    equipements.value.push(val)
    equipementInput.value = ''
  }
}

function removeEquipement(index: number) {
  equipements.value.splice(index, 1)
}

const recipeIngredients = ref<RecipeIngredient[]>([])

function addIngredientRow() {
  recipeIngredients.value.push({ ingredientId: 0, quantity: 0 })
}

function removeIngredientRow(index: number) {
  recipeIngredients.value.splice(index, 1)
}

const steps = ref<Step[]>([])

function addStep() {
  steps.value.push({ verb: 'Couper', actionDetail: '', videoUrl: '' })
}

function removeStep(index: number) {
  steps.value.splice(index, 1)
}

onMounted(async () => {
  await ingredientsStore.fetchAll()
  if (isEdit.value) {
    await recipesStore.fetchOne(id.value)
    const r = recipesStore.current
    if (r) {
      name.value = r.name
      imageUrl.value = r.imageUrl ?? ''
      totalTime.value = r.timings?.totalTime ?? 60
      equipements.value = r.equipements ?? []
      recipeIngredients.value = r.recipeIngredients?.map((ri) => ({ ...ri })) ?? []
      steps.value = r.steps?.map((s) => ({ ...s })) ?? []
    }
  }
})

async function handleSubmit() {
  const payload = {
    name: name.value,
    imageUrl: imageUrl.value,
    timings: { totalTime: totalTime.value },
    equipements: equipements.value,
    recipeIngredients: recipeIngredients.value.filter((ri) => ri.ingredientId > 0),
    steps: steps.value.map((s) => ({
      verb: s.verb,
      actionDetail: s.actionDetail,
      videoUrl: s.videoUrl || undefined,
    })),
  }

  if (isEdit.value) {
    await recipesStore.update(id.value, payload)
    if (!recipesStore.error) router.push(`/recipes/${id.value}`)
  } else {
    const created = await recipesStore.create(payload)
    if (created) router.push(`/recipes/${created.ID}`)
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
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom *</label>
          <input
            v-model="name"
            required
            data-testid="recipe-name"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Crème pâtissière"
          />
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <ImageUpload v-model="imageUrl" />
        </div>

        <!-- Durée totale -->
        <div>
          <label class="block text-sm font-medium mb-1">Durée totale (min)</label>
          <input
            v-model.number="totalTime"
            type="number"
            min="1"
            data-testid="recipe-time"
            class="border border-gray-400 rounded-lg px-3 py-2 w-48 text-sm"
          />
        </div>

        <!-- Équipements -->
        <div>
          <label class="block text-sm font-medium mb-2">Équipements</label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="equipementInput"
              placeholder="Robot pâtissier, cul-de-poule…"
              class="border border-gray-400 rounded-lg px-3 py-2 flex-1 text-sm"
              @keydown.enter.prevent="addEquipement"
            />
            <button
              type="button"
              class="bg-white border border-black text-black rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-70"
              @click="addEquipement"
            >
              + Ajouter
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(eq, idx) in equipements"
              :key="idx"
              class="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded-full text-sm"
            >
              {{ eq }}
              <button
                type="button"
                class="text-red-500 hover:opacity-70 ml-1 text-xs"
                @click="removeEquipement(idx)"
              >✕</button>
            </span>
          </div>
        </div>

        <!-- Ingrédients -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium">Ingrédients</label>
            <button
              type="button"
              data-testid="add-ingredient-btn"
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
              :data-testid="`ingredient-row-${idx}`"
              class="flex gap-2 items-center"
            >
              <select
                v-model.number="ri.ingredientId"
                class="border border-gray-400 rounded-lg px-2 py-2 text-sm flex-1"
              >
                <option value="0" disabled>Choisir…</option>
                <option v-for="ing in ingredientList" :key="ing.ID" :value="ing.ID">
                  {{ ing.name }}
                </option>
              </select>
              <input
                v-model.number="ri.quantity"
                type="number"
                min="0"
                step="0.1"
                placeholder="Qté"
                class="border border-gray-400 rounded-lg px-2 py-2 w-24 text-sm"
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

        <!-- Étapes -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium">Étapes</label>
            <button
              type="button"
              data-testid="add-step-btn"
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
              :data-testid="`step-row-${idx}`"
              class="border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-500">Étape {{ idx + 1 }}</span>
                <button
                  type="button"
                  class="text-red-600 hover:opacity-70 text-xs"
                  @click="removeStep(idx)"
                >
                  Supprimer
                </button>
              </div>
              <VerbSelect v-model="step.verb" />
              <textarea
                v-model="step.actionDetail"
                placeholder="Détail de l'action…"
                rows="2"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
              <input
                v-model="step.videoUrl"
                placeholder="URL vidéo (optionnel)"
                type="url"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            data-testid="recipe-submit"
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

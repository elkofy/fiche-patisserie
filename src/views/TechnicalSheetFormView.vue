<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTechnicalSheetsStore } from '@/stores/technicalSheets'
import { useRecipesStore } from '@/stores/recipes'
import type { Step } from '@/types/api'
import ImageUpload from '@/components/ImageUpload.vue'
import VerbSelect from '@/components/VerbSelect.vue'

const route = useRoute()
const router = useRouter()

const sheetsStore = useTechnicalSheetsStore()
const recipesStore = useRecipesStore()
const { loading, error } = storeToRefs(sheetsStore)
const { list: recipeList } = storeToRefs(recipesStore)

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

const name = ref('')
const description = ref('')
const imageUrl = ref('')
const conservation = ref('')
const servings = ref(8)
const portionType = ref<'Part' | 'Ramequin'>('Part')
const portionQuantity = ref(1)
const selectedRecipeIds = ref<number[]>([])
const finishingSteps = ref<Step[]>([])

function addFinishingStep() {
  finishingSteps.value.push({ verb: 'Couper', actionDetail: '', videoUrl: '' })
}

function removeFinishingStep(index: number) {
  finishingSteps.value.splice(index, 1)
}

onMounted(async () => {
  await recipesStore.fetchAll()
  if (isEdit.value) {
    await sheetsStore.fetchOne(id.value)
    const s = sheetsStore.current
    if (s) {
      name.value = s.name
      description.value = s.description
      imageUrl.value = s.imageUrl ?? ''
      conservation.value = s.conservation ?? ''
      servings.value = s.yield?.servings ?? 8
      portionType.value = s.yield?.portion?.type ?? 'Part'
      portionQuantity.value = s.yield?.portion?.quantity ?? 1
      selectedRecipeIds.value = (s.recipes ?? []).map((r) => r.ID)
      finishingSteps.value = (s.finishingSteps ?? []).map((step) => ({ ...step }))
    }
  }
})

async function handleSubmit() {
  const payload = {
    name: name.value,
    description: description.value,
    imageUrl: imageUrl.value || '',
    conservation: conservation.value,
    yield: {
      servings: servings.value,
      portion: { type: portionType.value, quantity: portionQuantity.value },
    },
    recipes: selectedRecipeIds.value.map((rid) => ({ ID: rid })) as never,
    finishingSteps: finishingSteps.value.map((s) => ({
      verb: s.verb,
      actionDetail: s.actionDetail,
      videoUrl: s.videoUrl || undefined,
    })),
  }

  if (isEdit.value) {
    await sheetsStore.update(id.value, payload)
    if (!sheetsStore.error) router.push(`/technicalsheets/${id.value}`)
  } else {
    const created = await sheetsStore.create(payload)
    if (created) router.push(`/technicalsheets/${created.ID}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <h1 class="text-2xl font-bold mb-8 mark w-fit">
        {{ isEdit ? 'Modifier la fiche' : 'Nouvelle fiche technique' }}
      </h1>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium mb-1">Nom *</label>
          <input
            v-model="name"
            required
            data-testid="sheet-name"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Tarte à la framboise"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="description"
            rows="3"
            data-testid="sheet-description"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
          />
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <ImageUpload v-model="imageUrl" />
        </div>

        <!-- Conservation -->
        <div>
          <label class="block text-sm font-medium mb-1">Conservation</label>
          <input
            v-model="conservation"
            data-testid="sheet-conservation"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="3 jours au réfrigérateur…"
          />
        </div>

        <!-- Rendement -->
        <div>
          <label class="block text-sm font-medium mb-2">Rendement</label>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Portions</label>
              <input
                v-model.number="servings"
                type="number"
                min="1"
                data-testid="sheet-servings"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Type</label>
              <select
                v-model="portionType"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              >
                <option value="Part">Part</option>
                <option value="Ramequin">Ramequin</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Quantité</label>
              <input
                v-model.number="portionQuantity"
                type="number"
                min="1"
                class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Recettes associées -->
        <div>
          <label class="block text-sm font-medium mb-2">Recettes associées</label>
          <div v-if="recipeList.length === 0" class="text-sm text-gray-400">
            Aucune recette disponible.
            <RouterLink to="/recipes/new" class="text-blue-600 hover:underline">
              Créer une recette
            </RouterLink>
          </div>
          <div v-else class="space-y-2">
            <label
              v-for="recipe in recipeList"
              :key="recipe.ID"
              class="flex items-center gap-2 cursor-pointer"
            >
              <input
                v-model="selectedRecipeIds"
                type="checkbox"
                :value="recipe.ID"
                class="rounded"
              />
              <span class="text-sm">{{ recipe.name }}</span>
            </label>
          </div>
        </div>

        <!-- Étapes de finition -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium">Étapes de finition</label>
            <button
              type="button"
              class="bg-white border border-black text-black rounded-full px-3 py-1.5 text-xs font-medium hover:opacity-70"
              @click="addFinishingStep"
            >
              + Ajouter
            </button>
          </div>

          <div v-if="finishingSteps.length === 0" class="text-gray-400 text-sm">
            Aucune étape de finition.
          </div>

          <div class="space-y-4">
            <div
              v-for="(step, idx) in finishingSteps"
              :key="idx"
              class="border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-500">Finition {{ idx + 1 }}</span>
                <button
                  type="button"
                  class="text-red-600 hover:opacity-70 text-xs"
                  @click="removeFinishingStep(idx)"
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

        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="loading"
            data-testid="sheet-submit"
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

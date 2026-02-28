<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTechnicalSheetsStore } from '@/stores/technicalSheets'
import { useRecipesStore } from '@/stores/recipes'

const route = useRoute()
const router = useRouter()

const sheetsStore = useTechnicalSheetsStore()
const recipesStore = useRecipesStore()
const { loading, error } = storeToRefs(sheetsStore)
const { list: recipeList } = storeToRefs(recipesStore)

const isEdit = computed(() => !!route.params.id)
const id = computed(() => Number(route.params.id))

const title = ref('')
const description = ref('')
const difficulty = ref('intermediate')
const image = ref('')
const tagsRaw = ref('')
const totalTime = ref(60)
const servings = ref(8)
const selectedRecipeIds = ref<number[]>([])

onMounted(async () => {
  await recipesStore.fetchAll()
  if (isEdit.value) {
    await sheetsStore.fetchOne(id.value)
    const s = sheetsStore.current
    if (s) {
      title.value = s.title
      description.value = s.description
      difficulty.value = s.difficulty
      image.value = s.image ?? ''
      tagsRaw.value = (s.tags ?? []).join(', ')
      totalTime.value = s.timings?.totalTime ?? 60
      servings.value = s.yield?.servings ?? 8
      selectedRecipeIds.value = (s.recipes ?? []).map((r) => r.ID)
    }
  }
})

async function handleSubmit() {
  const payload = {
    title: title.value,
    description: description.value,
    difficulty: difficulty.value,
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
    recipes: selectedRecipeIds.value.map((rid) => ({ id: rid })) as never,
    mold: undefined,
    categories: undefined,
    cost: undefined,
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
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-1">Titre *</label>
          <input
            v-model="title"
            required
            data-testid="sheet-title"
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

        <!-- Difficulty -->
        <div>
          <label class="block text-sm font-medium mb-1">Niveau</label>
          <select
            v-model="difficulty"
            data-testid="sheet-difficulty"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium mb-1">URL image</label>
          <input
            v-model="image"
            type="url"
            data-testid="sheet-image"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="https://…"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-1">Tags (séparés par des virgules)</label>
          <input
            v-model="tagsRaw"
            data-testid="sheet-tags"
            class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            placeholder="Fruit, Chocolat, Végétalien"
          />
        </div>

        <!-- Time & Servings -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Durée totale (min)</label>
            <input
              v-model.number="totalTime"
              type="number"
              min="1"
              data-testid="sheet-time"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Portions</label>
            <input
              v-model.number="servings"
              type="number"
              min="1"
              data-testid="sheet-servings"
              class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
            />
          </div>
        </div>

        <!-- Recipes -->
        <div>
          <label class="block text-sm font-medium mb-2">Recettes associées</label>
          <div
            v-if="recipeList.length === 0"
            class="text-sm text-gray-400"
          >
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

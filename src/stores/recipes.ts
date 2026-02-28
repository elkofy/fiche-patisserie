import { defineStore, acceptHMRUpdate } from 'pinia'
import { shallowRef, ref } from 'vue'
import type { Recipe } from '@/types/api'
import * as api from '@/services/api'

export const useRecipesStore = defineStore('recipes', () => {
  const list = shallowRef<Recipe[]>([])
  const current = ref<Recipe | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await api.getRecipes()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: number) {
    loading.value = true
    error.value = null
    try {
      current.value = await api.getRecipe(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Recipe, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>) {
    loading.value = true
    error.value = null
    try {
      const created = await api.createRecipe(data)
      list.value = [...list.value, created]
      return created
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: Partial<Omit<Recipe, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>>) {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateRecipe(id, data)
      list.value = list.value.map((r) => (r.ID === id ? updated : r))
      if (current.value?.ID === id) current.value = updated
      return updated
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function remove(id: number) {
    loading.value = true
    error.value = null
    try {
      await api.deleteRecipe(id)
      list.value = list.value.filter((r) => r.ID !== id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { list, current, loading, error, fetchAll, fetchOne, create, update, remove }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecipesStore, import.meta.hot))
}

import { defineStore, acceptHMRUpdate } from 'pinia'
import { shallowRef, ref } from 'vue'
import type { Ingredient } from '@/types/api'
import * as api from '@/services/api'

export const useIngredientsStore = defineStore('ingredients', () => {
  const list = shallowRef<Ingredient[]>([])
  const current = ref<Ingredient | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await api.getIngredients()
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
      current.value = await api.getIngredient(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
    loading.value = true
    error.value = null
    try {
      const created = await api.createIngredient(data)
      list.value = [...list.value, created]
      return created
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function update(id: number, data: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>) {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateIngredient(id, data)
      list.value = list.value.map((i) => (i.id === id ? updated : i))
      if (current.value?.id === id) current.value = updated
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
      await api.deleteIngredient(id)
      list.value = list.value.filter((i) => i.id !== id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { list, current, loading, error, fetchAll, fetchOne, create, update, remove }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIngredientsStore, import.meta.hot))
}

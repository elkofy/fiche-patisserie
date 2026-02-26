import { defineStore, acceptHMRUpdate } from 'pinia'
import { shallowRef, ref } from 'vue'
import type { TechnicalSheet } from '@/types/api'
import * as api from '@/services/api'

export const useTechnicalSheetsStore = defineStore('technicalSheets', () => {
  const list = shallowRef<TechnicalSheet[]>([])
  const current = ref<TechnicalSheet | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      list.value = await api.getTechnicalSheets()
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
      current.value = await api.getTechnicalSheet(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(data: Omit<TechnicalSheet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
    loading.value = true
    error.value = null
    try {
      const created = await api.createTechnicalSheet(data)
      list.value = [...list.value, created]
      return created
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function update(
    id: number,
    data: Partial<Omit<TechnicalSheet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
  ) {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateTechnicalSheet(id, data)
      list.value = list.value.map((s) => (s.id === id ? updated : s))
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
      await api.deleteTechnicalSheet(id)
      list.value = list.value.filter((s) => s.id !== id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { list, current, loading, error, fetchAll, fetchOne, create, update, remove }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTechnicalSheetsStore, import.meta.hot))
}

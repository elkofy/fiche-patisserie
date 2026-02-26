import type { Ingredient, Recipe, TechnicalSheet } from '@/types/api'

const BASE_URL = 'http://localhost:8080'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// --- Ingredients ---

export const getIngredients = () => request<Ingredient[]>('/ingredients')

export const getIngredient = (id: number) => request<Ingredient>(`/ingredients/${id}`)

export const createIngredient = (data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) =>
  request<Ingredient>('/ingredients', { method: 'POST', body: JSON.stringify(data) })

export const updateIngredient = (
  id: number,
  data: Partial<Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
) => request<Ingredient>(`/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteIngredient = (id: number) => request<void>(`/ingredients/${id}`, { method: 'DELETE' })

export const uploadIngredients = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return request<Ingredient[]>('/ingredients/upload', { method: 'POST', body: form, headers: {} })
}

// --- Recipes ---

export const getRecipes = () => request<Recipe[]>('/recipes')

export const getRecipe = (id: number) => request<Recipe>(`/recipes/${id}`)

export const createRecipe = (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) =>
  request<Recipe>('/recipes', { method: 'POST', body: JSON.stringify(data) })

export const updateRecipe = (
  id: number,
  data: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
) => request<Recipe>(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteRecipe = (id: number) => request<void>(`/recipes/${id}`, { method: 'DELETE' })

// --- TechnicalSheets ---

export const getTechnicalSheets = () => request<TechnicalSheet[]>('/technicalsheets')

export const getTechnicalSheet = (id: number) => request<TechnicalSheet>(`/technicalsheets/${id}`)

export const createTechnicalSheet = (
  data: Omit<TechnicalSheet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
) => request<TechnicalSheet>('/technicalsheets', { method: 'POST', body: JSON.stringify(data) })

export const updateTechnicalSheet = (
  id: number,
  data: Partial<Omit<TechnicalSheet, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
) => request<TechnicalSheet>(`/technicalsheets/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deleteTechnicalSheet = (id: number) =>
  request<void>(`/technicalsheets/${id}`, { method: 'DELETE' })

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

export const getIngredient = (id: number) => request<Ingredient>(`/ingredient/${id}`)

export const createIngredient = (data: Omit<Ingredient, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>) =>
  request<Ingredient>('/ingredient', { method: 'POST', body: JSON.stringify(data) })

export const updateIngredient = (
  id: number,
  data: Partial<Omit<Ingredient, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>>,
) => request<Ingredient>(`/ingredient/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteIngredient = (id: number) => request<void>(`/ingredient/${id}`, { method: 'DELETE' })

export const uploadIngredients = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return request<Ingredient[]>('/ingredients/upload', { method: 'POST', body: form, headers: {} })
}

// --- Recipes ---

export const getRecipes = () => request<Recipe[]>('/recipes')

export const getRecipe = (id: number) => request<Recipe>(`/recipe/${id}`)

export const createRecipe = (data: Omit<Recipe, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>) =>
  request<Recipe>('/recipe', { method: 'POST', body: JSON.stringify(data) })

export const updateRecipe = (
  id: number,
  data: Partial<Omit<Recipe, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>>,
) => request<Recipe>(`/recipe/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteRecipe = (id: number) => request<void>(`/recipe/${id}`, { method: 'DELETE' })

// --- TechnicalSheets ---

export const getTechnicalSheets = () => request<TechnicalSheet[]>('/technicalsheets')

export const getTechnicalSheet = (id: number) => request<TechnicalSheet>(`/technicalsheet/${id}`)

export const createTechnicalSheet = (
  data: Omit<TechnicalSheet, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>,
) => request<TechnicalSheet>('/technicalsheet', { method: 'POST', body: JSON.stringify(data) })

export const updateTechnicalSheet = (
  id: number,
  data: Partial<Omit<TechnicalSheet, 'ID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>>,
) => request<TechnicalSheet>(`/technicalsheet/${id}`, { method: 'PATCH', body: JSON.stringify(data) })

export const deleteTechnicalSheet = (id: number) =>
  request<void>(`/technicalsheet/${id}`, { method: 'DELETE' })

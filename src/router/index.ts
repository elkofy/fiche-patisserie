import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Recipe from '@/views/Recipe.vue'
import IngredientList from '@/views/Ingredients/IngredientList.vue'
import Ingredient from '@/views/Ingredients/Ingredient.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/technicalsheets/new',
      name: 'technicalsheet-new',
      component: () => import('@/views/TechnicalSheetFormView.vue'),
    },
    {
      path: '/technicalsheets/:id',
      name: 'technicalsheet-detail',
      component: () => import('@/views/TechnicalSheetDetailView.vue'),
    },
    {
      path: '/technicalsheets/:id/edit',
      name: 'technicalsheet-edit',
      component: () => import('@/views/TechnicalSheetFormView.vue'),
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('@/views/RecipesView.vue'),
    },
    {
      path: '/recipes/new',
      name: 'recipe-new',
      component: () => import('@/views/RecipeFormView.vue'),
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: () => import('@/views/RecipeDetailView.vue'),
    },
    {
      path: '/recipes/:id/edit',
      name: 'recipe-edit',
      component: () => import('@/views/RecipeFormView.vue'),
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: () => import('@/views/IngredientsView.vue'),
    },
    {
      path: '/ingredients/new',
      name: 'ingredient-new',
      component: () => import('@/views/IngredientFormView.vue'),
    },
    {
      path: '/ingredients/:id/edit',
      name: 'ingredient-edit',
      component: () => import('@/views/IngredientFormView.vue'),
    },
  ],
})

export default router

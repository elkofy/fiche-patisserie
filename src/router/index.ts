import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Recipe from '@/views/Recipe.vue'
import IngredientList from '@/views/Ingredients/IngredientList.vue'
import Ingredient from '@/views/Ingredients/Ingredient.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/home", component: Home },
    { path: "/recipe", component: Recipe },
    { path: "/ingredients", component: IngredientList },
    { path: '/ingredients/:id', component: Ingredient },
    { path: '/recipes/:id', component: Recipe },
  ],
})

export default router

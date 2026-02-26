<template>
    <div class="flex flex-row mx-auto gap-2 w-fit my-2">
        <button class="btn">Importer le mercurial</button>
        <button class="btn btn-accent">Ajouter un ingrédient</button>
    </div>
    <div class="grid grid-cols-3" v-if="isFinished">
        <div class="card w-96 bg-base-100 card-xl shadow-sm" v-for="ingredient in ingredients" :key="ingredient.ID">
            <div class="card-body">
                <h2 class="card-title">{{ ingredient.name }}</h2>
                <div class="flex flex-row gap-4 ">
                    <div>{{ ingredient.unitPrice }} €</div>
                    <div class="badge badge-primary">{{ ingredient.unit }}</div>
                </div>
                <div class="justify-end card-actions">
                    <button class="btn btn-primary"
                        @click="router.push(`/ingredients/${ingredient.ID}`)">Voir</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { useFetchTS } from '@/composables/useFetchTS';
import { useRouter } from 'vue-router';
const router = useRouter()
// const ingredients = ref([])
const { isFinished, data:ingredients } = useFetchTS('ingredients')

</script>

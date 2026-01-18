<template>
    <div class="flex flex-row mx-auto gap-2 w-fit my-2">
        <button class="btn">Importer le mercurial</button>
        <button class="btn btn-accent">Ajouter un ingrédient</button>
    </div>
    <div class="grid grid-cols-3">
        <div class="card w-96 bg-base-100 card-xl shadow-sm" v-for="ingredient in ingredients">
            <div class="card-body">
                <h2 class="card-title">{{ ingredient.name }}</h2>
                <div class="flex flex-row ">
                    <div>{{ ingredient.ttc_price }} €</div>
                    <div class="badge badge-primary">{{ ingredient.unit }}</div>
                </div>
                <div class="justify-end card-actions">
                    <button class="btn btn-primary"
                        @click="router.push(`/ingredients/${ingredient.uuid}`)">Voir</button>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const ingredients = ref([
    {
        uuid: 1,
        name: "Beurre de tourrage",
        label: "Beurre de tourage",
        allergen: "lactose",
        unit: "KG",
        ht_price: "12",
        ttc_price: "18",
        tva_rate: "5.5",
        supplier: "Metro"
    },
    {
        uuid: 2,
        name: "Bidon d'oeufs",
        label: "Bidon de jaue d'oeufs",
        allergen: "",
        unit: "L",
        ht_price: "5",
        ttc_price: "10",
        tva_rate: "5.5",
        supplier: "Metro"
    },
    {
        uuid: 3,
        name: "Farine T55",
        label: "Farine T55",
        allergen: "",
        unit: "KG",
        ht_price: "5",
        ttc_price: "10",
        tva_rate: "5.5",
        supplier: "Metro"
    },
])

// type Ingredient struct {
// 	UUID          uuid.UUID
// 	Name          string
// 	Label         string
// 	Allergen      string
// 	Unit          string
// 	HT_Price      float64
// 	TTC_price     float64
// 	TVA_rate      float64
// 	Supplier      string
// 	createdAt     time.Time
// 	lastUpdatedAt time.Time
// }

</script>
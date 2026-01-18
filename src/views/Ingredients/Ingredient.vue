<template>
    <div class="border border-black rounded-2xl overflow-hidden">
        <div v-for="(value, key) in ingredient">

            <fieldset class="fieldset">
                <legend class="fieldset-legend">{{ key }}</legend>
                <input type="text" class="input" v-model="ingredient[key]" placeholder="Type here" />
            </fieldset>
        </div>
        <!-- {{ ingredient.name }} -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const ingredient = ref(
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
    })
</script>
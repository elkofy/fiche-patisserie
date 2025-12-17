<script setup>
import { recipe } from '@/mock/recipe.json'

</script>

<template>

    <div class="min-h-screen bg-white">
        <!-- Header -->

        <!-- Hero Section -->
        <section
            class="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 my-4 container mx-auto px-4 gap-12 ">
            <div class="h-32 lg:h-96 lg:row-start-1 lg:col-start-2 overflow-hidden rounded-lg lg:rounded-none">
                <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover" />
                <!-- <img  class="w-full h-full object-cover" src="../assets/frambroise_sketch.png"></img> -->
            </div>

            <div class="container mx-auto px-4 lg:col-start-1 lg:col-end-2 flex flex-col justify-center py-8 lg:pr-10">
                <div class="flex flex-row gap-2 mb-2">
                    <button @click="print()" class="text-white bg-gray-800 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none w-fit"  >🖨️</button>
                    <button @click="" class="text-black bg-white box-border border border-black hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none w-fit"  >🥜 Allergenes</button>
                </div>

                
                <h1 class="text-5xl font-bold mb-4 tracking-tight">{{ recipe.title }}</h1>
                <p class="text-xl text-gray-600 mb-6">{{ recipe.description }}</p>

                <div class="mb-6">
                    <div class="flex flex-wrap gap-2">
                        <span v-for="(tag, i) in recipe.tags" :key="i"
                            class="px-3 py-2 text-xs font-medium border border-gray-400 rounded-full hover:opacity-70">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <div class=" flex flex-col ">
                    <div>Moule: {{ recipe.mold.shape }} Ø{{  recipe.mold.dimensions.length }}cm</div>
                    <div>Portions: {{ recipe.yield.servings }} {{ recipe.yield.portions.type }}</div>
                    <div>Durée: {{ recipe.timings.totalTime }} min</div>          
                </div>
            </div>
        </section>
<div class="w-full border-b border-gray-300 mb-4"></div>
        <!-- Main Content -->
        <div class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
            <!-- Ingredients -->
            <div class="lg:col-span-1">
                <!-- <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold mark">Ingrédients</h3>

                </div> -->

                <div class="border border-gray-400 rounded-2xl overflow-hidden">
                        <div @click="activeTab = 'component'" class="
                             py-4 px-4 text-lg font-black text-center uppercase border-b-3 border-black text-black w-full
                        ">
                            Ingredients
                    </div>

                    <div class="p-6 space-y-8">
                        <div v-for="(group, groupIdx) in recipe.ingredients" :key="groupIdx">
                            <h4 class="text-lg font-bold mb-4">{{ group.group }}</h4>
                            <ul class="space-y-4">
                                <li v-for="(item, itemIdx) in group.items" :key="itemIdx"
                                    class="flex justify-between items-center">
                                    <div class="flex-1">
                                        <div class="text-gray-600 flex items-center gap-2">
                                            {{ item.name }}
                                            <span v-if="item.tag"
                                                :class="['text-xs px-2 py-1 rounded-full', item.color]">
                                                {{ item.tag }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="text-left">
                                        <p class="font-medium">{{ item.quantity }} {{ item.unit }} |
                                            {{ Number.parseFloat(item.unitPrice).toFixed(2) }}€ </p>
                                        <p class="font-medium"></p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <hr>
                        </hr>
                        <div class="flex flex-col gap-2 ">
                            <div class="flex justify-between items-center">
                                <div class="flex-1 text-gray-600 flex items-center gap-2"> Ingredients:</div>
                                <div class="text-left">{{ recipe.cost.ingredients }}€</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex-1 text-gray-600 flex items-center gap-2"> Main d'oeuvre:</div>
                                <div class="text-left">{{ recipe.cost.labor }}€</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex-1 text-gray-600 flex items-center gap-2">  Prix unitaire :</div>
                                <div class="text-left">{{ recipe.cost.unitCost }}€</div>
                            </div>
                             <div class="flex justify-between items-center">
                                <div class="flex-1 font-bold flex items-center gap-2"> Total:</div>
                                <div class="text-left">{{ recipe.cost.total }}€</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="flex-1 text-green-800 flex items-center gap-2">Marge</div>
                                <div class="text-left">{{ Number.parseFloat(recipe.cost.margin).toFixed(2)  }}%</div>
                            </div>
                           
                        
                        </div>


                    </div>
                </div>

            </div>

            <!-- Steps -->
            <div class="lg:col-span-2">
                <h2 class="text-3xl font-bold mb-10 mark w-fit">Méthode</h2>
                <div class="space-y-12">
                    <div v-for="step in recipe.steps" :key="step.order" class="prose prose-lg max-w-none">
                        <h4 class="text-xl font-bold mb-3">
                            Étape {{ step.order }}: {{ step.title }}
                        </h4>
                        <p class="text-gray-600 mb-2">{{ step.description }}</p>
                        <p class="text-sm text-gray-500">Durée: {{ step.duration }} min</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <!-- <footer class="bg-black text-white py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p class="font-bold mb-4">LEARN.</p>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-4">LIENS</p>
              <ul class="space-y-3 text-sm">
                <li><a href="#" class="hover:text-gray-300">Recettes</a></li>
                <li><a href="#" class="hover:text-gray-300">Fondamentaux</a></li>
                <li><a href="#" class="hover:text-gray-300">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <p class="text-xs text-gray-400 mb-4">RÉSEAUX</p>
              <ul class="space-y-3 text-sm">
                <li><a href="#" class="hover:text-gray-300">YouTube</a></li>
                <li><a href="#" class="hover:text-gray-300">Instagram</a></li>
                <li><a href="#" class="hover:text-gray-300">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-700 pt-8 text-xs text-gray-400">
            <p>© 2024 Cook Well. All rights reserved.</p>
          </div>
        </div>
      </footer> -->
    </div>
</template>

<style>
    .mark {
	--mark-color: #f8db75;
	--mark-skew: 0.25em;
	--mark-height: 1em;
	--mark-overlap: 0.3em;

	margin-inline: calc(var(--mark-overlap) * -1);
	padding-inline: var(--mark-overlap);

	background-color: transparent;
	background-image:
		linear-gradient(
			to bottom right,
			transparent 50%,
			var(--mark-color) 50%
		),
		linear-gradient(
			var(--mark-color),
			var(--mark-color)
		),
		linear-gradient(
			to top left,
			transparent 50%,
			var(--mark-color) 50%
		)
	;
	background-size:
		var(--mark-skew) var(--mark-height),
		calc(100% - var(--mark-skew) * 2 + 1px) var(--mark-height),
		var(--mark-skew) var(--mark-height)
	;
	background-position:
		left center,
		center,
		right center
	;
	background-repeat: no-repeat;
	color: inherit;
}
</style>
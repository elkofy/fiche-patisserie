<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { Verb } from '@/types/api'
import { VERBS } from '@/types/api'

const props = defineProps<{ modelValue: Verb }>()
const emit = defineEmits<{ 'update:modelValue': [value: Verb] }>()

const open = ref(false)
const search = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const filtered = computed(() =>
  search.value.trim()
    ? VERBS.filter((v) => v.toLowerCase().includes(search.value.toLowerCase()))
    : VERBS,
)

function select(verb: Verb) {
  emit('update:modelValue', verb)
  open.value = false
  search.value = ''
}

async function openDropdown() {
  open.value = true
  search.value = ''
  await nextTick()
  inputRef.value?.focus()
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
    search.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="containerRef" class="relative">
    <div
      class="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm flex items-center justify-between cursor-pointer bg-white"
      @click="openDropdown"
    >
      <span v-if="!open" class="truncate">{{ modelValue }}</span>
      <input
        v-show="open"
        ref="inputRef"
        v-model="search"
        class="outline-none w-full bg-transparent text-sm"
        placeholder="Rechercher…"
        @keydown.escape="open = false; search = ''"
      />
      <svg class="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <ul
      v-if="open"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto text-sm"
    >
      <li v-if="filtered.length === 0" class="px-3 py-2 text-gray-400">
        Aucun résultat
      </li>
      <li
        v-for="verb in filtered"
        :key="verb"
        class="px-3 py-2 cursor-pointer hover:bg-gray-100"
        :class="{ 'bg-gray-50 font-medium': verb === modelValue }"
        @mousedown.prevent="select(verb)"
      >
        {{ verb }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/services/api'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const uploading = ref(false)
const uploadError = ref<string | null>(null)

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = null
  try {
    const url = await uploadImage(file)
    emit('update:modelValue', url)
  } catch (e) {
    uploadError.value = (e as Error).message
  } finally {
    uploading.value = false
  }
}

function clearImage() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="space-y-2">
    <div v-if="modelValue" class="relative w-full h-40 rounded-lg overflow-hidden border border-gray-300">
      <img :src="modelValue" alt="Aperçu" class="w-full h-full object-cover" />
      <button
        type="button"
        class="absolute top-2 right-2 bg-white border border-gray-400 rounded-full px-2 py-0.5 text-xs hover:opacity-70"
        @click="clearImage"
      >
        ✕
      </button>
    </div>

    <label class="flex items-center gap-2 cursor-pointer w-fit">
      <span
        class="bg-white border border-gray-400 rounded-lg px-3 py-2 text-sm hover:opacity-70"
        :class="{ 'opacity-50': uploading }"
      >
        {{ uploading ? 'Envoi…' : modelValue ? 'Changer l\'image' : '+ Choisir une image' }}
      </span>
      <input
        type="file"
        accept="image/*"
        class="hidden"
        :disabled="uploading"
        @change="onFileChange"
      />
    </label>

    <p v-if="uploadError" class="text-red-600 text-xs">{{ uploadError }}</p>
  </div>
</template>

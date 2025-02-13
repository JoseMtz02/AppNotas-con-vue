<template>
  <div class="w-64 h-64 bg-yellow-100 border border-yellow-300 shadow-lg rounded-xl p-4 flex flex-col justify-between">
      <div>
          <h3 class="text-lg font-semibold text-orange-700 mb-2">{{ note.title }}</h3>
          <div class="description-container">
              <p class="text-gray-900 text-sm break-words">{{ note.description }}</p>
          </div>
          <p v-if="formattedDate" class="text-gray-600 text-xs mt-2">{{ formattedDate }}</p>
      </div>
      <div class="flex justify-end gap-2 mt-4">
          <button @click="$emit('edit', note)" class="p-2 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition">
              <PencilIcon class="h-5 w-5" />
          </button>
          <button @click="$emit('delete', note.id)" class="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition">
              <TrashIcon class="h-5 w-5" />
          </button>
      </div>
  </div>
</template>

<style scoped>
.description-container {
  max-height: 120px; 
  overflow-y: auto;
  padding-right: 4px;
}

.description-container::-webkit-scrollbar {
  width: 6px;
}

.description-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Note } from '@/interfaces/INotes';

const props = defineProps<{
    note: Note;
}>();

defineEmits<{
    (e: 'edit', note: Note): void;
    (e: 'delete', id: string): void;
}>();

const formatDueDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const formattedDate = computed(() => formatDueDate(props.note.createdAt));

</script>

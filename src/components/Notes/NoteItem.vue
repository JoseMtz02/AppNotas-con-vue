<template>
    <div class="flex items-center justify-between p-4 rounded-lg border border-gray-300">
        <div class="flex-1">
            <h3 class="text-lg font-semibold text-orange-700">{{ note.title }}</h3>
            <p class="text-gray-900 text-sm">{{ note.description }}</p>
            <div class="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold text-orang']">
                     {{ note.cat }}
                </span>
                <time :datetime="new Date(note.createdAt).toISOString()">
                  {{ formatDueDate(note.createdAt) }}
            </time>
            </div>
        </div>
        <div class="flex gap-2">
            <button @click="$emit('edit', note)" class="p-2 rounded-lg text-orange-400 hover:text-orange-500 hover:bg-orange-900/20">
                <PencilIcon class="h-5 w-5" />
            </button>
            <button @click="$emit('delete', note.id)" class="p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-900/20">
                 <TrashIcon class="h-5 w-5" />
            </button>
        </div>
    </div>
</template>



<script setup lang="ts">
import {computed} from 'vue'
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

</script>

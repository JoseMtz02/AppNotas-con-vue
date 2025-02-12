<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-1">
      <label for="title" class="block text-sm font-medium text-orange-800">
        Título <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        placeholder="Ingresa el título de la nota"
        class="w-full px-4 py-2.5 rounded-lg border border-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
      />
    </div>

    <div class="space-y-1">
      <label for="description" class="block text-sm font-medium text-orange-800">
        Descripción
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        placeholder="Añade una descripción"
        class="w-full px-4 py-2.5 rounded-lg border border-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
      ></textarea>
    </div>

    <div class="space-y-1">
      <label for="cat" class="block text-sm font-medium text-orange-800">Categoría</label>
      <select
        id="cat"
        v-model="form.cat"
        class="w-full px-4 py-2.5 rounded-lg border border-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
      >
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>

      <div class="mt-3 flex gap-2">
        <input
          v-model="newCategory"
          type="text"
          placeholder="Nueva categoría"
          class="flex-1 px-4 py-2.5 rounded-lg border border-orange-400 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
        />
        <button
          type="button"
          @click="addNewCategory"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newCategory.trim()"
        >
          Agregar
        </button>
      </div>
    </div>

    <div class="flex justify-center gap-3">
      <ButtonSlot
        type="button"
        variant="secondary"
        @click="$emit('close')"
        class="bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
      >
        Cancelar
      </ButtonSlot>
      <ButtonSlot
        type="submit"
        variant="primary"
        class="bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isModalCompleted"
      >
        {{ noteToEdit ? 'Actualizar' : 'Guardar' }}
      </ButtonSlot>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { Note } from '@/interfaces/INotes';
import ButtonSlot from '../common/ButtonSlot.vue';
import { computed, reactive, ref } from 'vue';
import { useNoteStore } from '@/stores/note';

const noteStore = useNoteStore();
const categories = noteStore.categories;

const isModalCompleted = computed(() => {
  return form.title.trim() !== '' && form.cat.trim() !== '';
});

const props = defineProps<{ noteToEdit?: Note | null }>();
const emit = defineEmits<{ (e: 'submit', note: Omit<Note, 'id' | 'createdAt'>): void }>();

const initialForm = {
  title: props.noteToEdit?.title || '',
  description: props.noteToEdit?.description || '',
  cat: props.noteToEdit?.cat || 'personal',
};

const form = reactive({ ...initialForm });
const newCategory = ref('');

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  Object.assign(form, initialForm);
};

const addNewCategory = () => {
  if (newCategory.value.trim() !== '') {
    noteStore.addCategory(newCategory.value.trim());
    form.cat = newCategory.value.trim();
    newCategory.value = '';
  }
};
</script>

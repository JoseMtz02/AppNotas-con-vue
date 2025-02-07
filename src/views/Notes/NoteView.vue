<template>
    <div class="container mx-auto px-4 py-12 max-w-4xl border border-orange-200 rounded-lg">
      <header class="mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-2 text-center">
          Aplicación de Notas
        </h1>
        <div class="flex justify-between items-center mt-4">
          <div>
            <span class="font-semibold text-lg">Total de notas: </span>
            <span class="text-[30px] text-orange-900">{{ totalNotes }}</span>
          </div>
          <div>
            <BaseButton @click="openModal" variant="primary">
                <PencilSquareIcon class="w-5 h-5"/>
              Agregar nueva nota

            </BaseButton>
          </div>
        </div>
      </header>

      <!-- Menú de filtros -->
      <div class="relative mb-6">
        <button @click="isMenuOpen = !isMenuOpen" class="bg-orange-400 text-white px-4 py-2 rounded-md w-full flex justify-between items-center">
          Filtrar por: {{ selectedCategory || 'Todas' }}
          <span :class="{'rotate-180': isMenuOpen}" class="transition-transform">▼</span>
        </button>
        <div v-if="isMenuOpen" class="absolute mt-2 bg-white shadow-lg w-full rounded-md z-10">
          <button @click="filterByCategory(null)" class="block w-full text-left px-4 py-2 hover:bg-orange-100">
            Todas
          </button>
          <button v-for="category in categories" :key="category" @click="filterByCategory(category)" class="block w-full text-left px-4 py-2 hover:bg-orange-100 capitalize">
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="noteStore.loading" class="text-center p-8">
        <div class="animate-spin inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-4"></div>
        <p class="text-gray-600">Cargando notas...</p>
      </div>

      <div v-else>
        <div v-if="totalNotes >0" class="flex gap-4 my-4 justify-center">
          <BaseButton @click="clearAll" variant="danger">
            Borrar todas las notas
            <TrashIcon class="h-[20px]"/>
          </BaseButton>
        </div>

        <div class="space-y-4">
          <div v-for="category in filteredCategories" :key="category">
            <h2 class="text-xl font-semibold mb-2 capitalize">
              {{ category }} ({{ getTotalByCategory(category) }})
            </h2>
            <div v-if="noteStore.filterNotes(category).length > 0" class="space-y-2">
              <NoteItem
                v-for="note in noteStore.filterNotes(category)"
                :key="note.id"
                :note="note"
                @edit="editNote"
                @delete="deleteNote"
              />
            </div>
            <div v-else class="text-gray-600 text-center p-4">No hay notas en esta categoría.</div>
          </div>
        </div>
      </div>

      <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div class="flex justify-center items-center">
            <h2 class="text-xl font-semibold text-black">
              {{ noteToEdit ? "Editar Nota" : "Agregar Nota" }}
            </h2>
          </div>

          <div class="mt-4">
            <NoteForm @submit="handleNoteSubmit" :noteToEdit="noteToEdit" @close="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useNoteStore } from '@/stores/note';
  import type { Note } from '@/interfaces/INote';
  import NoteItem from '@/components/Notes/NoteItem.vue';
  import NoteForm from '@/components/Notes/NoteForm.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
import { PencilIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

  const noteStore = useNoteStore();
  const categories: Array<Note['cat']> = ['trabajo', 'personal', 'urgente'];
  const noteToEdit = ref<Note | null>(null);
  const isModalOpen = ref(false);
  const isMenuOpen = ref(false);
  const selectedCategory = ref<string | null>(null);

  onMounted(() => {
    noteStore.fetchNotes();
  });

  const totalNotes = computed(() => noteStore.notes.length);

  const filteredCategories = computed(() => {
    return selectedCategory.value ? [selectedCategory.value] : categories;
  });

  function getTotalByCategory(cat: Note['cat']) {
    return noteStore.filterNotes(cat).length;
  }

  function handleNoteSubmit(noteData: Omit<Note, 'id' | 'createdAt'>) {
    if (noteToEdit.value) {
      noteStore.editNote({ ...noteToEdit.value, ...noteData });
      noteToEdit.value = null;
    } else {
      noteStore.addNote(noteData);
    }
    closeModal();
  }

  function editNote(note: Note) {
    noteToEdit.value = note;
    openModal();
  }

  function deleteNote(id: string) {
    noteStore.deleteNote(id);
  }

  function clearAll() {
    noteStore.deleteAll();
  }

  function openModal() {
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    noteToEdit.value = null;
  }

  function filterByCategory(category: string | null) {
    selectedCategory.value = category;
    isMenuOpen.value = false;
  }
  </script>

<template>
  <div class="container mx-auto px-4 py-12 border border-orange-200 rounded-lg">
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
          <ButtonSlot @click="openModal" variant="primary">
            <PencilSquareIcon class="w-5 h-5" />
            Agregar nueva nota
          </ButtonSlot>
        </div>
      </div>
    </header>

    <div>


         <div v-if="totalNotes > 0" class="flex gap-4 my-4 justify-center ">
      <ButtonSlot @click="clearAll" variant="danger">
        Borrar todas las notas
        <TrashIcon class="h-[20px]" />
      </ButtonSlot>

      <div class="relative mb-4">
        <select
          v-model="selectedCategory"
          class="bg-orange-400 text-white px-4 py-2 rounded-md font-medium rounded-xl capitalize"
        >
          <option :value="null">Todas</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>


      <div class="py-4">
        <div v-for="category in filteredCategories" :key="category">
          <h2 class="text-xl font-semibold mb-2 capitalize">
            {{ category }} ({{ totalByCategory(category) }})
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
          <NoteFormModal @submit="handleNoteSubmit" :noteToEdit="noteToEdit" @close="closeModal" />
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
  import NoteFormModal from '@/components/Notes/NoteFormModal.vue';
  import ButtonSlot from '@/components/common/ButtonSlot.vue';
import { PencilIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

  const noteStore = useNoteStore();

  const noteToEdit = ref<Note>(null);
  const isModalOpen = ref(false);
  const selectedCategory = ref<string | null>(null);
  const categories = computed(()=> noteStore.categories);

  onMounted(() => {
    noteStore.getNotes();
  });

  const totalNotes = computed(() => noteStore.notes.length);
  const totalByCategory = computed(()=> (cat: string) => {
    return noteStore.filterNotes(cat).length;
  });

  const filteredCategories = computed(() => {
    return selectedCategory.value ? [selectedCategory.value] : categories.value;

  });



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


  </script>

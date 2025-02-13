  import { defineStore } from 'pinia';
  import { ref, watch } from 'vue';
  import type { Note } from '@/interfaces/INotes';

  export const useNoteStore = defineStore('note', () => {
    const notes = ref<Note[]>(JSON.parse(localStorage.getItem('notes') || '[]'));
    const categories = ref<string[]>(JSON.parse(localStorage.getItem('categories') || '[]'));

    function getNotes(): Note[] {
      return notes.value;
    }

    function addNote(note: Omit<Note, 'id' | 'createdAt'>) {
      const newNote: Note = {
        ...note,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      notes.value.push(newNote);
    }

    function addCategory(newCategory: string) {
      if (!categories.value.includes(newCategory)) {
        categories.value.push(newCategory);
      }
    }

    function editNote(updatedNote: Note) {
      const index = notes.value.findIndex((x) => x.id === updatedNote.id);
      if (index !== -1) {
        notes.value[index] = updatedNote;
      }
    }

    function deleteNote(id: string) {
      notes.value = notes.value.filter((x) => x.id !== id);
    }

    function deleteAll() {
      notes.value = [];
      categories.value =  [];
    }

    function filterNotes(category: string) {
      return notes.value
        .filter((x) => x.cat === category).reverse()
       }

    watch(
      notes,
      (newNotes) => {
        localStorage.setItem('notes', JSON.stringify(newNotes));
      },
      { deep: true }
    );

    watch(
      categories,
      (newCategories)=>{
        localStorage.setItem('categories',JSON.stringify(newCategories));
      },
      {deep:true}
    );

    return {
      notes,
      categories,
      getNotes,
      addNote,
      addCategory,
      editNote,
      deleteNote,
      deleteAll,
      filterNotes,
    };
  });

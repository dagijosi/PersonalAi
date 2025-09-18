import { create } from 'zustand';
import { demoNotes } from '../data/Note';
import type { Note } from '../types/NoteType';

interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: number) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: demoNotes,
  addNote: (note) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          ...note,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateNote: (updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
}));

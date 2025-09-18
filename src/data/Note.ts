import type { Note } from "../types/NoteType";

export const demoNotes: Note[] = [
  {
    id: 1,
    title: "Meeting with Client",
    content:
      "Discussed requirements for new web app. Client prefers React + Node stack. Deadline is in November.",
    tags: ["work", "meeting"],
    createdAt: "2025-09-17T09:00:00Z",
  },
  {
    id: 2,
    title: "Personal Journal",
    content:
      "Feeling motivated today. Completed 2 tasks and went for a morning run.",
    tags: ["personal", "journal"],
    createdAt: "2025-09-16T21:00:00Z",
  },
  {
    id: 3,
    title: "AI Research Notes",
    content:
      "Explored Gemini 2.5 Flash for AI integrations. It's fast and good for natural language commands.",
    tags: ["ai", "research"],
    createdAt: "2025-09-15T16:45:00Z",
  },
];

export const getNotes = (): Note[] => demoNotes;

export const getNoteById = (id: number): Note | undefined => {
  return demoNotes.find((note) => note.id === id);
};

export const addNote = (note: Omit<Note, "id" | "createdAt">): Note => {
  const newNote: Note = {
    ...note,
    id: Math.max(0, ...demoNotes.map((i) => i.id)) + 1,
    createdAt: new Date().toISOString(),
  };
  demoNotes.push(newNote);
  return newNote;
};

export const updateNote = (updatedNote: Note): Note | undefined => {
  const index = demoNotes.findIndex((note) => note.id === updatedNote.id);
  if (index === -1) return undefined;

  demoNotes[index] = updatedNote;
  return updatedNote;
};
export const deleteNote = (id: number): boolean => {
  const index = demoNotes.findIndex((note) => note.id === id);
  if (index === -1) return false; 
  demoNotes.splice(index, 1);
  return true;
}

export const searchNotes = (query: string): Note[] => {
  const notes = getNotes();
  const lowerQuery = query.toLowerCase();

  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      (note.tags ?? []).some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
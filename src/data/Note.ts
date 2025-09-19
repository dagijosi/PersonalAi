import type { Note } from "../types/NoteType";

export const demoNotes: Note[] = [
  {
    id: 1,
    title: "Meeting with Client",
    content:
      "Discussed requirements for new web app. Client prefers React + Node stack. Deadline is in November.",
    tags: ["work", "meeting"],
    createdAt: "2025-09-17T09:00:00Z",
    linkedTasks: [2],
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
  {
    id: 4,
    title: "Book Summary - Atomic Habits",
    content:
      "Key idea: Small daily improvements compound into remarkable results. Focus on identity, not outcomes.",
    tags: ["personal", "reading"],
    createdAt: "2025-09-14T20:00:00Z",
  },
  {
    id: 5,
    title: "Project Brainstorm",
    content:
      "Ideas for side project: task manager with AI notes, calendar sync, and smart prioritization.",
    tags: ["work", "ideas", "ai"],
    createdAt: "2025-09-13T18:30:00Z",
  },
  {
    id: 6,
    title: "Travel Plans",
    content:
      "Looking at visiting Japan in December. Must check flights and book hotel near Tokyo.",
    tags: ["personal", "travel"],
    createdAt: "2025-09-12T10:15:00Z",
  },
  {
    id: 7,
    title: "Weekly Reflection",
    content:
      "This week was productive. Managed to complete most tasks and maintain workout consistency.",
    tags: ["personal", "journal"],
    createdAt: "2025-09-11T22:00:00Z",
  },
  {
    id: 8,
    title: "Workshop Notes",
    content:
      "Attended workshop on modern frontend architecture. Key takeaway: micro-frontends + design systems.",
    tags: ["work", "frontend", "learning"],
    createdAt: "2025-09-10T15:00:00Z",
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
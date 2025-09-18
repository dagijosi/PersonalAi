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
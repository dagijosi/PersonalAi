export interface Command {
  name: string;
  description: string;
  template: string; // This will now be a user-friendly string
}

export const commands: Command[] = [
  // Navigation
  {
    name: "navigate",
    description: "Navigate to a different page. Usage: /navigate <path>",
    template: "/navigate ",
  },

  // --- Notes Commands ---
  {
    name: "addNote",
    description: "Create a new note. Usage: /addNote <title>, <content>, <tags>",
    template: "/addNote ",
  },
  {
    name: "getNotes",
    description: "Get a list of all notes. Usage: /getNotes",
    template: "/getNotes",
  },
  {
    name: "getNoteById",
    description: "Get a specific note by ID. Usage: /getNoteById <id>",
    template: "/getNoteById ",
  },
  {
    name: "updateNote",
    description:
      "Update an existing note. Usage: /updateNote <id>, <title>, <content>, <tags>",
    template: "/updateNote ",
  },
  {
    name: "deleteNote",
    description: "Delete a note by ID. Usage: /deleteNote <id>",
    template: "/deleteNote ",
  },

  // --- Tasks Commands ---
  {
    name: "addTask",
    description:
      "Create a new task. Usage: /addTask <title>, <description>, <dueDate>, <priority>",
    template: "/addTask ",
  },
  {
    name: "getTasks",
    description: "Get a list of all tasks. Usage: /getTasks",
    template: "/getTasks",
  },
  {
    name: "getTaskById",
    description: "Get a specific task by ID. Usage: /getTaskById <id>",
    template: "/getTaskById ",
  },
  {
    name: "updateTask",
    description:
      "Update an existing task. Usage: /updateTask <id>, <title>, <description>, <dueDate>, <priority>, <status>",
    template: "/updateTask ",
  },
  {
    name: "deleteTask",
    description: "Delete a task by ID. Usage: /deleteTask <id>",
    template: "/deleteTask ",
  },
  {
    name: "searchNotes",
    description: "Search notes by keyword or tags. Usage: /searchNotes <query>",  
    template: "/searchNotes ",
  },
  {
    name: "searchTasks",
    description: "Search tasks by keyword, priority, status, or tags. Usage: /searchTasks <query>",
    template: "/searchTasks ",
  },
  {
    name: "countNotes",
    description: "Get the total number of notes. Usage: /countNotes",
    template: "/countNotes",
  },
  {
    name: "countTasks",
    description: "Get the total number of tasks. Usage: /countTasks",
    template: "/countTasks",
  },

  // --- AI Commands ---
  {
    name: "summarizeNotes",
    description: "Summarize notes based on a query. Usage: /summarizeNotes <query>",
    template: "/summarizeNotes ",
  },
  {
    name: "suggestTaskFromNote",
    description: "Suggest a task from a note's content. Usage: /suggestTaskFromNote <noteId>",
    template: "/suggestTaskFromNote ",
  },
  {
    name: "suggestGroupsFromNotes",
    description: "Suggest groups from notes based on a query. Usage: /suggestGroupsFromNotes <query>",
    template: "/suggestGroupsFromNotes ",
  },
];

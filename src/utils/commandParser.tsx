type ToolName =
  // Navigation
  | "navigate"

  // Notes
  | "addNote"
  | "getNotes"
  | "getNoteById"
  | "getNotesByIds"
  | "updateNote"
  | "deleteNote"
  | "countNotes"

  // Tasks
  | "addTask"
  | "getTasks"
  | "getTaskById"
  | "getTasksByIds"
  | "updateTask"
  | "deleteTask"
  | "countTasks"

  //search
  | "searchNotes"
  | "searchTasks"
  | "searchAll"
  | "chartTasks"
  | "chartNotes"
  | "summarizeNotes"
  | "suggestTaskFromNote"
  | "suggestGroupsFromNotes";

type ToolArgs =
  // Navigation
  | { path: string }

  // Notes
  | { title: string; content: string; tags: string[] } // addNote
  | Record<string, never> // getNotes
  | { id: number } // getNoteById, deleteNote
  | { ids: number[] } // getNotesByIds, getTasksByIds
  | { id: number; title: string; content: string; tags: string[] } // updateNote

  // Tasks
  | {
      title: string;
      description: string;
      dueDate: string;
      priority: "low" | "medium" | "high";
    } // addTask
  | Record<string, never> // getTasks
  | { id: number } // getTaskById, deleteTask
  | {
      id: number;
      title: string;
      description: string;
      dueDate: string;
      priority: "low" | "medium" | "high";
      status: "todo" | "in-progress" | "done";
    } // updateTask

  // Search
  | { query?: string } // searchNotes, searchTasks, summarizeNotes, suggestGroupsFromNotes
  | { noteId: number } // suggestTaskFromNote
  | Record<string, never> // countNotes, countTasks
  | { groupBy: "priority" | "status" | "tags"; type: "bar" | "line" | "pie" };

export interface ToolCall {
  tool: ToolName;
  args: ToolArgs;
}

export const parseUserCommand = (userPrompt: string): ToolCall | null => {
  userPrompt = userPrompt.trim();

  if (!userPrompt.startsWith("/")) return null;

  const parts = userPrompt
    .split(" ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const command = parts[0];
  switch (command) {
    case "/navigate": {
      let path = parts[1];
      if (!path) return null;
      if (!path.startsWith("/")) path = "/" + path; // make absolute
      return { tool: "navigate", args: { path } };
    }
    case "/getNotesByIds": {
      const ids = parts.slice(1).map(Number).filter(id => !isNaN(id));
      if (ids.length === 0) return null; // No valid IDs provided
      return { tool: "getNotesByIds", args: { ids } };
    }
    case "/getTasksByIds": {
      const ids = parts.slice(1).map(Number).filter(id => !isNaN(id));
      if (ids.length === 0) return null; // No valid IDs provided
      return { tool: "getTasksByIds", args: { ids } };
    }
    case "/summarizeNotes": {
      const query = parts.slice(1).join(" ");
      if (!query) return null;
      return { tool: "summarizeNotes", args: { query } };
    }
    case "/suggestTaskFromNote": {
      const noteId = Number(parts[1]);
      if (isNaN(noteId)) return null;
      return { tool: "suggestTaskFromNote", args: { noteId } };
    }
    case "/suggestGroupsFromNotes": {
      const query = parts.slice(1).join(" ");
      if (!query) return null;
      return { tool: "suggestGroupsFromNotes", args: { query } };
    }
    default:
      return null;
  }
};

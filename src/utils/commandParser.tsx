type ToolName =
  // Navigation
  | "navigate"

  // Notes
  | "addNote"
  | "getNotes"
  | "getNoteById"
  | "updateNote"
  | "deleteNote"
  | "countNotes"

  // Tasks
  | "addTask"
  | "getTasks"
  | "getTaskById"
  | "updateTask"
  | "deleteTask"
  | "countTasks"

  //search
  | "searchNotes"
  | "searchTasks"
  | "chartTasks"
  | "chartNotes";

type ToolArgs =
  // Navigation
  | { path: string }

  // Notes
  | { title: string; content: string; tags: string[] } // addNote
  | Record<string, never> // getNotes
  | { id: number } // getNoteById, deleteNote
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
  | { query: string } // searchNotes, searchTasks
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
    default:
      return null;
  }
};

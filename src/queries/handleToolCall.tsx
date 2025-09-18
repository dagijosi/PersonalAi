import {
  addNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
} from "../data/Note";
import {
  addTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
} from "../data/Task";
import routes from "../router/routes";
import type { AppRoute } from "../types/AppType";
import type { ToolCall } from "../utils/commandParser";
import type { NavigateFunction } from "react-router-dom";

export const handleToolCall = async (
  toolCall?: ToolCall,
  navigate?: NavigateFunction
) => {
  if (!toolCall) {
    return "No tool call provided.";
  }

  switch (toolCall.tool) {
    // -------- Navigation --------
    case "navigate": {
      if (!navigate) return "Navigate function is missing.";
      const path = (toolCall.args as { path: string }).path;
      const allPaths = flattenRoutes(routes);
      if (allPaths.includes(path)) {
        navigate(path);
        return `Navigated to ${path}`;
      } else {
        return `No route found for "${path}"`;
      }
    }

    // -------- Notes --------
    case "addNote": {
      const { title, content, tags } = toolCall.args as {
        title: string;
        content: string;
        tags: string[];
      };
      const newNote = addNote({ title, content, tags });
      return `Created new note with ID ${newNote.id}`;
    }

    case "getNotes": {
      const notes = getNotes();
      if (!notes.length) return "No notes found.";
      return notes
        .map(
          (note) =>
            `ID ${note.id}: ${note.title}\nContent: ${note.content}${
              note.tags && note.tags.length > 0
                ? `\nTags: ${note.tags.join(", ")}`
                : ""
            }\nCreated: ${new Date(note.createdAt).toLocaleString()}`
        )
        .join("\n\n");
    }

    case "getNoteById": {
      const { id } = toolCall.args as { id: number };
      const note = getNoteById(id);
      return note
        ? `ID ${note.id}: ${note.title}\nContent: ${note.content}${
            note.tags && note.tags.length > 0
              ? `\nTags: ${note.tags.join(", ")}`
              : ""
          }\nCreated: ${new Date(note.createdAt).toLocaleString()}`
        : `No note found with ID ${id}`;
    }

    case "updateNote": {
      const { id, title, content, tags } = toolCall.args as {
        id: number;
        title: string;
        content: string;
        tags: string[];
      };
      const updated = updateNote({
        id,
        title,
        content,
        tags,
        createdAt: new Date().toISOString(),
      });
      return updated ? `Updated note ${id}` : `No note found with ID ${id}`;
    }

    case "deleteNote": {
      const { id } = toolCall.args as { id: number };
      const success = deleteNote(id);
      return success ? `Deleted note ${id}` : `No note found with ID ${id}`;
    }

    case "searchNotes": {
      const { query } = toolCall.args as { query: string };
      const results = searchNotes(query);
      if (!results.length) return `No notes found for "${query}".`;
      return results
        .map(
          (note) =>
            `ID ${note.id}: ${note.title}\nContent: ${note.content}${
              note.tags && note.tags.length > 0
                ? `\nTags: ${note.tags.join(", ")}`
                : ""
            }\nCreated: ${new Date(note.createdAt).toLocaleString()}`
        )
        .join("\n\n");
    }

    // -------- Tasks --------
    case "addTask": {
      const { title, description, dueDate, priority } = toolCall.args as {
        title: string;
        description?: string;
        dueDate: string;
        priority: "low" | "medium" | "high";
      };
      const newTask = addTask({ title, description, dueDate, priority });
      return `Created new task with ID ${newTask.id}`;
    }

    case "getTasks": {
      const tasks = getTasks();
      if (!tasks.length) return "No tasks found.";
      return tasks
        .map(
          (task) =>
            `ID ${task.id}: ${task.title}\nDescription: ${
              task.description ?? "No description"
            }\nDue: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${
              task.status
            }\nCreated: ${new Date(task.createdAt).toLocaleString()}`
        )
        .join("\n\n");
    }

    case "getTaskById": {
      const { id } = toolCall.args as { id: number };
      const task = getTaskById(id);
      return task
        ? `ID ${task.id}: ${task.title}\nDescription: ${
            task.description ?? "No description"
          }\nDue: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${
            task.status
          }\nCreated: ${new Date(task.createdAt).toLocaleString()}`
        : `No task found with ID ${id}`;
    }

    case "updateTask": {
      const { id, title, description, dueDate, priority, status } =
        toolCall.args as {
          id: number;
          title: string;
          description?: string;
          dueDate: string;
          priority: "low" | "medium" | "high";
          status: "todo" | "in-progress" | "done";
        };
      const updated = updateTask({
        id,
        title,
        description,
        dueDate,
        priority,
        status,
        createdAt: new Date().toISOString(),
      });
      return updated ? `Updated task ${id}` : `No task found with ID ${id}`;
    }

    case "deleteTask": {
      const { id } = toolCall.args as { id: number };
      const success = deleteTask(id);
      return success ? `Deleted task ${id}` : `No task found with ID ${id}`;
    }

    case "searchTasks": {
      const { query } = toolCall.args as { query: string };
      const results = searchTasks(query);
      if (!results.length) return `No tasks found for "${query}".`;
      return results
        .map(
          (task) =>
            `ID ${task.id}: ${task.title}\nDescription: ${
              task.description ?? "No description"
            }\nDue: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${
              task.status
            }\nCreated: ${new Date(task.createdAt).toLocaleString()}`
        )
        .join("\n\n");
    }
    case "countNotes": {
      const notes = getNotes();
      return `You have ${notes.length} notes.`;
    }

    case "countTasks": {
      const tasks = getTasks();
      return `You have ${tasks.length} tasks.`;
    }

    // -------- Fallback --------
    default:
      return `Error: Unrecognized tool: ${toolCall.tool}`;
  }
};

function flattenRoutes(routes: AppRoute[]): string[] {
  return routes.flatMap((r) => [
    ...(r.path ? [r.path] : []),
    ...(r.children ? flattenRoutes(r.children) : []),
  ]);
}

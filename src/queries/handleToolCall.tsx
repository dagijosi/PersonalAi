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
import type { Note } from "../types/NoteType";
import type { Task } from "../types/TaskType";
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
      const { title, content, tags, linkedTasks } = toolCall.args as {
        title: string;
        content: string;
        tags: string[];
        linkedTasks?: number[];
      };
      const newNote = addNote({ title, content, tags, linkedTasks });
      return `Created new note with ID ${newNote.id}`;
    }

    case "getNotes": {
      const { format = "text", sortBy, order = "desc" } = (toolCall.args || {}) as { format?: "json" | "text", sortBy?: "date", order?: "asc" | "desc" };
      let notes = getNotes();
      if (!notes.length) return "No notes found.";

      if (sortBy === "date") {
        notes = notes.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return order === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      if (format === "json") {
        return "```json\n" + JSON.stringify(notes, null, 2) + "\n```";
      }

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
      const { id, format = "text" } = toolCall.args as { id: number, format?: "json" | "text" };
      const note = getNoteById(id);

      if (!note) return `No note found with ID ${id}`;

      if (format === 'json') {
        return "```json\n" + JSON.stringify(note, null, 2) + "\n```";
      }

      let response = `ID ${note.id}: ${note.title}\nContent: ${note.content}`;
      if (note.tags && note.tags.length > 0) {
        response += `\nTags: ${note.tags.join(", ")}`;
      }
      response += `\nCreated: ${new Date(note.createdAt).toLocaleString()}`;

      if (note.linkedTasks && note.linkedTasks.length > 0) {
        const linkedTasks = note.linkedTasks.map(getTaskById).filter((task): task is Task => !!task);
        if (linkedTasks.length > 0) {
          response += "\n\nLinked Tasks:";
          response += linkedTasks.map(task => `\n- ID ${task.id}: ${task.title} (${task.status})`).join("");
        }
      }

      return response;
    }

    case "getNotesByIds": {
      const { ids, format = "text" } = toolCall.args as { ids: number[], format?: "json" | "text" };
      const notes = ids.map(getNoteById).filter((note): note is Note => !!note);

      if (!notes.length) return `No notes found for IDs: ${ids.join(", ")}`;

      if (format === 'json') {
        return "```json\n" + JSON.stringify(notes, null, 2) + "\n```";
      }

      return notes.map(note => {
        let response = `Note ${note.id}: ${note.title}\nContent: ${note.content}`;
        if (note.tags && note.tags.length > 0) {
          response += `\nTags: ${note.tags.join(", ")}`;
        }
        response += `\nCreated: ${new Date(note.createdAt).toLocaleString()}`;

        if (note.linkedTasks && note.linkedTasks.length > 0) {
          const linkedTasks = note.linkedTasks.map(getTaskById).filter((task): task is Task => !!task);
          if (linkedTasks.length > 0) {
            response += "\n\nLinked Tasks:";
            response += linkedTasks.map(task => `\n- ID ${task.id}: ${task.title} (${task.status})`).join("");
          }
        }
        return response;
      }).join("\n\n--- Note ---\n\n");
    }

    case "updateNote": {
      const { id, ...updateData } = toolCall.args as {
        id: number;
        title?: string;
        content?: string;
        tags?: string[];
        linkedTasks?: number[];
      };

      const originalNote = getNoteById(id);
      if (!originalNote) {
        return `No note found with ID ${id}`;
      }

      const updatedNote = {
        ...originalNote,
        ...updateData,
      };

      const success = updateNote(updatedNote);

      return success ? `Updated note ${id}` : `No note found with ID ${id}`;
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
      const { title, description, dueDate, priority, dependsOn, linkedNotes } = toolCall.args as {
        title: string;
        description?: string;
        dueDate?: string; // Make dueDate optional here as well
        priority: "low" | "medium" | "high";
        dependsOn?: number[];
        linkedNotes?: number[];
      };
      const newTask = addTask({ title, description, dueDate, priority, dependsOn, linkedNotes, status: "todo" });
      return `Created new task with ID ${newTask.id}`;
    }

    case "getTasks": {
      const { format = "text", sortBy, order = "desc" } = (toolCall.args || {}) as { format?: "json" | "text", sortBy?: "date" | "priority" | "status", order?: "asc" | "desc" };
      let tasks = getTasks();
      if (!tasks.length) return "No tasks found.";

      if (sortBy) {
        tasks = tasks.sort((a, b) => {
          let valA: string | number, valB: string | number;

          if (sortBy === "date") {
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
          } else if (sortBy === "priority") {
            const priorityOrder = { low: 3, medium: 2, high: 1 };
            valA = priorityOrder[a.priority];
            valB = priorityOrder[b.priority];
          } else { // status
            valA = a.status;
            valB = b.status;
          }

          if (valA < valB) return order === "asc" ? -1 : 1;
          if (valA > valB) return order === "asc" ? 1 : -1;
          return 0;
        });
      }

      if (format === "json") {
        return "```json\n" + JSON.stringify(tasks, null, 2) + "\n```";
      }

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
      const { id, format = "text" } = toolCall.args as { id: number, format?: "json" | "text" };
      const task = getTaskById(id);

      if (!task) return `No task found with ID ${id}`;

      if (format === 'json') {
        return "```json\n" + JSON.stringify(task, null, 2) + "\n```";
      }

      let response = `ID ${task.id}: ${task.title}\nDescription: ${
        task.description ?? "No description"
      }\nDue: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${
        task.status
      }\nCreated: ${new Date(task.createdAt).toLocaleString()}`;

      if (task.linkedNotes && task.linkedNotes.length > 0) {
        const linkedNotes = task.linkedNotes.map(getNoteById).filter((note): note is Note => !!note);
        if (linkedNotes.length > 0) {
          response += "\n\nLinked Notes:";
          response += linkedNotes.map(note => `\n- ID ${note.id}: ${note.title}`).join("");
        }
      }

      return response;
    }

    case "getTasksByIds": {
      const { ids, format = "text" } = toolCall.args as { ids: number[], format?: "json" | "text" };
      const tasks = ids.map(getTaskById).filter((task): task is Task => !!task);

      if (!tasks.length) return `No tasks found for IDs: ${ids.join(", ")}`;

      if (format === 'json') {
        return "```json\n" + JSON.stringify(tasks, null, 2) + "\n```";
      }

      return tasks.map(task => {
        let response = `Task ${task.id}: ${task.title}\nDescription: ${
          task.description ?? "No description"
        }\nDue: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${
          task.status
        }\nCreated: ${new Date(task.createdAt).toLocaleString()}`;

        if (task.linkedNotes && task.linkedNotes.length > 0) {
          const linkedNotes = task.linkedNotes.map(getNoteById).filter((note): note is Note => !!note);
          if (linkedNotes.length > 0) {
            response += "\n\nLinked Notes:";
            response += linkedNotes.map(note => `\n- ID ${note.id}: ${note.title}`).join("");
          }
        }
        return response;
      }).join("\n\n--- Task ---\n\n");
    }

    case "updateTask": {
      const { id, ...updateData } = toolCall.args as {
        id: number;
        title?: string;
        description?: string;
        dueDate?: string;
        priority?: "low" | "medium" | "high";
        status?: "todo" | "in-progress" | "done";
        dependsOn?: number[];
        linkedNotes?: number[];
      };

      const originalTask = getTaskById(id);
      if (!originalTask) {
        return `No task found with ID ${id}`;
      }

      const updatedTask = {
        ...originalTask,
        ...updateData,
      };

      const success = updateTask(updatedTask);

      return success ? `Updated task ${id}` : `No task found with ID ${id}`;
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

    case "searchAll": {
      const { query } = toolCall.args as { query: string };
      const noteResults = searchNotes(query);
      const taskResults = searchTasks(query);

      if (!noteResults.length && !taskResults.length) {
        return `No notes or tasks found for "${query}".`;
      }

      let result = "";

      if (noteResults.length > 0) {
        result += "-- Notes --\n";
        result += noteResults
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

      if (taskResults.length > 0) {
        if (result) result += "\n\n";
        result += "-- Tasks --\n";
        result += taskResults
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

      return result;
    }

    case "countNotes": {
      const notes = getNotes();
      return `You have ${notes.length} notes.`;
    }

    case "countTasks": {
      const tasks = getTasks();
      return `You have ${tasks.length} tasks.`;
    }

    // --- Charts ---
    case "chartNotes": {
      const { groupBy, type } = toolCall.args as {
        groupBy: "tags";
        type: "bar" | "line" | "pie";
      };

      const notes = getNotes();
      const counts: Record<string, number> = {};

      notes.forEach((note) => {
        if (groupBy === "tags" && Array.isArray(note.tags)) {
          // ✅ Count each tag individually
          note.tags.forEach((tag) => {
            counts[tag] = (counts[tag] || 0) + 1;
          });
        } else {
          // Fallback for any other fields
          const key = String(note[groupBy as keyof typeof note] ?? "unknown");
          counts[key] = (counts[key] || 0) + 1;
        }
      });

      const chartData = Object.entries(counts).map(([key, count]) => ({
        [groupBy]: key,
        count,
      }));

      return `\`\`\`chart
${JSON.stringify(
  { type, data: chartData, xKey: groupBy, yKey: "count" },
  null,
  2
)}
\`\`\``;
    }

    case "chartTasks": {
      const { groupBy, type } = toolCall.args as {
        groupBy: "priority" | "status" | "dueDate";
        type: "bar" | "line" | "pie";
      };

      const tasks = getTasks();
      const counts: Record<string, number> = {};

      tasks.forEach((task) => {
        const key = String(task[groupBy as keyof typeof task] ?? "unknown");
        counts[key] = (counts[key] || 0) + 1;
      });

      // Sort priorities if groupBy = priority (high > medium > low)
      let sortedEntries = Object.entries(counts);
      if (groupBy === "priority") {
        const order = ["high", "medium", "low"];
        sortedEntries = sortedEntries.sort(
          ([a], [b]) => order.indexOf(a) - order.indexOf(b)
        );
      } else if (groupBy === "dueDate") {
        sortedEntries = sortedEntries.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
      }

      const chartData = sortedEntries.map(([key, count]) => ({
        [groupBy]: key,
        count,
      }));

      return `\`\`\`chart
${JSON.stringify(
  { type, data: chartData, xKey: groupBy, yKey: "count" },
  null,
  2
)}
\`\`\``;
    }

    // -------- Fallback --------
    default:
      return `Error: Unrecognized tool: ${toolCall.tool}`;
  }
};

function flattenRoutes(routes: AppRoute[]): string[] {
  return routes.flatMap((r: AppRoute) => [
    ...(r.path ? [r.path] : []),
    ...(r.children ? flattenRoutes(r.children) : []),
  ]);
}

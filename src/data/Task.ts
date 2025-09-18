import type { Task } from "../types/TaskType";

export const demoTasks: Task[] = [
  {
    id: 1,
    title: "Buy groceries",
    description: "Milk, eggs, bread, coffee",
    dueDate: "2025-09-19",
    priority: "medium",
    status: "todo",
    createdAt: "2025-09-17T08:30:00Z",
  },
  {
    id: 2,
    title: "Finish project proposal",
    description: "Complete draft and send to team",
    dueDate: "2025-09-20",
    priority: "high",
    status: "in-progress",
    createdAt: "2025-09-16T10:00:00Z",
  },
  {
    id: 3,
    title: "Call John",
    description: "Discuss meeting agenda",
    dueDate: "2025-09-18",
    priority: "low",
    status: "done",
    createdAt: "2025-09-15T14:20:00Z",
  },
];

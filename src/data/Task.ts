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
  {
    id: 4,
    title: "Plan sprint",
    description: "Outline sprint backlog with the team",
    dueDate: "2025-09-21",
    priority: "high",
    status: "todo",
    createdAt: "2025-09-17T12:15:00Z",
    dependsOn: [2],
  },
  {
    id: 5,
    title: "Write documentation",
    description: "Document API endpoints for backend service",
    dueDate: "2025-09-22",
    priority: "medium",
    status: "in-progress",
    createdAt: "2025-09-16T09:45:00Z",
    dependsOn: [7],
  },
  {
    id: 6,
    title: "Team standup",
    description: "Daily sync with the development team",
    dueDate: "2025-09-18",
    priority: "low",
    status: "todo",
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: 7,
    title: "Refactor login module",
    description: "Improve code quality and fix minor bugs",
    dueDate: "2025-09-23",
    priority: "high",
    status: "in-progress",
    createdAt: "2025-09-17T11:00:00Z",
    linkedNotes: [8],
  },
  {
    id: 8,
    title: "Design review",
    description: "Review new UI mockups with the design team",
    dueDate: "2025-09-24",
    priority: "medium",
    status: "todo",
    createdAt: "2025-09-16T14:30:00Z",
  },
  {
    id: 9,
    title: "Fix deployment pipeline",
    description: "Resolve CI/CD failures in GitHub Actions",
    dueDate: "2025-09-25",
    priority: "high",
    status: "todo",
    createdAt: "2025-09-15T19:10:00Z",
  },
  {
    id: 10,
    title: "Exercise",
    description: "30-minute run in the park",
    dueDate: "2025-09-18",
    priority: "low",
    status: "done",
    createdAt: "2025-09-15T07:00:00Z",
  },
];

export const getTasks = (): Task[] => demoTasks;

export const getTaskById = (id: number): Task | undefined => {
  return demoTasks.find((task) => task.id === id);
};

export const addTask = (task: Omit<Task, "id" | "createdAt" | "status">): Task => {
  const newTask: Task = {
    ...task,
    id: Math.max(0, ...demoTasks.map((i) => i.id)) + 1,
    createdAt: new Date().toISOString(),
    status: "todo",
  };
  demoTasks.push(newTask);
  return newTask;
};

export const updateTask = (updatedTask: Task): Task | undefined => {
  const index = demoTasks.findIndex((task) => task.id === updatedTask.id);
  if (index === -1) return undefined;

  demoTasks[index] = updatedTask;
  return updatedTask;
};

export const deleteTask = (id: number): boolean => {
  const index = demoTasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  demoTasks.splice(index, 1);
  return true;
};

export const searchTasks = (query: string): Task[] => {
  const tasks = getTasks();
  const lowerQuery = query.toLowerCase();

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerQuery) ||
      (task.description ?? "").toLowerCase().includes(lowerQuery) ||
      task.status.toLowerCase().includes(lowerQuery) ||
      task.priority.toLowerCase().includes(lowerQuery)
      // removed tags, since Task type doesn't have tags
  );
};
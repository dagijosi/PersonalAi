export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  dependsOn?: number[];
  linkedNotes?: number[];
};

export type SuggestedTask = {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
};
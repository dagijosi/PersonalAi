export type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  groupName?: string;
  linkedTasks?: number[]; // New property for linking notes to tasks
};
export type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  linkedTasks?: number[];
};
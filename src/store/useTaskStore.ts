import { create } from 'zustand';
import { demoTasks } from '../data/Task';
import type { Task } from '../types/TaskType';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  updateTaskStatus: (id: number, status: Task['status']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: demoTasks,
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          status: 'todo',
        },
      ],
    })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      ),
    })),
}));

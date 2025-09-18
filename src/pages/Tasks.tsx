import React, { useState, useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import TaskCard from "../components/TaskCard";
import TaskForm, { type TaskFormData } from "../components/TaskForm";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { type Task } from "../types/TaskType";
import { Modal } from "../common/ui/Modal";
import { FiPlus } from "react-icons/fi";

const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } =
    useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tasks, searchTerm]);

  const handleAddTask = () => {
    setIsCreating(true);
    setEditingTaskId(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setIsCreating(false);
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTaskId) {
      const existingTask = tasks.find((t) => t.id === editingTaskId)!;
      updateTask({ ...existingTask, ...data });
      setEditingTaskId(null);
    } else {
      addTask(data);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTaskId(null);
  };

  return (
    <div className="p-8 bg-background text-primary">
      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold font-poppins mb-6">Tasks</h1>
        {!isCreating && (
          <Button onClick={handleAddTask} className="bg-primary">
            <FiPlus className="mr-2"/>
            Add Task
          </Button>
        )}
      </div>
      <Modal
        isOpen={isCreating || !!editingTaskId}
        onClose={handleCancel}
        title={editingTaskId ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          task={
            editingTaskId ? tasks.find((t) => t.id === editingTaskId) : null
          }
          onSubmit={handleFormSubmit}
          onClose={handleCancel}
        />
      </Modal>

      <div className="mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={updateTaskStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No tasks found.{" "}
            {searchTerm
              ? "Try a different search."
              : "Get started by adding a new task."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Tasks;

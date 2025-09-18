import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../common/ui/Button";
import { Input } from "../common/ui/Input";
import { Textarea } from "../common/ui/Textarea";
import { Select } from "../common/ui/Select";
import { type Task } from "../types/TaskType";
import { FiFlag } from "react-icons/fi";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskFormData) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      priority: task?.priority || "medium",
    },
  });

  useEffect(() => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      priority: task?.priority || "medium",
    });
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    onClose();
  };

  const priorityValue = watch("priority");

  const priorityColors = {
    low: "bg-green-500 text-white",
    medium: "bg-yellow-500 text-black",
    high: "bg-red-500 text-white",
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 overflow-y-auto max-h-[75vh] custom-scrollbar overflow-x-hidden"
    >
      <Input
        label="Title"
        labelClassName="text-primary font-medium"
        placeholder="Enter task title..."
        {...register("title")}
        error={errors.title?.message}
      />

      <Textarea
        label="Description"
        labelClassName="text-primary font-medium"
        placeholder="Enter task details..."
        {...register("description")}
        className="h-32 mt-2 resize-none"
      />

      <Input
        label="Due Date"
        labelClassName="text-primary font-medium"
        type="date"
        {...register("dueDate")}
        className="mt-2"
      />

      {/* Priority Select */}
      <div className="mt-2">
        <label className="block text-sm font-medium text-primary mb-2">
          Priority
        </label>
        <div className="flex items-center gap-2">
          <Select {...register("priority")} className="flex-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[priorityValue]}`}
          >
            <FiFlag className="inline mr-1" />
            {priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" className="hover:bg-gray-100" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="rounded-lg bg-[#133356] hover:bg-[#133356]/60 text-white">
          {task ? "💾 Save Changes" : "✅ Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;

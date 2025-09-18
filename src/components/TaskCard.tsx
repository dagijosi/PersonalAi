import React from 'react';
import { type Task } from '../types/TaskType';
import { Button } from '../common/ui/Button';
import { Select } from '../common/ui/Select';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag } from 'react-icons/fi';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

const PriorityBadge: React.FC<{ priority: Task['priority'] }> = ({ priority }) => {
  const styles = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span
      className={`flex items-center gap-1 capitalize px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
      <FiFlag className="w-3 h-3" />
      {priority}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <article className="bg-card p-5 rounded-xl shadow-sm border border-card hover:shadow-md transition-all duration-200 flex flex-col justify-between h-fit">
      <div>
        <h3 className="text-lg font-semibold font-jost text-primary mb-1">{task.title}</h3>
        <p className="text-xs text-gray-400">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-3 text-sm text-light-text line-clamp-3">{task.description}</p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <FiCalendar className="w-4 h-4" />
            <span>Due: {task.dueDate ?? "No due date"}</span>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        <div className="mt-4">
          <Select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as Task['status'])
            }
            className="w-full"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-primary border border-blue-600 hover:text-blue-600"
          onClick={() => onEdit(task)}
        >
          <FiEdit2 className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onDelete(task.id)}
        >
          <FiTrash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </article>
  );
};

export default TaskCard;

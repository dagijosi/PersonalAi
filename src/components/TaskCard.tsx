import React from 'react';
import { type Task } from '../types/TaskType';
import { Button } from '../common/ui/Button';
import { Select } from '../common/ui/Select';
import { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiLock, FiLink } from 'react-icons/fi';
import { useTaskStore } from '../store/useTaskStore';

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

const DependencyBadge: React.FC<{ isBlocked: boolean }> = ({ isBlocked }) => {
  if (!isBlocked) return null;
  return (
    <span
      className="flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium border border-gray-300"
    >
      <FiLock className="w-3 h-3" />
      Blocked
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { tasks } = useTaskStore();
  const isBlocked = task.dependsOn?.some(dependencyId => {
    const dependency = tasks.find(t => t.id === dependencyId);
    return dependency && dependency.status !== 'done';
  }) ?? false;

  return (
    <article className={`bg-card p-5 rounded-xl shadow-sm border border-card hover:shadow-md transition-all duration-200 flex flex-col justify-between h-fit ${isBlocked ? 'opacity-70' : ''}`}>
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
            <DependencyBadge isBlocked={isBlocked} />
          </div>
          {task.dependsOn && task.dependsOn.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiLock className="w-3 h-3" />
              <span>Depends on: {task.dependsOn.join(', ')}</span>
            </div>
          )}
          {task.linkedNotes && task.linkedNotes.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiLink className="w-3 h-3" />
              <span>Linked notes: {task.linkedNotes.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as Task['status'])
            }
            className="w-full"
            disabled={isBlocked}
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

// frontend/src/components/TaskList.tsx
import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete?: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 mt-2">Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
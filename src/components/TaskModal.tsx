// frontend/src/components/TaskModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'; // Assuming you have a Dialog component
import TaskForm from './TaskForm';
import { Task } from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  submitButtonText?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  onSubmit, 
  submitButtonText = task ? 'Update Task' : 'Create Task'
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <TaskForm
            task={task}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitButtonText={submitButtonText}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
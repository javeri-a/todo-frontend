// frontend/src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Task } from '@/types/task'; // Assuming you have a Task type defined

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  onCancel?: () => void;
  submitButtonText?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  submitButtonText = 'Save Task'
}) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [completed, setCompleted] = useState(task?.completed || false);
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [category, setCategory] = useState(task?.category || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCompleted(task.completed);
      setDueDate(task.due_date || '');
      setCategory(task.category || '');
      setPriority(task.priority || 'medium');
    }
  }, [task]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 1 || title.length > 200) {
      newErrors.title = 'Title must be between 1 and 200 characters';
    }

    if (description && description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Validate due date if provided
    if (dueDate && isNaN(Date.parse(dueDate))) {
      newErrors.dueDate = 'Invalid date format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      completed,
      due_date: dueDate || undefined,
      category: category.trim() || undefined,
      priority: priority as 'low' | 'medium' | 'high' || undefined
    };

    if (task) {
      taskData.id = task.id; // Include ID for updates
    }

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            Task Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-blue-200'
            }`}
          />
          {errors.title && (
            <div className="mt-1 flex items-center">
              <svg className="w-4 h-4 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{errors.title}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Work, Personal, Shopping..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:ring-blue-200"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-2">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.dueDate ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-blue-200'
            }`}
          />
          {errors.dueDate && (
            <div className="mt-1 flex items-center">
              <svg className="w-4 h-4 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{errors.dueDate}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:ring-blue-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jYXJldC1kb3duIiBhcmlhLWhpZGRlbj0idHJ1ZSI+PHBhdGggZD0iTTEyIDkgNyAxMiAxMiAxNyAxNyAxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this task..."
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-blue-200'
          }`}
        />
        {errors.description && (
          <div className="mt-1 flex items-center">
            <svg className="w-4 h-4 text-red-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{errors.description}</p>
          </div>
        )}
      </div>

      <div className="flex items-center pt-2">
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="sr-only"
          />
          <label 
            htmlFor="completed"
            className={`block h-6 w-10 rounded-full cursor-pointer transition-colors ${
              completed ? 'bg-blue-500' : 'bg-slate-300'
            }`}
          >
            <span 
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                completed ? 'transform translate-x-4' : ''
              }`}
            ></span>
          </label>
        </div>
        <label htmlFor="completed" className="text-sm text-slate-700">
          Mark as completed
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
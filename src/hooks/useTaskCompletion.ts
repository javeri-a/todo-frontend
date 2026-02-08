// frontend/src/hooks/useTaskCompletion.ts
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/types/task';

const useTaskCompletion = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const toggleTaskCompletion = async (task: Task) => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }

    setLoading(prev => ({ ...prev, [task.id]: true }));
    setError(null);

    try {
      const response = await tasksAPI.toggleTaskCompletion(userId, task.id);
      setLoading(prev => {
        const newState = { ...prev };
        delete newState[task.id];
        return newState;
      });
      
      // Return the updated task
      return response.data;
    } catch (err) {
      setError('Failed to toggle task completion');
      setLoading(prev => {
        const newState = { ...prev };
        delete newState[task.id];
        return newState;
      });
      console.error('Error toggling task completion:', err);
      return null;
    }
  };

  const markTaskComplete = async (task: Task) => {
    if (task.completed) return task; // Already completed
    return toggleTaskCompletion(task);
  };

  const markTaskIncomplete = async (task: Task) => {
    if (!task.completed) return task; // Already incomplete
    return toggleTaskCompletion(task);
  };

  return {
    toggleTaskCompletion,
    markTaskComplete,
    markTaskIncomplete,
    loading,
    error,
  };
};

export default useTaskCompletion;
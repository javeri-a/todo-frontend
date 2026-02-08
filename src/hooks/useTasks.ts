// frontend/src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/types/task';

const useTasks = () => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tasksAPI.getUserTasks(userId);
        setTasks(response.data);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Optimistic create task
  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;

    // Optimistically add the task to the list
    const newTask: Task = {
      id: Date.now(), // Temporary ID
      ...taskData,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      const response = await tasksAPI.createTask(userId, taskData);
      // Replace the temporary task with the server response
      setTasks(prev => prev.map(t => t.id === newTask.id ? response.data : t));
    } catch (err) {
      setError('Failed to create task');
      // Remove the optimistic task if creation failed
      setTasks(prev => prev.filter(t => t.id !== newTask.id));
      console.error('Error creating task:', err);
    }
  };

  // Optimistic update task
  const updateTask = async (id: number, taskData: Partial<Task>) => {
    if (!userId) return;

    // Optimistically update the task
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...taskData, updated_at: new Date().toISOString() } : task
    ));

    try {
      const response = await tasksAPI.updateTask(userId, id, taskData);
      // Update with server response
      setTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (err) {
      setError('Failed to update task');
      // Revert the optimistic update if it failed
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...Object.fromEntries(Object.entries(taskData).map(([key]) => [key, (tasks.find(t => t.id === id) as any)[key]])) } : task
      ));
      console.error('Error updating task:', err);
    }
  };

  // Optimistic toggle task completion
  const toggleTaskCompletion = async (id: number) => {
    if (!userId) return;

    // Optimistically toggle the completion status
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed, updated_at: new Date().toISOString() } : task
    ));

    try {
      const response = await tasksAPI.toggleTaskCompletion(userId, id);
      // Update with server response
      setTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (err) {
      setError('Failed to toggle task completion');
      // Revert the optimistic toggle if it failed
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
      console.error('Error toggling task completion:', err);
    }
  };

  // Optimistic delete task
  const deleteTask = async (id: number) => {
    if (!userId) return;

    // Optimistically remove the task
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;

    setTasks(prev => prev.filter(task => task.id !== id));

    try {
      await tasksAPI.deleteTask(userId, id);
      // Task is already removed optimistically, so nothing more to do
    } catch (err) {
      setError('Failed to delete task');
      // Restore the task if deletion failed
      if (taskToDelete) {
        setTasks(prev => [taskToDelete, ...prev]);
      }
      console.error('Error deleting task:', err);
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  };
};

export default useTasks;
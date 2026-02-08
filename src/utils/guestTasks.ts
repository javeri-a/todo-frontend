// frontend/src/utils/guestTasks.ts

import { Task } from '@/types/task';

const GUEST_TASKS_KEY = 'guest_tasks';

/**
 * Load guest tasks from localStorage
 */
export const loadGuestTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(GUEST_TASKS_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    // Ensure tasks have proper structure
    return tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      completed: task.completed || false,
      created_at: task.created_at || new Date().toISOString(),
      updated_at: task.updated_at || new Date().toISOString(),
      due_date: task.due_date,
      category: task.category,
      priority: task.priority || 'medium',
      user_id: task.user_id || 0 // For guest tasks, user_id will be 0
    }));
  } catch (error) {
    console.error('Error loading guest tasks:', error);
    return [];
  }
};

/**
 * Save guest tasks to localStorage
 */
export const saveGuestTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(GUEST_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving guest tasks:', error);
  }
};

/**
 * Add a new guest task
 */
export const addGuestTask = (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task => {
  const newTask: Task = {
    id: Date.now(), // Use timestamp as ID for guest tasks
    ...task,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    priority: task.priority || 'medium',
    user_id: 0
  };
  
  const tasks = loadGuestTasks();
  saveGuestTasks([newTask, ...tasks]);
  return newTask;
};

/**
 * Update a guest task
 */
export const updateGuestTask = (id: number, updates: Partial<Task>): Task | null => {
  const tasks = loadGuestTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  saveGuestTasks(tasks);
  return updatedTask;
};

/**
 * Delete a guest task
 */
export const deleteGuestTask = (id: number): boolean => {
  const tasks = loadGuestTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) {
    return false; // Task not found
  }
  
  saveGuestTasks(filteredTasks);
  return true;
};

/**
 * Toggle completion status of a guest task
 */
export const toggleGuestTaskCompletion = (id: number): Task | null => {
  const tasks = loadGuestTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed,
    updated_at: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  saveGuestTasks(tasks);
  return updatedTask;
};
// frontend/src/utils/taskFilters.ts
import { Task } from '@/types/task';

/**
 * Filter tasks based on completion status
 * @param tasks Array of tasks to filter
 * @param status 'all', 'active', or 'completed'
 * @returns Filtered array of tasks
 */
export const filterTasksByStatus = (tasks: Task[], status: 'all' | 'active' | 'completed'): Task[] => {
  switch (status) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'all':
    default:
      return tasks;
  }
};

/**
 * Sort tasks based on specified criteria
 * @param tasks Array of tasks to sort
 * @param sortBy Criteria to sort by ('created_at', 'updated_at', 'title')
 * @param order Direction of sort ('asc', 'desc')
 * @returns Sorted array of tasks
 */
export const sortTasks = (
  tasks: Task[], 
  sortBy: 'created_at' | 'updated_at' | 'title' = 'created_at', 
  order: 'asc' | 'desc' = 'desc'
): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'updated_at':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
      case 'created_at':
      default:
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }

    // Reverse the comparison if descending order is requested
    return order === 'desc' ? -comparison : comparison;
  });
};

/**
 * Search tasks by title or description
 * @param tasks Array of tasks to search
 * @param searchTerm Term to search for
 * @returns Array of tasks that match the search term
 */
export const searchTasks = (tasks: Task[], searchTerm: string): Task[] => {
  if (!searchTerm) return tasks;
  
  const term = searchTerm.toLowerCase().trim();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(term) || 
    (task.description && task.description.toLowerCase().includes(term))
  );
};

/**
 * Get task statistics
 * @param tasks Array of tasks to analyze
 * @returns Object with task statistics
 */
export const getTaskStats = (tasks: Task[]): { 
  total: number; 
  completed: number; 
  pending: number; 
  completionRate: number 
} => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionRate
  };
};
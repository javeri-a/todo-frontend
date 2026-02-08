// frontend/src/types/task.ts
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  due_date?: string; // ISO date string
  category?: string;
  priority?: 'low' | 'medium' | 'high'; // Priority level
}
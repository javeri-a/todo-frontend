// frontend/src/lib/api.ts
import axios, { AxiosResponse } from 'axios';

// Base API URL - in production, this would come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTHENTICATION ENDPOINTS
export const authAPI = {
  // Register a new user
  register: (email: string, name: string, password: string): Promise<AxiosResponse> => {
    return apiClient.post('/register', { email, name, password });
  },

  // Login user
  login: (email: string, password: string): Promise<AxiosResponse> => {
    return apiClient.post('/login', { email, password });
  },
};

// TASKS ENDPOINTS
export const tasksAPI = {
  // Get all tasks for a user
  getUserTasks: (userId: number, params?: { 
    skip?: number; 
    limit?: number; 
    completed?: boolean; 
    sort_by?: string 
  }): Promise<AxiosResponse> => {
    return apiClient.get(`/${userId}/tasks`, { params });
  },

  // Create a new task
  createTask: (userId: number, taskData: {
    title: string;
    description?: string;
    completed?: boolean;
    due_date?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<AxiosResponse> => {
    return apiClient.post(`/${userId}/tasks`, {
      ...taskData,
      user_id: userId
    });
  },

  // Get a specific task
  getTask: (userId: number, taskId: number): Promise<AxiosResponse> => {
    return apiClient.get(`/${userId}/tasks/${taskId}`);
  },

  // Update a task
  updateTask: (userId: number, taskId: number, taskData: {
    title?: string;
    description?: string;
    completed?: boolean;
    due_date?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<AxiosResponse> => {
    return apiClient.put(`/${userId}/tasks/${taskId}`, taskData);
  },

  // Delete a task
  deleteTask: (userId: number, taskId: number): Promise<AxiosResponse> => {
    return apiClient.delete(`/${userId}/tasks/${taskId}`);
  },

  // Toggle task completion
  toggleTaskCompletion: (userId: number, taskId: number): Promise<AxiosResponse> => {
    return apiClient.patch(`/${userId}/tasks/${taskId}/complete`);
  },
};

export default apiClient;
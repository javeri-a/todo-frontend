// frontend/src/app/tasks/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/types/task';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/Button';
import { motion } from 'framer-motion';
import {
  loadGuestTasks,
  addGuestTask,
  updateGuestTask,
  deleteGuestTask,
  toggleGuestTaskCompletion
} from '@/utils/guestTasks';
import ChatInterface from '@/components/chat/ChatInterface';
import { FiPlus, FiMessageSquare, FiCheck, FiX, FiCalendar, FiFlag, FiFilter, FiChevronDown, FiChevronUp, FiUser, FiClock, FiTrash2, FiEdit2 } from 'react-icons/fi';

const TasksPage = () => {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at');
  const [showChat, setShowChat] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Check if we're coming from the chatbot icon on the homepage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatParam = urlParams.get('chat');
    if (chatParam === 'open') {
      setShowChat(true);
    }
  }, []);

  // Determine if user is a guest (not logged in)
  const isGuest = !userId;

  // Fetch tasks - either from API for authenticated users or from localStorage for guests
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        if (isGuest) {
          // Load guest tasks from localStorage
          const guestTasks = loadGuestTasks();
          setTasks(guestTasks);
        } else {
          // Load authenticated user tasks from API
          const response = await tasksAPI.getUserTasks(userId, {
            completed: filter === 'completed' ? true : filter === 'active' ? false : undefined,
            sort_by: sortBy
          });
          setTasks(response.data);
        }
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId, filter, sortBy, isGuest]);

  // Handle form submission (create/update) - different for guests vs authenticated users
  const handleSubmitTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        // Update existing task
        if (isGuest) {
          // Update guest task in localStorage
          const updatedTask = updateGuestTask(editingTask.id, taskData);
          if (updatedTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
          }
        } else {
          // Update authenticated user task via API
          const response = await tasksAPI.updateTask(userId!, editingTask.id, taskData);
          setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t));
        }
      } else {
        // Create new task
        if (isGuest) {
          // Create guest task in localStorage
          const newTask = addGuestTask({
            title: taskData.title!,
            description: taskData.description,
            completed: taskData.completed || false,
            due_date: taskData.due_date,
            category: taskData.category,
            priority: taskData.priority,
            user_id: 0
          });
          setTasks([newTask, ...tasks]);
        } else {
          // Create authenticated user task via API
          const response = await tasksAPI.createTask(userId!, {
            title: taskData.title!,
            description: taskData.description,
            completed: taskData.completed || false,
            due_date: taskData.due_date,
            category: taskData.category,
            priority: taskData.priority
          });
          setTasks([response.data, ...tasks]);
        }
      }

      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      setError('Failed to save task');
      console.error(err);
    }
  };

  // Handle task operations from chat
  const handleAddTaskFromChat = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (isGuest) {
      const newTask = addGuestTask(taskData);
      setTasks([newTask, ...tasks]);
    } else {
      const { user_id, ...taskWithoutUserId } = taskData; // Extract user_id and get the rest
      tasksAPI.createTask(userId!, {
        ...taskWithoutUserId,
        completed: taskData.completed || false,
      }).then(response => {
        setTasks([response.data, ...tasks]);
      }).catch(err => {
        setError('Failed to add task from chat');
        console.error(err);
      });
    }
  };

  const handleUpdateTaskFromChat = (id: number, updates: Partial<Task>) => {
    if (isGuest) {
      const updatedTask = updateGuestTask(id, updates);
      if (updatedTask) {
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      }
    } else {
      tasksAPI.updateTask(userId!, id, updates).then(response => {
        setTasks(tasks.map(t => t.id === id ? response.data : t));
      }).catch(err => {
        setError('Failed to update task from chat');
        console.error(err);
      });
    }
  };

  const handleDeleteTaskFromChat = (id: number) => {
    if (isGuest) {
      const success = deleteGuestTask(id);
      if (success) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } else {
      tasksAPI.deleteTask(userId!, id).then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      }).catch(err => {
        setError('Failed to delete task from chat');
        console.error(err);
      });
    }
  };

  // Handle task completion toggle - different for guests vs authenticated users
  const handleToggleComplete = async (taskId: number) => {
    try {
      if (isGuest) {
        // Toggle guest task in localStorage
        const updatedTask = toggleGuestTaskCompletion(taskId);
        if (updatedTask) {
          setTasks(tasks.map(task =>
            task.id === taskId ? updatedTask : task
          ));
        }
      } else {
        // Toggle authenticated user task via API
        const response = await tasksAPI.toggleTaskCompletion(userId!, taskId);
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, completed: response.data.completed } : task
        ));
      }
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Handle task deletion - different for guests vs authenticated users
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (isGuest) {
          // Delete guest task from localStorage
          const success = deleteGuestTask(taskId);
          if (success) {
            setTasks(tasks.filter(task => task.id !== taskId));
          }
        } else {
          // Delete authenticated user task via API
          await tasksAPI.deleteTask(userId!, taskId);
          setTasks(tasks.filter(task => task.id !== taskId));
        }
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else {
      // Sort by created_at (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Stats for dashboard
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {isGuest ? 'Guest Tasks' : 'Your Tasks'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isGuest
                  ? 'Manage your tasks without an account'
                  : 'Organize and track your tasks efficiently'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => setShowForm(!showForm)}
                className={`flex items-center px-5 py-3 rounded-lg text-white ${
                  showForm 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                {showForm ? (
                  <>
                    <FiX className="mr-2" /> Cancel
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" /> Add Task
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowChat(!showChat)}
                className={`flex items-center px-5 py-3 rounded-lg text-white ${
                  showChat 
                    ? 'bg-gray-500 hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'
                } transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <FiMessageSquare className="mr-2" />
                {showChat ? 'Hide Chat' : 'AI Assistant'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FiCheck className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <FiClock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <FiFlag className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Guest notice */}
        {isGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 rounded-lg mb-6"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <FiUser className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  You are using the guest mode. Your tasks will be saved in your browser's local storage and will be lost if you clear your browser data.
                  <br />
                  <a href="/signup" className="font-medium text-blue-600 hover:text-blue-800 underline transition-colors">
                    Sign up for an account to save your tasks securely.
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FiFilter className="mr-2" />
                  Filters
                  {showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
                </button>
                
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white appearance-none transition-colors"
                        >
                          <option value="all">All Tasks</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as 'created_at' | 'title')}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white appearance-none transition-colors"
                        >
                          <option value="created_at">Date Created</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white appearance-none transition-colors"
                >
                  <option value="all">All Tasks</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'created_at' | 'title')}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white appearance-none transition-colors"
                >
                  <option value="created_at">Date Created</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 font-medium">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
            </div>
          </div>
        </motion.div>

        {/* Task Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiEdit2 className="mr-2 text-blue-600" />
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={handleSubmitTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              submitButtonText={editingTask ? 'Update Task' : 'Create Task'}
            />
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg bg-red-50 p-4 border border-red-200 mb-6"
          >
            <div className="flex items-center">
              <span className="text-red-700">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Main Content and Chat */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col lg:flex-row gap-6"
          >
            {/* Tasks Grid */}
            <div className={`${showChat ? 'lg:w-2/3' : 'w-full'}`}>
              {sortedTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TaskCard
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100"
                >
                  <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                    <FiCalendar className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">No tasks yet</h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    {filter === 'all'
                      ? "Get started by creating your first task."
                      : `No ${filter} tasks. Change the filter to see all tasks.`}
                  </p>
                  <div className="mt-8">
                    <Button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FiPlus className="mr-2" /> Create Your First Task
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Interface - Visible when showChat is true */}
            {showChat && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:w-1/3"
              >
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <FiMessageSquare className="mr-2" /> AI Assistant
                      </h3>
                      <button 
                        onClick={() => setShowChat(false)}
                        className="text-white hover:text-gray-200"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <ChatInterface
                      tasks={tasks}
                      onAddTask={handleAddTaskFromChat}
                      onUpdateTask={handleUpdateTaskFromChat}
                      onDeleteTask={handleDeleteTaskFromChat}
                      onSetFilter={setFilter}
                      onSetSortBy={setSortBy}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
// frontend/src/app/tasks/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { tasksAPI } from '@/lib/api';
import { Task } from '@/types/task';
import { Button } from '@/components/Button';
import TaskForm from '@/components/TaskForm';

const TaskDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch task details
  useEffect(() => {
    if (!userId || !id) return;
    
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await tasksAPI.getTask(userId, Number(id));
        setTask(response.data);
      } catch (err) {
        setError('Failed to fetch task details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [userId, id]);

  // Handle task completion toggle
  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      const response = await tasksAPI.toggleTaskCompletion(userId!, task.id);
      setTask({ ...task, completed: response.data.completed });
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!task || !window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.deleteTask(userId!, task.id);
      router.push('/tasks'); // Redirect to tasks list after deletion
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Handle task update
  const handleUpdate = async (taskData: Partial<Task>) => {
    if (!task) return;
    
    try {
      const response = await tasksAPI.updateTask(userId!, task.id, taskData);
      setTask(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view task details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Task not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Details</h1>
          <Button onClick={() => router.back()} variant="outline">
            Back to Tasks
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {isEditing ? (
          <div className="card p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              submitButtonText="Update Task"
            />
          </div>
        ) : (
          <div className={`card p-6 rounded-lg shadow-md border-l-4 ${
            task.completed 
              ? 'border-green-500 bg-green-50' 
              : 'border-blue-500 bg-white'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold mb-4 ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {task.title}
                </h2>
                
                {task.description && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">Created:</p>
                    <p>{new Date(task.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Updated:</p>
                    <p>{new Date(task.updated_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status:</p>
                    <p className={task.completed ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">ID:</p>
                    <p>{task.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex flex-col space-y-3">
                <Button
                  variant={task.completed ? "secondary" : "outline"}
                  onClick={handleToggleComplete}
                >
                  {task.completed ? 'Mark as Pending' : 'Mark as Complete'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Task
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;
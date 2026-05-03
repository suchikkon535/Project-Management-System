'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  currentUser,
  initialProjects,
  initialTasks,
  initialWorkers,
  initialActivities,
} from '@/lib/mock-data';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [workers, setWorkers] = useState(initialWorkers);
  const [activities, setActivities] = useState(initialActivities);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('light');

  // Theme management with localStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem('taskflow-theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('taskflow-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  // Toast management
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Project CRUD
  const addProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    addToast(`Project "${project.name}" created`);
    return newProject;
  }, [addToast]);

  const updateProject = useCallback((id, updates) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Project updated');
  }, [addToast]);

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    addToast('Project deleted');
  }, [addToast]);

  // Task CRUD
  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    addToast(`Task "${task.title}" created`);
    return newTask;
  }, [addToast]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('Task deleted');
  }, [addToast]);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  // Worker CRUD
  const addWorker = useCallback((worker) => {
    const newWorker = {
      ...worker,
      id: `user-${Date.now()}`,
      initials: worker.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setWorkers((prev) => [...prev, newWorker]);
    addToast(`Invited ${worker.name}`);
    return newWorker;
  }, [addToast]);

  const removeWorker = useCallback((id) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    addToast('Worker removed');
  }, [addToast]);

  // Derived data
  const getProjectTasks = useCallback(
    (projectId) => tasks.filter((t) => t.projectId === projectId),
    [tasks]
  );

  const getProjectById = useCallback(
    (id) => projects.find((p) => p.id === id),
    [projects]
  );

  const getWorkerById = useCallback(
    (id) => workers.find((w) => w.id === id),
    [workers]
  );

  const stats = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'done').length,
    teamMembers: workers.length,
  };

  const value = {
    user,
    projects,
    tasks,
    workers,
    activities,
    toasts,
    theme,
    stats,
    toggleTheme,
    addToast,
    removeToast,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addWorker,
    removeWorker,
    getProjectTasks,
    getProjectById,
    getWorkerById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

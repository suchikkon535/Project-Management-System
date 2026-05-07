'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { fetchSidebarProjects, fetchTasks } from '@/lib/api';
import {
  currentUser,
  initialWorkers,
  initialActivities,
} from '@/lib/mock-data';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user] = useState(currentUser);
  const [sidebarProjects, setSidebarProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState(initialWorkers);
  const [activities, setActivities] = useState(initialActivities);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState('light');

  // Loading & error states
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);
  const [tasksError, setTasksError] = useState(null);

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

  // ─── Fetch sidebar projects from API ────────────────────────────────────────
  const loadSidebarProjects = useCallback(async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      const data = await fetchSidebarProjects();
      setSidebarProjects(data);
    } catch (err) {
      console.error('Failed to load sidebar projects:', err);
      setProjectsError(err.message);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // ─── Fetch tasks from API ──────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      setTasksError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setTasksError(err.message);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    loadSidebarProjects();
    loadTasks();
  }, [loadSidebarProjects, loadTasks]);

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

  // Project CRUD (local state operations — kept for UI interactions)
  const addProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      _id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSidebarProjects((prev) => [...prev, newProject]);
    addToast(`Project "${project.name}" created`);
    return newProject;
  }, [addToast]);

  const updateProject = useCallback((id, updates) => {
    setSidebarProjects((prev) =>
      prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updates } : p))
    );
    addToast('Project updated');
  }, [addToast]);

  const deleteProject = useCallback((id) => {
    setSidebarProjects((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    addToast('Project deleted');
  }, [addToast]);

  // Task CRUD (local state operations)
  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      _id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    addToast(`Task "${task.title}" created`);
    return newTask;
  }, [addToast]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id || t._id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    addToast('Task deleted');
  }, [addToast]);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId || t._id === taskId ? { ...t, status: newStatus } : t))
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
    (id) => sidebarProjects.find((p) => p.id === id || p._id === id),
    [sidebarProjects]
  );

  const getWorkerById = useCallback(
    (id) => workers.find((w) => w.id === id),
    [workers]
  );

  const stats = {
    totalProjects: sidebarProjects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'done' || t.completed).length,
    teamMembers: workers.length,
  };

  const value = {
    user,
    projects: sidebarProjects,
    sidebarProjects,
    tasks,
    workers,
    activities,
    toasts,
    theme,
    stats,
    projectsLoading,
    tasksLoading,
    projectsError,
    tasksError,
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
    loadSidebarProjects,
    loadTasks,
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

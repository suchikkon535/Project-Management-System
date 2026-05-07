'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchTasks } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskListView from '@/components/tasks/TaskListView';
import WorkersList from '@/components/workers/WorkersList';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import Link from 'next/link';

export default function ProjectDetailPage({ params }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { getProjectById, updateProject, projectsLoading } = useApp();
  const [viewMode, setViewMode] = useState('kanban');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  // Project-specific task fetching
  const [projectTasks, setProjectTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  const loadProjectTasks = useCallback(async () => {
    try {
      setTasksLoading(true);
      setTasksError(null);
      const data = await fetchTasks(projectId);
      setProjectTasks(data);
    } catch (err) {
      console.error('Failed to load project tasks:', err);
      setTasksError(err.message);
    } finally {
      setTasksLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProjectTasks();
  }, [loadProjectTasks]);

  const project = getProjectById(projectId);

  // If projects are still loading, show a loading state
  if (projectsLoading || !project) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: project.color }}
          >
            {project.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowCreateTask(true)}
          className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
          id="create-task-btn"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="h-10 rounded-xl bg-muted p-1">
            <TabsTrigger value="tasks" className="rounded-lg text-sm px-4">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="workers" className="rounded-lg text-sm px-4">
              Workers
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg text-sm px-4">
              Settings
            </TabsTrigger>
          </TabsList>

          {activeTab === 'tasks' && (
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="Kanban view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <TabsContent value="tasks" className="mt-4">
          {tasksLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Loading tasks...</span>
            </div>
          ) : tasksError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Failed to load tasks</p>
                <p className="text-xs text-muted-foreground mt-1">{tasksError}</p>
              </div>
              <Button onClick={loadProjectTasks} variant="outline" className="rounded-xl gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard tasks={projectTasks} projectId={project._id} />
          ) : (
            <TaskListView tasks={projectTasks} projectId={project._id} />
          )}
        </TabsContent>

        <TabsContent value="workers" className="mt-4">
          <WorkersList />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <ProjectSettings project={project} onUpdate={updateProject} />
        </TabsContent>
      </Tabs>

      <CreateTaskModal
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        projectId={project._id}
      />
    </div>
  );
}

function ProjectSettings({ project, onUpdate }) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');

  const handleSave = () => {
    onUpdate(project._id || project.id, { name, description });
  };

  return (
    <div className="max-w-lg space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
          <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

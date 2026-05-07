'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle, RefreshCw, Lock, Globe, Users } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import Link from 'next/link';
import { fetchFullProjects } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFullProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your team&apos;s work
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
          id="create-project-btn"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Failed to load projects</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
          <Button
            onClick={loadProjects}
            variant="outline"
            className="rounded-xl gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Project Grid */}
      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <EmptyState
              type="projects"
              action={
                <Button
                  onClick={() => setShowCreate(true)}
                  className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  Create your first project
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => {
                const progress = project.taskCount > 0
                  ? Math.round((project.completedTaskCount / project.taskCount) * 100)
                  : 0;

                return (
                  <Link key={project._id} href={`/projects/${project._id}`}>
                    <Card
                      className="rounded-2xl border-border hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <CardContent className="p-5 space-y-4">
                        {/* Color bar + title */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: project.color }}
                            >
                              {project.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {project.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {project.description || 'No description'}
                              </p>
                            </div>
                          </div>
                          {/* Visibility badge */}
                          <div className="shrink-0 mt-0.5">
                            {project.visibility === 'private' ? (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: project.color,
                              }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {project.completedTaskCount}/{project.taskCount} tasks
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            project.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}

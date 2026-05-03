'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AvatarGroup from '@/components/shared/AvatarGroup';
import EmptyState from '@/components/shared/EmptyState';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import Link from 'next/link';

export default function ProjectsPage() {
  const { projects, tasks, workers } = useApp();
  const [showCreate, setShowCreate] = useState(false);

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

      {/* Project Grid */}
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
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const completedCount = projectTasks.filter((t) => t.status === 'done').length;
            const progress = projectTasks.length > 0
              ? Math.round((completedCount / projectTasks.length) * 100)
              : 0;

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
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
                            {project.description}
                          </p>
                        </div>
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
                        {completedCount}/{projectTasks.length} tasks
                      </span>
                      <AvatarGroup workers={workers.slice(0, 3)} max={3} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
